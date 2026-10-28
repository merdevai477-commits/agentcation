import fs from 'fs'
import path from 'path'
import { EventEmitter } from 'events'
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  type WASocket,
} from '@whiskeysockets/baileys'
import QRCode from 'qrcode'
import pino from 'pino'
import { prisma } from './prisma'
import { handleIncomingText } from './bizniz-reply'

const logger = pino({ level: 'silent' })

type Runtime = {
  sock: WASocket | null
  starting: boolean
  qrDataUrl: string | null
  events: EventEmitter
  organizationId: string | null
  /** When true, unexpected disconnects auto-reconnect using saved auth files */
  shouldReconnect: boolean
  reconnectTimer: ReturnType<typeof setTimeout> | null
  reconnectAttempt: number
}

/** In-memory runtimes keyed by Clerk userId — one live WhatsApp session per user. */
const runtimes = new Map<string, Runtime>()
let restoreStarted = false

function sessionsRoot() {
  return path.resolve(process.env.WHATSAPP_SESSIONS_DIR || './.wa-sessions')
}

function authPathFor(userId: string) {
  return path.join(sessionsRoot(), userId)
}

function hasSavedCreds(userId: string) {
  return fs.existsSync(path.join(authPathFor(userId), 'creds.json'))
}

function getRuntime(userId: string) {
  let rt = runtimes.get(userId)
  if (!rt) {
    rt = {
      sock: null,
      starting: false,
      qrDataUrl: null,
      events: new EventEmitter(),
      organizationId: null,
      shouldReconnect: false,
      reconnectTimer: null,
      reconnectAttempt: 0,
    }
    rt.events.setMaxListeners(50)
    runtimes.set(userId, rt)
  }
  return rt
}

function clearReconnectTimer(rt: Runtime) {
  if (rt.reconnectTimer) {
    clearTimeout(rt.reconnectTimer)
    rt.reconnectTimer = null
  }
}

function emit(userId: string, type: string, payload: Record<string, unknown> = {}) {
  getRuntime(userId).events.emit('event', {
    type,
    ...payload,
    userId,
    at: new Date().toISOString(),
  })
}

