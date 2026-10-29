'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { sendTrainerMessage } from '@/lib/bizniz/api'
import { customizeCopy } from '@/lib/bizniz/customize-copy'
import type { Lang } from '@/lib/copy'
import { cn } from '@/lib/utils'

type Props = {
  lang: Lang
  onFiled: (text: string) => void
}

type Bubble = { id: string; role: 'user' | 'assistant'; text: string }

function welcomeFor(lang: Lang, firstName: string) {
  if (lang === 'ar') {
    return `أهلاً يا ${firstName} — أنا ديفي. الصق برومبت خدمة العملاء كامل في أي وقت وهحفظه حرفيًا لردود واتساب. الملاحظات القصيرة (الاسم، النبرة، FAQ) برضه تشتغل — وهرد بنفس لغتك.`
  }
  return `Hi ${firstName} — I’m Devi. Paste a full customer-service prompt anytime and I’ll save it wholesale for WhatsApp. Short notes (name, tone, FAQs) work too — I’ll mirror your language.`
}

export function DeviClerk({ lang, onFiled }: Props) {
  const t = customizeCopy(lang)
  const { getToken, isSignedIn } = useAuth()
  const { user } = useUser()
  const firstName =
    user?.firstName ||
    user?.fullName?.split(' ')[0] ||
    user?.username ||
    (lang === 'ar' ? 'صاحبي' : 'there')
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<Bubble[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const tokenFn = useCallback(() => getToken(), [getToken])

  useEffect(() => {
    setMessages([{ id: 'welcome', role: 'assistant', text: welcomeFor(lang, firstName) }])
  }, [lang, firstName])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function submit(e: FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || busy) return
    setDraft('')
    onFiled(text)
    const history = messages.map((m) => ({
      role: m.role,
      content: m.text,
    }))
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text }])
    setBusy(true)
    try {
      if (!isSignedIn) throw new Error('Sign in required')
      const res = await sendTrainerMessage(tokenFn, text, history)
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: res.saved
            ? `${res.reply}\n\n✓ تم حفظ بيانات التدريب في قصة البيزنز.`
            : res.reply,
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          text: (err as Error).message || t.deviAck,
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={cn('bz-devi', open && 'is-open')} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {open ? (
        <div className="bz-devi__panel">
          <div className="bz-devi__head">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="bz-devi__avatar">
                <Sparkles size={14} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{t.deviName}</p>
                <p className="truncate text-[11px] text-violet-300/80">{t.deviRole}</p>
              </div>
            </div>
            <button
              type="button"
              className="bz-icon-btn bz-icon-btn--sm"
              aria-label={t.deviClose}
              onClick={() => setOpen(false)}
            >
              <X size={14} />
            </button>
          </div>

          <div className="bz-devi__thread">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  'bz-devi__bubble whitespace-pre-wrap',
                  m.role === 'user' ? 'bz-devi__bubble--user' : 'bz-devi__bubble--devi',
                )}
              >
                {m.text}
              </div>
            ))}
            {busy ? (
              <div className="bz-devi__bubble bz-devi__bubble--devi bz-devi__typing">
                <span />
                <span />
                <span />
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <form className="bz-devi__composer" onSubmit={(e) => void submit(e)}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t.deviPlaceholder}
              aria-label={t.deviPlaceholder}
              disabled={busy}
            />
            <button
              type="submit"
              className="bz-btn bz-btn--primary bz-btn--glow"
              aria-label={t.deviSend}
              disabled={busy}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        className="bz-devi__fab bz-btn--glow"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t.deviClose : t.deviOpen}
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        <span className="bz-devi__fab-label">{open ? t.deviClose : t.deviName}</span>
      </button>
    </div>
  )
}
