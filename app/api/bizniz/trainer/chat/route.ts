import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/server/prisma'
import { chatCompletion } from '@/lib/server/openrouter'
import { jsonError, requireUserContext } from '@/lib/server/require-user'
import {
  inferBusinessNameFromPrompt,
  looksLikeAgentPrompt,
  mergeStory,
  normalizeStory,
  type Story,
} from '@/lib/server/story'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

async function persistStory(userId: string, organizationId: string, next: Story) {
  return prisma.businessStory.upsert({
    where: { userId },
    create: { userId, organizationId, payload: next },
    update: { organizationId, payload: next },
  })
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

    const first = owner.name.split(' ')[0] || owner.name

    // Paste-full-prompt path: save verbatim — don't compress into tiny JSON fields
    if (looksLikeAgentPrompt(message)) {
      const next = mergeStory(current, {
        agentPrompt: message,
        businessName:
          current.businessName || inferBusinessNameFromPrompt(message, current.businessName),
        ownerName: current.ownerName || owner.name,
      })
      const saved = await persistStory(userId, organizationId, next)
      const ar = /[\u0600-\u06FF]/.test(message)
      return Response.json({
        success: true,
        reply: ar
          ? `تم يا ${first} ✅ حفظت البرومبت كامل (${message.length.toLocaleString()} حرف) كتعليمات ملزمة لردود واتساب. من دلوقتي أي عميل يسأل، الموديل هيلتزم بهوية البيزنس اللي كتبتها — مش هيخترع نشاط تاني.`
          : `Done, ${first}. Saved your full prompt (${message.length.toLocaleString()} chars) as the WhatsApp agent instructions. Customer replies will follow it literally.`,
        story: normalizeStory(saved.payload),
        saved: true,
        userId,
        ownerName: owner.name,
        agentPromptSaved: true,
      })
    }

    const system = [
      'You are Devi, a WhatsApp business-agent trainer inside Agentication / Dev Bizniz.',
      '',
      '## Who you are talking to',
      `- Owner full name: ${owner.name}`,
      `- Owner email: ${owner.email || 'n/a'}`,
      `- Clerk userId: ${userId}`,
      `- Always address the owner by their first name when natural.`,
      '- Distinguish: ownerName = the human training you; businessName = their shop/brand.',
      '',
      '## Language mirroring (critical)',
      '- Detect the language/variety of the LATEST user message and reply in THAT same variety.',
      '- English → English. MSA → فصحى مبسطة. Egyptian → مصري. Mixed → match their mix.',
      '',
      '## What to extract into Business Story',
      'businessName, ownerName, dialect, replyLanguage, tone, services[], hours, pricingNotes,',
      'faqs[{q,a}], doNot[], sampleReplies[], agentPrompt.',
      '',
      '## agentPrompt (critical)',
      '- If the owner pastes a long customer-service prompt / identity / rules for WhatsApp,',
      '  put the ENTIRE text into agentPrompt (do not summarize or shrink it).',
      '- agentPrompt is the source of truth for WhatsApp replies.',
      '- Short training notes can update structured fields; long prompts must go to agentPrompt.',
      '- If they say "أضف للبرومبت" / "update the prompt", append or replace agentPrompt accordingly.',
      '',
      '## Output format',
      '1) Short natural reply to the owner in their language.',
      '2) If the story should update, append ONLY this fenced block at the end:',
      '```story',
      '{"businessName":"","ownerName":"","dialect":"","replyLanguage":"","tone":"","services":[],"hours":"","pricingNotes":"","faqs":[{"q":"","a":""}],"doNot":[],"sampleReplies":[],"agentPrompt":""}',
      '```',
      'Omit empty fields inside the JSON when possible. Never truncate agentPrompt.',
      '',
      `Current Business Story JSON:\n${JSON.stringify(
        { ...current, agentPrompt: current.agentPrompt ? `[${current.agentPrompt.length} chars saved]` : '' },
        null,
        2,
      )}`,
      current.agentPrompt
        ? `\n(agentPrompt preview — first 400 chars):\n${current.agentPrompt.slice(0, 400)}…`
        : '\n(no agentPrompt saved yet)',
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
        maxTokens: 2000,
      })
    } catch (err) {
      const detail = (err as Error).message || 'unknown error'
      console.error('[trainer]', detail)
      const missingKey = /OPENROUTER_API_KEY is not configured/i.test(detail)
      return Response.json({
        success: true,
        reply: missingKey
          ? /[A-Za-z]/.test(message) && !/[\u0600-\u06FF]/.test(message)
            ? `Got it, ${first}. OPENROUTER_API_KEY is missing on the server — add it in Railway Variables.`
            : `وصلت يا ${first}. مفيش OPENROUTER_API_KEY على السيرفر — ضيفه في Variables.`
          : /[A-Za-z]/.test(message) && !/[\u0600-\u06FF]/.test(message)
            ? `Sorry ${first}, the model call failed: ${detail}`
            : `آسف يا ${first}، استدعاء الموديل فشل: ${detail}`,
        story: current,
        saved: false,
        userId,
        ownerName: owner.name,
        error: detail,
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

    // If Devi forgot agentPrompt but the user message itself is instructional enough, keep prior
    const next = mergeStory(
      current,
      normalizeStory({
        ...current,
        ...patch,
        ownerName: patch.ownerName || current.ownerName || owner.name,
      }),
    )
    const saved = await persistStory(userId, organizationId, next)

    if (!reply) {
      reply =
        /[A-Za-z]/.test(message) && !/[\u0600-\u06FF]/.test(message)
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
