import { getSession, subscribe } from '@/lib/server/whatsapp-session'
import { jsonError, requireUserContext } from '@/lib/server/require-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await requireUserContext()

    const encoder = new TextEncoder()
    let cleanup: (() => void) | null = null
    let heartbeat: ReturnType<typeof setInterval> | null = null

    const stream = new ReadableStream({
      async start(controller) {
        const send = (payload: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
        }

        const current = await getSession(userId)
        send({ type: 'status', ...current })

        cleanup = subscribe(userId, send)
        heartbeat = setInterval(() => {
          controller.enqueue(encoder.encode(`: ping\n\n`))
        }, 15000)
      },
      cancel() {
        if (heartbeat) clearInterval(heartbeat)
        cleanup?.()
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err) {
    return jsonError(err)
  }
}
