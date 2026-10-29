import { DEFAULT_STORY } from './org'

export type Story = typeof DEFAULT_STORY & {
  ownerName?: string
  replyLanguage?: string
  /** Full freeform agent instructions — used as primary WhatsApp system prompt */
  agentPrompt?: string
}

export function normalizeStory(input: unknown): Story {
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
    agentPrompt: String((base as { agentPrompt?: string }).agentPrompt || ''),
  }
}

export function mergeStory(current: Story, patch: Partial<Story>): Story {
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
    // Full prompt always replaces when provided (never concatenate huge duplicates)
    agentPrompt:
      typeof patch.agentPrompt === 'string' && patch.agentPrompt.trim()
        ? patch.agentPrompt.trim()
        : current.agentPrompt || '',
  } as Story
}

/** Owner pasted a full customer-service prompt (not a short chat note). */
export function looksLikeAgentPrompt(message: string) {
  const t = message.trim()
  if (t.length < 350) return false
  const hits = [
    /أنت المساعد/i,
    /هويتك ودورك/i,
    /مهمتك الأساسية/i,
    /الشعار الرسمي/i,
    /system prompt/i,
    /##\s*\d+/,
    /Captain AI/i,
    /خدمة عملاء/i,
    /تعامل مع (العملاء|المستخدمين)/i,
    /رابط أندرويد|play\.google\.com/i,
    /لا تخترع|لا تدّعِ|لا تدعي/i,
  ].filter((re) => re.test(t)).length
  return hits >= 2 || t.length >= 1200
}

export function inferBusinessNameFromPrompt(message: string, fallback = '') {
  const m =
    message.match(/تطبيق\s+([A-Za-z0-9+]+)/) ||
    message.match(/لتطبيق\s+([A-Za-z0-9+]+)/) ||
    message.match(/\b(90Plus|90\s*Plus)\b/i)
  return (m?.[1] || fallback || '').replace(/\s+/g, '') || fallback
}
