import { restartSession } from '@/lib/server/whatsapp-session'
import { jsonError, requireUserContext } from '@/lib/server/require-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const { userId, organizationId } = await requireUserContext()
    const session = await restartSession(userId, organizationId)
    return Response.json({ success: true, session })
  } catch (err) {
    return jsonError(err)
  }
}
