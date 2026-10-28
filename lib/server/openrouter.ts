type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export async function chatCompletion({
  messages,
  temperature = 0.35,
  maxTokens = 800,
}: {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
}) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim()
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not configured')

  const base = (process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, '')
  const model = process.env.OPENROUTER_MODEL || 'qwen/qwen3.7-flash'

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://agintication.com',
      'X-Title': 'Agentication Dev Bizniz',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      // Qwen3.7 Flash reasons by default and can burn max_tokens before content
      reasoning: { effort: 'none' },
    }),
  })

  const data = (await res.json().catch(() => ({}))) as {
    error?: { message?: string }
    message?: string
    choices?: {
      message?: {
        content?: string | null
        reasoning?: string | null
      }
    }[]
  }
  if (!res.ok) {
    throw new Error(`OpenRouter error: ${data?.error?.message || data?.message || res.statusText}`)
  }

  const msg = data?.choices?.[0]?.message
  const text = (msg?.content || msg?.reasoning || '').trim()
  if (!text) {
    throw new Error('OpenRouter returned an empty reply (no content/reasoning)')
  }
  return text
}

export function buildSystemPrompt(story: Record<string, unknown> | null | undefined) {
  const s = story && typeof story === 'object' ? story : {}
  const faqs = Array.isArray(s.faqs)
    ? (s.faqs as { q?: string; a?: string }[]).map((f) => `- س: ${f.q}\n  ج: ${f.a}`).join('\n')
    : ''
  const services = Array.isArray(s.services) ? (s.services as string[]).join('، ') : ''
  const doNot = Array.isArray(s.doNot) ? (s.doNot as string[]).map((x) => `- ${x}`).join('\n') : ''
  const samples = Array.isArray(s.sampleReplies)
    ? (s.sampleReplies as string[]).map((x) => `- ${x}`).join('\n')
    : ''

  return [
    'أنت موظف خدمة عملاء على واتساب لنشاط تجاري.',
    'رد باختصار ووضوح باللهجة المطلوبة، بدون مقدمات طويلة.',
    'لو مش متأكد، اسأل سؤال واحد قصير بدل ما تخمّن.',
    '',
    `اسم صاحب الحساب: ${(s.ownerName as string) || 'غير محدد'}`,
    `اسم النشاط: ${(s.businessName as string) || 'غير محدد'}`,
    `لغة الرد مع العملاء: ${(s.replyLanguage as string) || (s.dialect as string) || 'egyptian_colloquial'}`,
    `اللهجة/الأسلوب: ${(s.dialect as string) || 'egyptian_colloquial'}`,
    `النبرة: ${(s.tone as string) || 'friendly_support'}`,
    `الخدمات: ${services || 'غير محددة'}`,
    `ساعات العمل: ${(s.hours as string) || 'غير محددة'}`,
    `ملاحظات الأسعار: ${(s.pricingNotes as string) || 'غير محددة'}`,
    'Mirror the customer language when possible (Arabic dialect / English) unless Business Story forces a dialect.',
    faqs ? `أسئلة شائعة:\n${faqs}` : '',
    doNot ? `ممنوع:\n${doNot}` : '',
    samples ? `أمثلة ردود:\n${samples}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}
