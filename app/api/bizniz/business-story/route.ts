import { prisma } from '@/lib/server/prisma'
import { DEFAULT_STORY } from '@/lib/server/org'
import { jsonError, requireUserContext } from '@/lib/server/require-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function normalizeStory(input: unknown) {
  const base = {
    ...DEFAULT_STORY,
    ...(input && typeof input === 'object' ? (input as Record<string, unknown>) : {}),
  }
  return {
    businessName: String(base.businessName || ''),
    dialect: String(base.dialect || 'egyptian_colloquial'),
    tone: String(base.tone || 'friendly_support'),
    services: Array.isArray(base.services) ? base.services.map(String) : [],
    hours: String(base.hours || ''),
    pricingNotes: String(base.pricingNotes || ''),
    faqs: Array.isArray(base.faqs)
      ? (base.faqs as { q?: string; a?: string }[])
          .map((f) => ({ q: String(f?.q || ''), a: String(f?.a || '') }))
          .filter((f) => f.q || f.a)
      : [],
    doNot: Array.isArray(base.doNot) ? base.doNot.map(String) : [],
    sampleReplies: Array.isArray(base.sampleReplies) ? base.sampleReplies.map(String) : [],
  }
}

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
