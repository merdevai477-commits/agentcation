import { prisma } from '../../lib/prisma.js'
import { chatCompletion, buildSystemPrompt } from '../llm/openrouter.js'
import { DEFAULT_STORY } from '../../lib/org.js'

const pending = new Map()

export async function handleIncomingText({
  organizationId,
  userId,
  remoteJid,
  contactName,
  text,
  waMessageId,
  sendText,
  simulateTyping,
}) {
  const key = `${userId || organizationId}:${remoteJid}`
  const existing = pending.get(key)
  if (existing) clearTimeout(existing.timer)

  const job = {
    texts: existing ? [...existing.texts, text] : [text],
    contactName,
    waMessageId,
  }

  job.timer = setTimeout(() => {
    pending.delete(key)
    void runReply({ organizationId, userId, remoteJid, job, sendText, simulateTyping })
  }, 900)

  pending.set(key, job)
}

async function runReply({ organizationId, userId, remoteJid, job, sendText, simulateTyping }) {
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

  const storyRow = userId
    ? (await prisma.businessStory.findUnique({ where: { userId } })) ||
      (await prisma.businessStory.findUnique({ where: { organizationId } }))
    : await prisma.businessStory.findUnique({ where: { organizationId } })
  const story = storyRow?.payload && typeof storyRow.payload === 'object' ? storyRow.payload : DEFAULT_STORY

  const recent = await prisma.bizMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'desc' },
    take: 8,
  })
  const history = recent
    .reverse()
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.text,
    }))

  let replyText
  try {
    replyText = await chatCompletion({
      messages: [{ role: 'system', content: buildSystemPrompt(story) }, ...history],
    })
  } catch (err) {
    console.error('[bizniz/reply]', err.message)
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

  const typingMs = Math.min(6500, Math.max(1200, Math.round(replyText.length * 38)))
  if (typeof simulateTyping === 'function') {
    await simulateTyping(remoteJid, typingMs)
  } else {
    await new Promise((r) => setTimeout(r, typingMs))
  }

  await sendText(remoteJid, replyText)
}
