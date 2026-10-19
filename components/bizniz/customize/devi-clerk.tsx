'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { customizeCopy } from '@/lib/bizniz/customize-copy'
import { useDeviChat } from '@/lib/bizniz/customize-store'
import type { Lang } from '@/lib/copy'
import { cn } from '@/lib/utils'

type Props = {
  lang: Lang
  onFiled: (text: string) => void
}

export function DeviClerk({ lang, onFiled }: Props) {
  const t = customizeCopy(lang)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const { messages, send } = useDeviChat(t.deviWelcome)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  function submit(e: FormEvent) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    onFiled(text)
    send(text, t.deviAck)
    setDraft('')
  }

  return (
    <div className={cn('bz-devi', open && 'is-open')} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {open ? (
        <div className="bz-devi__panel">
          <div className="bz-devi__head">
            <div className="flex items-center gap-2.5 min-w-0">
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
                  'bz-devi__bubble',
                  m.role === 'user' ? 'bz-devi__bubble--user' : 'bz-devi__bubble--devi',
                )}
              >
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <form className="bz-devi__composer" onSubmit={submit}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t.deviPlaceholder}
              aria-label={t.deviPlaceholder}
            />
            <button type="submit" className="bz-btn bz-btn--primary bz-btn--glow" aria-label={t.deviSend}>
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
