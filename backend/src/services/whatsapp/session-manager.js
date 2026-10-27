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
const runtimes = new Map()

function sessionsRoot() {
  return path.resolve(env.whatsappSessionsDir)
}

function authPathFor(organizationId) {
  return path.join(sessionsRoot(), organizationId)
}

function getRuntime(organizationId) {
  let rt = runtimes.get(organizationId)
  if (!rt) {
    rt = {
      sock: null,
      starting: false,
      qrDataUrl: null,
      events: new EventEmitter(),
    }
    rt.events.setMaxListeners(50)
    runtimes.set(organizationId, rt)
  }
  return rt
}

function emit(organizationId, type, payload = {}) {
  const rt = getRuntime(organizationId)
  rt.events.emit('event', { type, ...payload, at: new Date().toISOString() })
}

async function persist(organizationId, data) {
  const authDir = authPathFor(organizationId)
  return prisma.whatsAppSession.upsert({
    where: { organizationId },
    create: {
      organizationId,
      authDir,
      status: data.status || 'stopped',
      phoneE164: data.phoneE164 ?? null,
      displayName: data.displayName ?? null,
      lastQrAt: data.lastQrAt ?? null,
      lastError: data.lastError ?? null,
    },
    update: {
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

export async function getSession(organizationId) {
  const row = await prisma.whatsAppSession.findUnique({ where: { organizationId } })
  const rt = getRuntime(organizationId)
  return {
    status: row?.status || 'stopped',
    phoneE164: row?.phoneE164 || null,
    displayName: row?.displayName || null,
    lastError: row?.lastError || null,
    lastQrAt: row?.lastQrAt || null,
    qrDataUrl: rt.qrDataUrl,
  }
}

export function subscribe(organizationId, listener) {
  const rt = getRuntime(organizationId)
  rt.events.on('event', listener)
  return () => rt.events.off('event', listener)
}

export async function startSession(organizationId) {
  const rt = getRuntime(organizationId)
  if (rt.sock || rt.starting) {
    return getSession(organizationId)
  }

  rt.starting = true
  fs.mkdirSync(authPathFor(organizationId), { recursive: true })
  await persist(organizationId, { status: 'connecting', lastError: null })
  emit(organizationId, 'status', { status: 'connecting' })

  try {
    const { state, saveCreds } = await useMultiFileAuthState(authPathFor(organizationId))
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
        await persist(organizationId, { status: 'qr', lastQrAt: new Date(), lastError: null })
        emit(organizationId, 'qr', { qrDataUrl: rt.qrDataUrl, status: 'qr' })
        emit(organizationId, 'status', { status: 'qr' })
      }

      if (connection === 'open') {
        rt.qrDataUrl = null
        const phoneE164 = jidToPhone(sock.user?.id)
        const displayName = sock.user?.name || sock.user?.verifiedName || null
        await persist(organizationId, {
          status: 'ready',
          phoneE164,
          displayName,
          lastError: null,
        })
        emit(organizationId, 'ready', { status: 'ready', phoneE164, displayName })
        emit(organizationId, 'status', { status: 'ready', phoneE164, displayName })
      }

      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode
        const loggedOut = code === DisconnectReason.loggedOut
        rt.sock = null
        rt.starting = false
        rt.qrDataUrl = null
        if (loggedOut) {
          await persist(organizationId, {
            status: 'logged_out',
            phoneE164: null,
            displayName: null,
            lastError: 'Logged out',
          })
          emit(organizationId, 'status', { status: 'logged_out' })
          return
        }
        await persist(organizationId, {
          status: 'stopped',
          lastError: lastDisconnect?.error?.message || 'Connection closed',
        })
        emit(organizationId, 'status', { status: 'stopped' })
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
          remoteJid,
          contactName,
          text: text.trim(),
          waMessageId: msg.key.id || null,
          sendText: async (jid, body) => {
            if (!rt.sock) return
            await rt.sock.sendMessage(jid, { text: body })
          },
        })
      }
    })

    rt.starting = false
    return getSession(organizationId)
  } catch (err) {
    rt.starting = false
    rt.sock = null
    await persist(organizationId, { status: 'stopped', lastError: err.message })
    emit(organizationId, 'status', { status: 'stopped', error: err.message })
    throw err
  }
}

export async function stopSession(organizationId) {
  const rt = getRuntime(organizationId)
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
  await persist(organizationId, { status: 'stopped', lastError: null })
  emit(organizationId, 'status', { status: 'stopped' })
  return getSession(organizationId)
}

export async function clearSession(organizationId) {
  const rt = getRuntime(organizationId)
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

  const dir = authPathFor(organizationId)
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true })
  }

  await persist(organizationId, {
    status: 'logged_out',
    phoneE164: null,
    displayName: null,
    lastError: null,
  })
  emit(organizationId, 'status', { status: 'logged_out' })
  return getSession(organizationId)
}
