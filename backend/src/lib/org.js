import { prisma } from './prisma.js'
import { clerk } from './clerk.js'

const DEFAULT_STORY = {
  businessName: '',
  dialect: 'egyptian_colloquial',
  tone: 'friendly_support',
  services: [],
  hours: '',
  pricingNotes: '',
  faqs: [],
  doNot: ['لا تعد بمواعيد غير مؤكدة', 'لا تشارك بيانات داخلية'],
  sampleReplies: [],
}

/** Ensure Clerk user exists in DB and has a default organization. */
export async function ensureUserOrg(userId) {
  let user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    let email = `${userId}@users.local`
    let name = 'Owner'
    try {
      const cu = await clerk.users.getUser(userId)
      email = cu.emailAddresses?.[0]?.emailAddress || email
      name = [cu.firstName, cu.lastName].filter(Boolean).join(' ') || cu.username || name
    } catch {
      /* clerk fetch optional for local tokens */
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
          create: { payload: DEFAULT_STORY },
        },
      },
    })
    membership = await prisma.organizationMembership.findFirst({
      where: { userId, organizationId: organization.id },
      include: { organization: true },
    })
  }

  return {
    user,
    organization: membership.organization,
    organizationId: membership.organizationId,
  }
}

export { DEFAULT_STORY }
