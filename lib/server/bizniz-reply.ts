import { prisma } from './prisma'
import { chatCompletion, buildSystemPrompt } from './openrouter'
import { DEFAULT_STORY } from './org'

type PendingJob = {
  texts: string[]
  contactName: string | null
  waMessageId: string | null
  timer: ReturnType<typeof setTimeout>
}

const pending = new Map<string, PendingJob>()

export async function handleIncomingText({
  organizationId,
  userId,
  remoteJid,
  contactName,
  text,
  waMessageId,
  sendText,
}: {
  organizationId: string
  userId: string
  remoteJid: string
  contactName: string | null
  text: string
  waMessageId: string | null
  sendText: (jid: string, body: string) => Promise<void>
}) {
  const key = `${userId}:${remoteJid}`
  const existing = pending.get(key)
  if (existing) clearTimeout(existing.timer)

  const job: PendingJob = {
    texts: existing ? [...existing.texts, text] : [text],
    contactName,
    waMessageId,
    timer: setTimeout(() => {
      pending.delete(key)
      void runReply({ organizationId, userId, remoteJid, job, sendText })
    }, 900),
  }

  pending.set(key, job)
}

async function runReply({
  organizationId,
  userId,
  remoteJid,
  job,
  sendText,
}: {
  organizationId: string
  userId: string
  remoteJid: string
  job: Omit<PendingJob, 'timer'>
  sendText: (jid: string, body: string) => Promise<void>
}) {
  const merged = job.texts.join('\n').trim()
  if (!merged) return

  const conversation = await prisma.bizConversation.upsert({
    where: {
      organizationId_platform_remoteJid: {
        organizationId,
        platform: 'whatsapp',
        remoteJid,
      },
    },
    create: {
      organizationId,
      platform: 'whatsapp',
      remoteJid,
      contactName: job.contactName || null,
      preview: merged.slice(0, 500),
    },
    update: {
      contactName: job.contactName || undefined,
      preview: merged.slice(0, 500),
    },
  })

  await prisma.bizMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'customer',
      text: merged,
      waMessageId: job.waMessageId || null,
    },
  })

  const storyRow =
    (await prisma.businessStory.findUnique({ where: { userId } })) ||
    (await prisma.businessStory.findUnique({ where: { organizationId } }))
  const story =
    storyRow?.payload && typeof storyRow.payload === 'object'
      ? (storyRow.payload as Record<string, unknown>)
      : DEFAULT_STORY

  const recent = await prisma.bizMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })
  const history = recent.reverse().map((m) => ({
    role: (m.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
    content: m.text,
  }))

  let replyText: string
  try {
    replyText = await chatCompletion({
      messages: [{ role: 'system', content: buildSystemPrompt(story) }, ...history],
    })
  } catch (err) {
    console.error('[bizniz/reply]', (err as Error).message)
    replyText = 'حاضر، رسالتك وصلتنا. هنراجع ونرد عليك في أقرب وقت.'
  }

  await prisma.bizMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'assistant',
      text: replyText,
    },
  })
  await prisma.bizConversation.update({
    where: { id: conversation.id },
    data: { preview: replyText.slice(0, 500) },
  })

  await sendText(remoteJid, replyText)
}
