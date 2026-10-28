import { auth } from '@clerk/nextjs/server'
import { ensureUserOrg } from './org'

export async function requireUserContext() {
  if (!process.env.DATABASE_URL) {
    throw Object.assign(new Error('DATABASE_URL is not configured on this deployment'), {
      status: 503,
    })
  }

  const { userId } = await auth()
  if (!userId) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 })
  }

  const ctx = await ensureUserOrg(userId)
  return ctx
}

export function jsonError(err: unknown) {
  const status = (err as { status?: number })?.status || 500
  const message = (err as Error)?.message || 'Internal server error'
  return Response.json({ success: false, error: message }, { status })
}
