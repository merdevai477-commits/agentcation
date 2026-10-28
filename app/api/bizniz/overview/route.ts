import { prisma } from '@/lib/server/prisma'
import { jsonError, requireUserContext } from '@/lib/server/require-user'
import { getSession } from '@/lib/server/whatsapp-session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function initials(name: string | null | undefined, fallback: string) {
  const raw = (name || fallback || '?').trim()
  const parts = raw.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0]![0] || ''}${parts[1]![0] || ''}`.toUpperCase()
  return raw.slice(0, 2).toUpperCase()
}

function startOfUtcDay(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

export async function GET() {
  try {
    const { organizationId, userId } = await requireUserContext()
    const session = await getSession(userId)

    const now = new Date()
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    const prevMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
    const chartFrom = startOfUtcDay(new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000))

    const [messagesThisMonth, messagesPrevMonth, messageRows, conversations, clientCount] =
      await Promise.all([
        prisma.bizMessage.count({
          where: {
            createdAt: { gte: monthStart },
            conversation: { organizationId, platform: 'whatsapp' },
          },
        }),
        prisma.bizMessage.count({
          where: {
            createdAt: { gte: prevMonthStart, lt: monthStart },
            conversation: { organizationId, platform: 'whatsapp' },
          },
        }),
        prisma.bizMessage.findMany({
          where: {
            createdAt: { gte: chartFrom },
            conversation: { organizationId, platform: 'whatsapp' },
          },
          select: { createdAt: true },
          take: 5000,
        }),
        prisma.bizConversation.findMany({
          where: { organizationId, platform: 'whatsapp' },
          orderBy: { updatedAt: 'desc' },
          take: 12,
          include: {
            messages: { orderBy: { createdAt: 'desc' }, take: 6 },
          },
        }),
        prisma.bizConversation.count({
          where: { organizationId, platform: 'whatsapp' },
        }),
      ])

    const byDay = new Map<string, number>()
    for (let i = 0; i < 14; i++) {
      const d = new Date(chartFrom.getTime() + i * 24 * 60 * 60 * 1000)
      const key = d.toISOString().slice(0, 10)
      byDay.set(key, 0)
    }
    for (const row of messageRows) {
      const key = row.createdAt.toISOString().slice(0, 10)
      if (byDay.has(key)) byDay.set(key, (byDay.get(key) || 0) + 1)
    }
    const chart = [...byDay.entries()].map(([date, value]) => {
      const d = new Date(`${date}T00:00:00.000Z`)
      return {
        date,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        value,
      }
    })

    const recentLogs = conversations
      .map((c) => {
        const phone = c.remoteJid.replace(/@.*/, '')
        const clientName = c.contactName || `+${phone}`
        const customer = c.messages.find((m) => m.role === 'customer')
        const assistant = c.messages.find((m) => m.role === 'assistant')
        if (!customer) return null
        return {
          id: c.id,
          clientName,
          initials: initials(c.contactName, phone),
          platformId: 'whatsapp' as const,
          customerMessage: customer.text,
          aiResponse: assistant?.text || '',
          at: (customer.createdAt > (assistant?.createdAt || customer.createdAt)
            ? customer.createdAt
            : assistant?.createdAt || customer.createdAt
          ).toISOString(),
          conversationId: c.id,
        }
      })
      .filter(Boolean)

    const clients = conversations.slice(0, 8).map((c) => {
      const phone = c.remoteJid.replace(/@.*/, '')
      return {
        id: c.id,
        name: c.contactName || `+${phone}`,
        initials: initials(c.contactName, phone),
        lastPreview: c.preview || '',
        lastMessageAt: c.updatedAt.toISOString(),
      }
    })

    const lastActivityAt = conversations[0]?.updatedAt?.toISOString() || null
    const messageDeltaPct =
      messagesPrevMonth > 0
        ? Math.round(((messagesThisMonth - messagesPrevMonth) / messagesPrevMonth) * 100)
        : messagesThisMonth > 0
          ? 100
          : 0

    const linked = session.status === 'ready'
    const accountLabel = session.phoneE164 || undefined

    return Response.json({
      success: true,
      userId,
      whatsapp: {
        session,
        linked,
        accountLabel,
        status:
          linked
            ? 'active'
            : session.status === 'connecting' ||
                session.status === 'reconnecting' ||
                session.status === 'qr'
              ? 'paused'
              : 'disconnected',
        messagesThisMonth,
        messageDeltaPct,
        lastActivityAt,
        clientCount,
      },
      chart,
      recentLogs,
      clients,
    })
  } catch (err) {
    return jsonError(err)
  }
}
