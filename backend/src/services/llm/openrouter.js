import { env } from '../../config/env.js'

export async function chatCompletion({ messages, temperature = 0.35, maxTokens = 400 }) {
  if (!env.openRouterApiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  const res = await fetch(`${env.openRouterBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://agintication.com',
      'X-Title': 'Agentication Dev Bizniz',
    },
    body: JSON.stringify({
      model: env.openRouterModel,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detail = data?.error?.message || data?.message || res.statusText
    throw new Error(`OpenRouter error: ${detail}`)
  }

  const text = data?.choices?.[0]?.message?.content
  if (!text || typeof text !== 'string') {
    throw new Error('OpenRouter returned an empty reply')
  }
  return text.trim()
}

export function buildSystemPrompt(story) {
  const s = story && typeof story === 'object' ? story : {}
  const faqs = Array.isArray(s.faqs)
    ? s.faqs.map((f) => `- س: ${f.q}\n  ج: ${f.a}`).join('\n')
    : ''
  const services = Array.isArray(s.services) ? s.services.join('، ') : ''
  const doNot = Array.isArray(s.doNot) ? s.doNot.map((x) => `- ${x}`).join('\n') : ''
  const samples = Array.isArray(s.sampleReplies) ? s.sampleReplies.map((x) => `- ${x}`).join('\n') : ''

  return [
    'أنت موظف خدمة عملاء على واتساب لنشاط تجاري.',
    'رد باختصار ووضوح باللهجة المطلوبة، بدون مقدمات طويلة.',
    'لو مش متأكد، اسأل سؤال واحد قصير بدل ما تخمّن.',
    '',
    `اسم النشاط: ${s.businessName || 'غير محدد'}`,
    `اللهجة: ${s.dialect || 'egyptian_colloquial'}`,
    `النبرة: ${s.tone || 'friendly_support'}`,
    `الخدمات: ${services || 'غير محددة'}`,
    `ساعات العمل: ${s.hours || 'غير محددة'}`,
    `ملاحظات الأسعار: ${s.pricingNotes || 'غير محددة'}`,
    faqs ? `أسئلة شائعة:\n${faqs}` : '',
    doNot ? `ممنوع:\n${doNot}` : '',
    samples ? `أمثلة ردود:\n${samples}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}
