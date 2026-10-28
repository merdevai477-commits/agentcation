import { getSession } from '@/lib/server/whatsapp-session'
import { jsonError, requireUserContext } from '@/lib/server/require-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId } = await requireUserContext()
    const session = await getSession(userId)
    return Response.json({ success: true, session })
  } catch (err) {
    return jsonError(err)
  }
}