async function persist(
  userId: string,
  organizationId: string,
  data: {
    status?: string
    phoneE164?: string | null
    displayName?: string | null
    lastQrAt?: Date | null
    lastError?: string | null
  },
) {
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

function jidToPhone(jid?: string | null) {
  if (!jid) return null
  const user = String(jid).split('@')[0] || ''
  const digits = user.replace(/\D/g, '')
  return digits ? `+${digits}` : null
}

function disconnectCode(err: unknown): number | undefined {
  return (err as { output?: { statusCode?: number } } | undefined)?.output?.statusCode
}

function scheduleReconnect(userId: string, organizationId: string) {
  const rt = getRuntime(userId)
  if (!rt.shouldReconnect || rt.starting || rt.sock) return
  if (!hasSavedCreds(userId)) {
    rt.shouldReconnect = false
    void persist(userId, organizationId, {
      status: 'logged_out',
      lastError: 'Session files missing — scan QR again',
    })
    emit(userId, 'status', { status: 'logged_out' })
    return
  }

  clearReconnectTimer(rt)
  const attempt = rt.reconnectAttempt
  const delay = Math.min(45_000, 1500 * Math.pow(2, Math.min(attempt, 5)))
  rt.reconnectAttempt = attempt + 1

  void persist(userId, organizationId, {
    status: 'reconnecting',
    lastError: `Reconnecting (attempt ${rt.reconnectAttempt})…`,
  })
  emit(userId, 'status', {
    status: 'reconnecting',
    attempt: rt.reconnectAttempt,
    delayMs: delay,
  })

  rt.reconnectTimer = setTimeout(() => {
    rt.reconnectTimer = null
    void startSession(userId, organizationId).catch((err) => {
      console.error('[whatsapp] reconnect failed', userId, (err as Error).message)
      scheduleReconnect(userId, organizationId)
    })
  }, delay)
}

export async function getSession(userId: string) {
  // Kick off restore of previously linked sessions after cold start
  void ensureSessionsRestored()

  const row = await prisma.whatsAppSession.findUnique({ where: { userId } })
  const rt = getRuntime(userId)
  const live = Boolean(rt.sock)
  let status = row?.status || 'stopped'
  if (status === 'ready' && !live && rt.shouldReconnect) status = 'reconnecting'
  if (status === 'ready' && !live && !rt.shouldReconnect && hasSavedCreds(userId)) {
    // Creds exist but socket dead — offer auto-resume
    status = 'reconnecting'
  }

  return {
    userId,
    status,
    phoneE164: row?.phoneE164 || null,
    displayName: row?.displayName || null,
    lastError: row?.lastError || null,
    lastQrAt: row?.lastQrAt?.toISOString() || null,
    qrDataUrl: rt.qrDataUrl,
    linked: Boolean(row?.phoneE164) || hasSavedCreds(userId),
    live,
  }
}

export function subscribe(userId: string, listener: (payload: Record<string, unknown>) => void) {
  void ensureSessionsRestored()
  const rt = getRuntime(userId)
  const handler = (payload: Record<string, unknown>) => listener(payload)
  rt.events.on('event', handler)
  return () => rt.events.off('event', handler)
}

export async function startSession(userId: string, organizationId: string) {
  const rt = getRuntime(userId)
  rt.organizationId = organizationId
  rt.shouldReconnect = true
  clearReconnectTimer(rt)

  if (rt.sock || rt.starting) return getSession(userId)

  rt.starting = true
  fs.mkdirSync(authPathFor(userId), { recursive: true })
  const resuming = hasSavedCreds(userId)
  await persist(userId, organizationId, {
    status: resuming ? 'reconnecting' : 'connecting',
    lastError: null,
  })
  emit(userId, 'status', { status: resuming ? 'reconnecting' : 'connecting' })

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
      // Keep connection healthier on cloud hosts
      keepAliveIntervalMs: 20_000,
      connectTimeoutMs: 60_000,
      retryRequestDelayMs: 500,
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
        rt.reconnectAttempt = 0
        clearReconnectTimer(rt)
        const phoneE164 = jidToPhone(sock.user?.id)
        const displayName =
          (sock.user as { name?: string; verifiedName?: string } | undefined)?.name ||
          (sock.user as { verifiedName?: string } | undefined)?.verifiedName ||
          null
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
        const code = disconnectCode(lastDisconnect?.error)
        const loggedOut = code === DisconnectReason.loggedOut
        const restarted = code === DisconnectReason.restartRequired
        rt.sock = null
        rt.starting = false
        rt.qrDataUrl = null

        if (loggedOut) {
          rt.shouldReconnect = false
          clearReconnectTimer(rt)
          await persist(userId, organizationId, {
            status: 'logged_out',
            phoneE164: null,
            displayName: null,
            lastError: 'Logged out from phone — scan QR again',
          })
          emit(userId, 'status', { status: 'logged_out' })
          return
        }

        if (!rt.shouldReconnect) {
          await persist(userId, organizationId, {
            status: 'stopped',
            lastError: (lastDisconnect?.error as Error | undefined)?.message || 'Stopped',
          })
          emit(userId, 'status', { status: 'stopped' })
          return
        }

        // Network blip / restartRequired / server recycle → keep auth and reconnect
        const reason =
          (lastDisconnect?.error as Error | undefined)?.message ||
          (restarted ? 'Restart required' : 'Connection closed')
        await persist(userId, organizationId, {
          status: 'reconnecting',
          lastError: reason,
        })
        emit(userId, 'status', { status: 'reconnecting', error: reason })
        scheduleReconnect(userId, organizationId)
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

        await handleIncomingText({
          organizationId,
          userId,
          remoteJid,
          contactName: msg.pushName || null,
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
    await persist(userId, organizationId, {
      status: rt.shouldReconnect ? 'reconnecting' : 'stopped',
      lastError: (err as Error).message,
    })
    emit(userId, 'status', {
      status: rt.shouldReconnect ? 'reconnecting' : 'stopped',
      error: (err as Error).message,
    })
    if (rt.shouldReconnect) scheduleReconnect(userId, organizationId)
    throw err
  }
}

export async function stopSession(userId: string, organizationId: string) {
  const rt = getRuntime(userId)
  rt.shouldReconnect = false
  clearReconnectTimer(rt)
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

export async function clearSession(userId: string, organizationId: string) {
  const rt = getRuntime(userId)
  rt.shouldReconnect = false
  clearReconnectTimer(rt)
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
  rt.reconnectAttempt = 0

  const dir = authPathFor(userId)
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true })

  await persist(userId, organizationId, {
    status: 'logged_out',
    phoneE164: null,
    displayName: null,
    lastError: null,
  })
  emit(userId, 'status', { status: 'logged_out' })
  return getSession(userId)
}

/** After deploy/restart: resume sessions that still have creds on disk */
export async function ensureSessionsRestored() {
  if (restoreStarted) return
  restoreStarted = true
  try {
    if (!process.env.DATABASE_URL?.trim()) return
    const rows = await prisma.whatsAppSession.findMany({
      where: {
        status: { in: ['ready', 'connecting', 'reconnecting', 'qr'] },
      },
      take: 50,
    })
    for (const row of rows) {
      if (!hasSavedCreds(row.userId)) continue
      const rt = getRuntime(row.userId)
      if (rt.sock || rt.starting) continue
      rt.shouldReconnect = true
      rt.organizationId = row.organizationId
      void startSession(row.userId, row.organizationId).catch((err) => {
        console.error('[whatsapp] restore failed', row.userId, (err as Error).message)
      })
    }
  } catch (err) {
    console.error('[whatsapp] ensureSessionsRestored', (err as Error).message)
  }
}
