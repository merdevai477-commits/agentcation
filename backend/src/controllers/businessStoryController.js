import { prisma } from '../lib/prisma.js'
import { DEFAULT_STORY, ensureUserOrg } from '../lib/org.js'

function normalizeStory(input) {
  const base = { ...DEFAULT_STORY, ...(input && typeof input === 'object' ? input : {}) }
  return {
    businessName: String(base.businessName || ''),
    dialect: String(base.dialect || 'egyptian_colloquial'),
    tone: String(base.tone || 'friendly_support'),
    services: Array.isArray(base.services) ? base.services.map(String) : [],
    hours: String(base.hours || ''),
    pricingNotes: String(base.pricingNotes || ''),
    faqs: Array.isArray(base.faqs)
      ? base.faqs.map((f) => ({ q: String(f?.q || ''), a: String(f?.a || '') })).filter((f) => f.q || f.a)
      : [],
    doNot: Array.isArray(base.doNot) ? base.doNot.map(String) : [],
    sampleReplies: Array.isArray(base.sampleReplies) ? base.sampleReplies.map(String) : [],
  }
}

export async function getStory(req, res, next) {
  try {
    const { organizationId } = await ensureUserOrg(req.userId)
    const row = await prisma.businessStory.findUnique({ where: { organizationId } })
    const story = normalizeStory(row?.payload)
    return res.json({ success: true, story })
  } catch (err) {
    return next(err)
  }
}

export async function putStory(req, res, next) {
  try {
    const { organizationId } = await ensureUserOrg(req.userId)
    const story = normalizeStory(req.body?.story ?? req.body)
    const row = await prisma.businessStory.upsert({
      where: { organizationId },
      create: { organizationId, payload: story },
      update: { payload: story },
    })
    return res.json({ success: true, story: normalizeStory(row.payload) })
  } catch (err) {
    return next(err)
  }
}
