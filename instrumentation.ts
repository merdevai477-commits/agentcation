export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  try {
    const { ensureSessionsRestored } = await import('@/lib/server/whatsapp-session')
    // Fire-and-forget — don't block boot if WhatsApp restore is slow
    void ensureSessionsRestored()
  } catch (err) {
    console.error('[instrumentation] whatsapp restore', (err as Error).message)
  }
}
