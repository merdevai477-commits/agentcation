import { currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export const DEFAULT_STORY = {
  businessName: '',
  dialect: 'egyptian_colloquial',
  tone: 'friendly_support',
  services: [] as string[],
  hours: '',
  pricingNotes: '',
  faqs: [] as { q: string; a: string }[],
  doNot: ['لا تعد بمواعيد غير مؤكدة', 'لا تشارك بيانات داخلية'],
  sampleReplies: [] as string[],
  /** Freeform WhatsApp agent instructions (full prompt). */
  agentPrompt: '',
}

/** Ensure Clerk user exists in DB and has a default organization. Bound to Clerk userId. */
export async function ensureUserOrg(userId: string) {
  let user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    let email = `${userId}@users.local`
    let name = 'Owner'
    try {
      const cu = await currentUser()
      email = cu?.emailAddresses?.[0]?.emailAddress || email
      name = [cu?.firstName, cu?.lastName].filter(Boolean).join(' ') || cu?.username || name
    } catch {
      /* optional */
    }
    user = await prisma.user.create({
      data: { id: userId, email, name },
    })
  }

  let membership = await prisma.organizationMembership.findFirst({
    where: { userId },
    include: { organization: true },
    orderBy: { id: 'asc' },
  })

  if (!membership) {
    const organization = await prisma.organization.create({
      data: {
        name: `${user.name}'s Business`,
        memberships: {
          create: { userId, role: 'owner' },
        },
        businessStory: {
          create: { userId, payload: DEFAULT_STORY },
        },
      },
    })
    membership = await prisma.organizationMembership.findFirst({
      where: { userId, organizationId: organization.id },
      include: { organization: true },
    })
  }

  if (!membership) throw new Error('Failed to ensure organization for user')

  return {
    user,
    organization: membership.organization,
    organizationId: membership.organizationId,
    userId,
  }
}
