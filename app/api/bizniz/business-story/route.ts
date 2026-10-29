import { prisma } from '@/lib/server/prisma'
import { jsonError, requireUserContext } from '@/lib/server/require-user'
import { normalizeStory } from '@/lib/server/story'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { userId, organizationId } = await requireUserContext()
    const row =
      (await prisma.businessStory.findUnique({ where: { userId } })) ||
      (await prisma.businessStory.findUnique({ where: { organizationId } }))
    return Response.json({
      success: true,
      userId,
      story: normalizeStory(row?.payload),
    })
  } catch (err) {
    return jsonError(err)
  }
}

export async function PUT(req: Request) {
  try {
    const { userId, organizationId } = await requireUserContext()
    const body = await req.json().catch(() => ({}))
    const story = normalizeStory((body as { story?: unknown })?.story ?? body)
    const row = await prisma.businessStory.upsert({
      where: { userId },
      create: { userId, organizationId, payload: story },
      update: { organizationId, payload: story },
    })
    return Response.json({
      success: true,
      userId,
      story: normalizeStory(row.payload),
    })
  } catch (err) {
    return jsonError(err)
  }
}
