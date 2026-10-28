import { prisma } from '@/lib/server/prisma'
import { DEFAULT_STORY } from '@/lib/server/org'
import { chatCompletion } from '@/lib/server/openrouter'
import { jsonError, requireUserContext } from '@/lib/server/require-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Story = typeof DEFAULT_STORY

function normalizeStory(input: unknown): Story {
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

function mergeStory(current: Story, patch: Partial<Story>): Story {
  return {
    ...current,
    ...Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    ),
    services: patch.services?.length ? patch.services : current.services,
    faqs: patch.faqs?.length ? [...current.faqs, ...patch.faqs] : current.faqs,
    doNot: patch.doNot?.length ? [...new Set([...current.doNot, ...patch.doNot])] : current.doNot,
    sampleReplies: patch.sampleReplies?.length
      ? [...current.sampleReplies, ...patch.sampleReplies]
      : current.sampleReplies,
  } as Story
}

export async function POST(req: Request) {
  try {
    const { userId, organizationId } = await requireUserContext()
    const body = (await req.json().catch(() => ({}))) as {
      message?: string
      history?: { role: string; content: string }[]
    }
    const message = String(body.message || '').trim()
    if (!message) {
      return Response.json({ success: false, error: 'Empty message' }, { status: 400 })
    }

    const row =
      (await prisma.businessStory.findUnique({ where: { userId } })) ||
      (await prisma.businessStory.findUnique({ where: { organizationId } }))
    const current = normalizeStory(row?.payload)

    const system = [
      'أنت ديفي — مساعد تدريب وكيل واتساب لنشاط تجاري.',
      'كلم المستخدم باللهجة المصرية باختصار، واستخرج بيانات البيزنز من كلامه.',
      'بعد كل رد، لو فيه تحديثات على قصة البيزنز، أضف في نهاية ردك كتلة JSON فقط بهذا الشكل:',
      '```story',
      '{"businessName":"","dialect":"egyptian_colloquial","tone":"","services":[],"hours":"","pricingNotes":"","faqs":[{"q":"","a":""}],"doNot":[],"sampleReplies":[]}',
      '```',
      'املأ فقط الحقول اللي اتذكرت صراحة. باقي الحقول سيبها فاضية أو احذفها.',
      '',
      `القصة الحالية:\n${JSON.stringify(current, null, 2)}`,
    ].join('\n')

    const history = Array.isArray(body.history)
      ? body.history
          .slice(-10)
          .map((m) => ({
            role: (m.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
            content: String(m.content || ''),
          }))
          .filter((m) => m.content)
      : []

    let raw: string
    try {
      raw = await chatCompletion({
        messages: [
          { role: 'system', content: system },
          ...history,
          { role: 'user', content: message },
        ],
        temperature: 0.4,
        maxTokens: 700,
      })
    } catch (err) {
      console.error('[trainer]', (err as Error).message)
      return Response.json({
        success: true,
        reply:
          'وصلتني. حالياً مفيش مفتاح OpenRouter شغال — بس احفظ بياناتك في قصة البيزنز من صفحة Authenticate مؤقتاً.',
        story: current,
        saved: false,
        userId,
      })
    }

    let reply = raw
    let patch: Partial<Story> = {}
    const match = raw.match(/```story\s*([\s\S]*?)```/i)
    if (match?.[1]) {
      reply = raw.replace(match[0], '').trim()
      try {
        patch = JSON.parse(match[1]) as Partial<Story>
      } catch {
        patch = {}
      }
    }

    const next = mergeStory(current, normalizeStory({ ...current, ...patch }))
    const saved = await prisma.businessStory.upsert({
      where: { userId },
      create: { userId, organizationId, payload: next },
      update: { organizationId, payload: next },
    })

    if (!reply) {
      reply = 'تمام، حدّثت بيانات الوكيل من كلامك. تقدر تكمل تدريب أو تجرب واتساب.'
    }

    return Response.json({
      success: true,
      reply,
      story: normalizeStory(saved.payload),
      saved: true,
      userId,
    })
  } catch (err) {
    return jsonError(err)
  }
}
