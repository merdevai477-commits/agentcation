import { ensureUserOrg } from '../lib/org.js'
import {
  clearSession,
  getSession,
  startSession,
  stopSession,
  subscribe,
} from '../services/whatsapp/session-manager.js'

export async function sessionStatus(req, res, next) {
  try {
    const { organizationId } = await ensureUserOrg(req.userId)
    void organizationId
    const session = await getSession(req.userId)
    return res.json({ success: true, session })
  } catch (err) {
    return next(err)
  }
}

export async function sessionStart(req, res, next) {
  try {
    const { organizationId } = await ensureUserOrg(req.userId)
    const session = await startSession(req.userId, organizationId)
    return res.json({ success: true, session })
  } catch (err) {
    return next(err)
  }
}

export async function sessionStop(req, res, next) {
  try {
    const { organizationId } = await ensureUserOrg(req.userId)
    const session = await stopSession(req.userId, organizationId)
    return res.json({ success: true, session })
  } catch (err) {
    return next(err)
  }
}

export async function sessionClear(req, res, next) {
  try {
    const { organizationId } = await ensureUserOrg(req.userId)
    const session = await clearSession(req.userId, organizationId)
    return res.json({ success: true, session })
  } catch (err) {
    return next(err)
  }
}

export async function sessionEvents(req, res, next) {
  try {
    await ensureUserOrg(req.userId)

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.flushHeaders?.()

    const send = (payload) => {
      res.write(`data: ${JSON.stringify(payload)}\n\n`)
    }

    const current = await getSession(req.userId)
    send({ type: 'status', ...current })

    const unsub = subscribe(req.userId, send)
    const heartbeat = setInterval(() => {
      res.write(`: ping\n\n`)
    }, 15000)

    req.on('close', () => {
      clearInterval(heartbeat)
      unsub()
    })
  } catch (err) {
    return next(err)
  }
}
