import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/server/prisma'
import { DEFAULT_STORY } from '@/lib/server/org'
import { chatCompletion } from '@/lib/server/openrouter'
import { jsonError, requireUserContext } from '@/lib/server/require-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Story = typeof DEFAULT_STORY & {
  ownerName?: string
  replyLanguage?: string
}

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
    ownerName: String((base as { ownerName?: string }).ownerName || ''),
    replyLanguage: String((base as { replyLanguage?: string }).replyLanguage || ''),
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

async function resolveOwnerProfile(userId: string) {
  const dbUser = await prisma.user.findUnique({ where: { id: userId } })
  let name = dbUser?.name || ''
  let email = dbUser?.email || ''
  try {
    const cu = await currentUser()
    const clerkName =
      [cu?.firstName, cu?.lastName].filter(Boolean).join(' ') || cu?.username || ''
    if (clerkName) name = clerkName
    const clerkEmail = cu?.emailAddresses?.[0]?.emailAddress
    if (clerkEmail) email = clerkEmail
    if (dbUser && (dbUser.name !== name || (clerkEmail && dbUser.email !== clerkEmail))) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: name || dbUser.name, email: email || dbUser.email },
      })
    }
  } catch {
    /* clerk optional */
  }
  return { name: name || 'there', email }
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

    const owner = await resolveOwnerProfile(userId)
    const row =
      (await prisma.businessStory.findUnique({ where: { userId } })) ||
      (await prisma.businessStory.findUnique({ where: { organizationId } }))
    const current = normalizeStory(row?.payload)
    if (!current.ownerName) current.ownerName = owner.name

    const system = [
      'You are Devi, a WhatsApp business-agent trainer inside Agentication / Dev Bizniz.',
      '',
      '## Who you are talking to',
      `- Owner full name: ${owner.name}`,
      `- Owner email: ${owner.email || 'n/a'}`,
      `- Clerk userId: ${userId}`,
      `- Always address the owner by their first name when natural (e.g. "يا ${owner.name.split(' ')[0]}", "Hey ${owner.name.split(' ')[0]}").`,
      '- Distinguish: ownerName = the human training you; businessName = their shop/brand.',
      '- Infer what they want: train tone, add services/prices/FAQ, set dialect, or fix reply style — confirm briefly then apply.',
      '',
      '## Language mirroring (critical)',
      '- Detect the language/variety of the LATEST user message and reply in THAT same variety.',
      '- English → English. Modern Standard Arabic → فصحى مبسطة. Egyptian colloquial → مصري. Gulf → خليجي. Mixed → match their mix.',
      '- Training prompts may be Arabic OR English OR dialect; understand both and extract facts either way.',
      '- Do NOT force Egyptian if they write in English (unless they ask for Egyptian customer replies).',
      '- When they specify how WhatsApp should answer customers, set dialect + replyLanguage + sampleReplies accordingly.',
      '',
      '## What to extract into Business Story',
      'businessName, ownerName, dialect (egyptian_colloquial | gulf | msa | english | mixed), replyLanguage (ar | en | mixed),',
      'tone, services[], hours, pricingNotes, faqs[{q,a}], doNot[], sampleReplies[].',
      'Only fill fields they stated or clearly implied. Keep prior story values otherwise.',
      '',
      '## Output format',
      '1) Short natural reply to the owner in their language.',
      '2) If the story should update, append ONLY this fenced block at the end:',
      '```story',
      '{"businessName":"","ownerName":"","dialect":"","replyLanguage":"","tone":"","services":[],"hours":"","pricingNotes":"","faqs":[{"q":"","a":""}],"doNot":[],"sampleReplies":[]}',
      '```',
      'Omit empty fields inside the JSON when possible.',
      '',
      `Current Business Story JSON:\n${JSON.stringify(current, null, 2)}`,
    ].join('\n')

    const history = Array.isArray(body.history)
      ? body.history
          .slice(-12)
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
        temperature: 0.35,
        maxTokens: 800,
      })
    } catch (err) {
      console.error('[trainer]', (err as Error).message)
      const first = owner.name.split(' ')[0] || owner.name
      return Response.json({
        success: true,
        reply: /[A-Za-z]/.test(message) && !/[\u0600-\u06FF]/.test(message)
          ? `Got it, ${first}. OpenRouter is not configured right now — save your story from Authenticate for the moment.`
          : `وصلت يا ${first}. مفيش OpenRouter شغال دلوقتي — احفظ قصة البيزنز من Authenticate مؤقتاً.`,
        story: current,
        saved: false,
        userId,
        ownerName: owner.name,
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

    const next = mergeStory(current, normalizeStory({ ...current, ...patch, ownerName: patch.ownerName || current.ownerName || owner.name }))
    const saved = await prisma.businessStory.upsert({
      where: { userId },
      create: { userId, organizationId, payload: next },
      update: { organizationId, payload: next },
    })

    if (!reply) {
      const first = owner.name.split(' ')[0] || owner.name
      reply = /[A-Za-z]/.test(message) && !/[\u0600-\u06FF]/.test(message)
        ? `Done, ${first}. I updated your agent story from what you said.`
        : `تمام يا ${first}، حدّثت قصة الوكيل من كلامك.`
    }

    return Response.json({
      success: true,
      reply,
      story: normalizeStory(saved.payload),
      saved: true,
      userId,
      ownerName: owner.name,
    })
  } catch (err) {
    return jsonError(err)
  }
}
