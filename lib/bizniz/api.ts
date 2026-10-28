/** Same-origin Next.js API — no separate backend URL (fixes Failed to fetch on production). */
const API_BASE = ''

export type WhatsAppSessionStatus = 'stopped' | 'qr' | 'connecting' | 'ready' | 'logged_out'

export type WhatsAppSession = {
  userId?: string
  status: WhatsAppSessionStatus | string
  phoneE164: string | null
  displayName: string | null
  lastError: string | null
  lastQrAt?: string | null
  qrDataUrl?: string | null
}

export type BusinessStory = {
  businessName: string
  dialect: string
  tone: string
  services: string[]
  hours: string
  pricingNotes: string
  faqs: { q: string; a: string }[]
  doNot: string[]
  sampleReplies: string[]
}

export const EMPTY_STORY: BusinessStory = {
  businessName: '',
  dialect: 'egyptian_colloquial',
  tone: 'friendly_support',
  services: [],
  hours: '',
  pricingNotes: '',
  faqs: [],
  doNot: [],
  sampleReplies: [],
}

type TokenFn = () => Promise<string | null>

async function apiFetch<T>(path: string, getToken: TokenFn, init?: RequestInit): Promise<T> {
  const token = await getToken()
  if (!token) throw new Error('Not signed in')

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error || (data as { message?: string })?.message || res.statusText)
  }
  return data as T
}

export async function fetchWhatsAppSession(getToken: TokenFn) {
  const data = await apiFetch<{ success: boolean; session: WhatsAppSession }>(
    '/api/bizniz/whatsapp/session',
    getToken,
  )
  return data.session
}

export async function startWhatsApp(getToken: TokenFn) {
  const data = await apiFetch<{ success: boolean; session: WhatsAppSession }>(
    '/api/bizniz/whatsapp/start',
    getToken,
    { method: 'POST' },
  )
  return data.session
}

export async function stopWhatsApp(getToken: TokenFn) {
  const data = await apiFetch<{ success: boolean; session: WhatsAppSession }>(
    '/api/bizniz/whatsapp/stop',
    getToken,
    { method: 'POST' },
  )
  return data.session
}

export async function clearWhatsApp(getToken: TokenFn) {
  const data = await apiFetch<{ success: boolean; session: WhatsAppSession }>(
    '/api/bizniz/whatsapp/clear',
    getToken,
    { method: 'POST' },
  )
  return data.session
}

export async function fetchBusinessStory(getToken: TokenFn) {
  const data = await apiFetch<{ success: boolean; story: BusinessStory }>(
    '/api/bizniz/business-story',
    getToken,
  )
  return data.story
}

export async function saveBusinessStory(getToken: TokenFn, story: BusinessStory) {
  const data = await apiFetch<{ success: boolean; story: BusinessStory }>(
    '/api/bizniz/business-story',
    getToken,
    { method: 'PUT', body: JSON.stringify({ story }) },
  )
  return data.story
}

/** SSE over fetch (cookies/session via same-origin + Bearer). */
export function subscribeWhatsAppEvents(
  getToken: TokenFn,
  onEvent: (payload: Record<string, unknown> & { type?: string }) => void,
): () => void {
  let aborted = false
  const controller = new AbortController()

  void (async () => {
    while (!aborted) {
      try {
        const token = await getToken()
        if (!token || aborted) return

        const res = await fetch(`${API_BASE}/api/bizniz/whatsapp/events`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'text/event-stream' },
          signal: controller.signal,
        })
        if (!res.ok || !res.body) {
          await new Promise((r) => setTimeout(r, 2000))
          continue
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (!aborted) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const chunks = buffer.split('\n\n')
          buffer = chunks.pop() || ''
          for (const chunk of chunks) {
            const line = chunk.split('\n').find((l) => l.startsWith('data: '))
            if (!line) continue
            try {
              onEvent(JSON.parse(line.slice(6)) as Record<string, unknown>)
            } catch {
              /* ignore */
            }
          }
        }
      } catch (err) {
        if (aborted || (err as Error)?.name === 'AbortError') return
        await new Promise((r) => setTimeout(r, 2000))
      }
    }
  })()

  return () => {
    aborted = true
    controller.abort()
  }
}
