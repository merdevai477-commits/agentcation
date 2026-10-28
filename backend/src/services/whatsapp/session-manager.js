import fs from 'fs'
import path from 'path'
import { EventEmitter } from 'events'
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys'
import QRCode from 'qrcode'
import pino from 'pino'
import { prisma } from '../../lib/prisma.js'
import { env } from '../../config/env.js'
import { handleIncomingText } from '../bizniz/reply.js'

const logger = pino({ level: 'silent' })
/** @type {Map<string, any>} keyed by Clerk userId */
const runtimes = new Map()

function sessionsRoot() {
  return path.resolve(env.whatsappSessionsDir)
}

function authPathFor(userId) {
  return path.join(sessionsRoot(), userId)
}

function getRuntime(userId) {
  let rt = runtimes.get(userId)
  if (!rt) {
    rt = {
      sock: null,
      starting: false,
      qrDataUrl: null,
      events: new EventEmitter(),
    }
    rt.events.setMaxListeners(50)
    runtimes.set(userId, rt)
  }
  return rt
}

function emit(userId, type, payload = {}) {
  const rt = getRuntime(userId)
  rt.events.emit('event', { type, ...payload, userId, at: new Date().toISOString() })
}

async function persist(userId, organizationId, data) {
  const authDir = authPathFor(userId)
  return prisma.whatsAppSession.upsert({
    where: { userId },
    create: {
      userId,
      organizationId,
      authDir,
      status: data.status || 'stopped',
      phoneE164: data.phoneE164 ?? null,
      displayName: data.displayName ?? null,
      lastQrAt: data.lastQrAt ?? null,
      lastError: data.lastError ?? null,
    },
    update: {
      organizationId,
      status: data.status,
      phoneE164: data.phoneE164 === undefined ? undefined : data.phoneE164,
      displayName: data.displayName === undefined ? undefined : data.displayName,
      lastQrAt: data.lastQrAt === undefined ? undefined : data.lastQrAt,
      lastError: data.lastError === undefined ? undefined : data.lastError,
      authDir,
    },
  })
}

function jidToPhone(jid) {
  if (!jid) return null
  const user = String(jid).split('@')[0] || ''
  const digits = user.replace(/\D/g, '')
  return digits ? `+${digits}` : null
}

export async function getSession(userId) {
  const row = await prisma.whatsAppSession.findUnique({ where: { userId } })
  const rt = getRuntime(userId)
  return {
    userId,
    status: row?.status || 'stopped',
    phoneE164: row?.phoneE164 || null,
    displayName: row?.displayName || null,
    lastError: row?.lastError || null,
    lastQrAt: row?.lastQrAt || null,
    qrDataUrl: rt.qrDataUrl,
  }
}

export function subscribe(userId, listener) {
  const rt = getRuntime(userId)
  rt.events.on('event', listener)
  return () => rt.events.off('event', listener)
}

export async function startSession(userId, organizationId) {
  const rt = getRuntime(userId)
  if (rt.sock || rt.starting) {
    return getSession(userId)
  }

  rt.starting = true
  fs.mkdirSync(authPathFor(userId), { recursive: true })
  await persist(userId, organizationId, { status: 'connecting', lastError: null })
  emit(userId, 'status', { status: 'connecting' })

  try {
    const { state, saveCreds } = await useMultiFileAuthState(authPathFor(userId))
    const { version } = await fetchLatestBaileysVersion()
    const sock = makeWASocket({
      version,
      auth: state,
      logger,
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: false,
    })
    rt.sock = sock

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update
      if (qr) {
        rt.qrDataUrl = await QRCode.toDataURL(qr, { margin: 1, width: 320 })
        await persist(userId, organizationId, { status: 'qr', lastQrAt: new Date(), lastError: null })
        emit(userId, 'qr', { qrDataUrl: rt.qrDataUrl, status: 'qr' })
        emit(userId, 'status', { status: 'qr' })
      }

      if (connection === 'open') {
        rt.qrDataUrl = null
        const phoneE164 = jidToPhone(sock.user?.id)
        const displayName = sock.user?.name || sock.user?.verifiedName || null
        await persist(userId, organizationId, {
          status: 'ready',
          phoneE164,
          displayName,
          lastError: null,
        })
        emit(userId, 'ready', { status: 'ready', phoneE164, displayName })
        emit(userId, 'status', { status: 'ready', phoneE164, displayName })
      }

      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode
        const loggedOut = code === DisconnectReason.loggedOut
        rt.sock = null
        rt.starting = false
        rt.qrDataUrl = null
        if (loggedOut) {
          await persist(userId, organizationId, {
            status: 'logged_out',
            phoneE164: null,
            displayName: null,
            lastError: 'Logged out',
          })
          emit(userId, 'status', { status: 'logged_out' })
          return
        }
        await persist(userId, organizationId, {
          status: 'stopped',
          lastError: lastDisconnect?.error?.message || 'Connection closed',
        })
        emit(userId, 'status', { status: 'stopped' })
      }
    })

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return
      for (const msg of messages) {
        if (!msg.message || msg.key.fromMe) continue
        const remoteJid = msg.key.remoteJid
        if (!remoteJid || remoteJid.endsWith('@g.us') || remoteJid === 'status@broadcast') continue

        const text =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          msg.message.imageMessage?.caption ||
          ''
        if (!text.trim()) continue

        const contactName = msg.pushName || null
        await handleIncomingText({
          organizationId,
          userId,
          remoteJid,
          contactName,
          text: text.trim(),
          waMessageId: msg.key.id || null,
          sendText: async (jid, body) => {
            if (!rt.sock) return
            await rt.sock.sendMessage(jid, { text: body })
          },
          simulateTyping: async (jid, ms) => {
            if (!rt.sock) {
              await new Promise((r) => setTimeout(r, ms))
              return
            }
            try {
              await rt.sock.sendPresenceUpdate('composing', jid)
            } catch {
              /* ignore */
            }
            await new Promise((r) => setTimeout(r, ms))
            try {
              await rt.sock.sendPresenceUpdate('paused', jid)
            } catch {
              /* ignore */
            }
          },
        })
      }
    })

    rt.starting = false
    return getSession(userId)
  } catch (err) {
    rt.starting = false
    rt.sock = null
    await persist(userId, organizationId, { status: 'stopped', lastError: err.message })
    emit(userId, 'status', { status: 'stopped', error: err.message })
    throw err
  }
}

export async function stopSession(userId, organizationId) {
  const rt = getRuntime(userId)
  if (rt.sock) {
    try {
      rt.sock.end(undefined)
    } catch {
      /* ignore */
    }
    rt.sock = null
  }
  rt.starting = false
  rt.qrDataUrl = null
  await persist(userId, organizationId, { status: 'stopped', lastError: null })
  emit(userId, 'status', { status: 'stopped' })
  return getSession(userId)
}

export async function clearSession(userId, organizationId) {
  const rt = getRuntime(userId)
  if (rt.sock) {
    try {
      await rt.sock.logout()
    } catch {
      try {
        rt.sock.end(undefined)
      } catch {
        /* ignore */
      }
    }
    rt.sock = null
  }
  rt.starting = false
  rt.qrDataUrl = null

  const dir = authPathFor(userId)
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }

  await persist(userId, organizationId, {
    status: 'logged_out',
    phoneE164: null,
    displayName: null,
    lastError: null,
  })
  emit(userId, 'status', { status: 'logged_out' })
  return getSession(userId)
}
