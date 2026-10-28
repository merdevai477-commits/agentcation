import { prisma } from '@/lib/server/prisma'
import { jsonError, requireUserContext } from '@/lib/server/require-user'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function initials(name: string | null | undefined, fallback: string) {
  const raw = (name || fallback || '?').trim()
  const parts = raw.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0]![0] || ''}${parts[1]![0] || ''}`.toUpperCase()
  return raw.slice(0, 2).toUpperCase()
}

export async function GET(req: Request) {
  try {
    const { organizationId, userId } = await requireUserContext()
    const url = new URL(req.url)
    const platform = url.searchParams.get('platform') || 'whatsapp'

    const rows = await prisma.bizConversation.findMany({
      where: {
        organizationId,
        ...(platform !== 'all' ? { platform } : {}),
      },
      orderBy: { updatedAt: 'desc' },
      take: 80,
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 40,
        },
      },
    })

    const conversations = rows.map((c) => {
      const phone = c.remoteJid.replace(/@.*/, '')
      const clientName = c.contactName || `+${phone}`
      return {
        id: c.id,
        platformId: c.platform as 'whatsapp' | 'instagram' | 'telegram' | 'messenger',
        remoteJid: c.remoteJid,
        clientName,
        initials: initials(c.contactName, phone),
        preview: c.preview || '',
        updatedAt: c.updatedAt.toISOString(),
        userId,
        messages: c.messages.map((m) => ({
          id: m.id,
          role: m.role === 'assistant' ? 'ai' : 'customer',
          senderLabel: m.role === 'assistant' ? 'AI Agent' : clientName,
          text: m.text,
          at: m.createdAt.toISOString(),
        })),
      }
    })

    return Response.json({ success: true, userId, conversations })
  } catch (err) {
    return jsonError(err)
  }
}
