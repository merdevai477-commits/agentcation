'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { ArrowUp, BriefcaseBusiness, Stethoscope } from 'lucide-react'
import { useI18n } from '@/components/i18n'
import type { Copy } from '@/lib/copy'
import { DaveDoctorWorkspace } from '@/components/dave-doctor-demo/dave-doctor-workspace'
import { DaveDoctorMobile } from '@/components/dave-doctor-demo/dave-doctor-mobile'

type Role = 'user' | 'agent'
type Persona = 'dave' | 'business'
type DemoCopy = Copy['demo']['business']

type ChatMessage = {
  id: string
  role: Role
  text: string
}

function replyFor(input: string, demo: DemoCopy) {
  const q = input.toLowerCase()
  if (/price|pricing|قارن|مقارن|سعر|خطة|plan|upgrade/.test(q)) {
    return { trace: demo.incidentTrace, text: demo.incident }
  }
  if (/whatsapp|message|chat|واتساب|رسالة|محادثة|دعم/.test(q)) {
    return { trace: demo.rollbackTrace, text: demo.rollback }
  }
  if (/lead|qualify|عميل محتمل|تأهيل/.test(q)) {
    return { trace: demo.customerTrace, text: demo.customer }
  }
  if (/who|hello|hi\b|hey|مرحب|أهلا|اهلا|من أنت|مين انت/.test(q)) {
    return { trace: demo.introTrace, text: demo.intro }
  }
  const clipped = input.trim().replace(/\s+/g, ' ')
  const short = clipped.length > 90 ? `${clipped.slice(0, 87)}…` : clipped
  return { trace: demo.fallbackTrace, text: demo.fallback.replace('{q}', short) }
}

function BusinessAgentChat() {
  const { t, lang } = useI18n()
  const demo = t.demo.business
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'hello', role: 'agent', text: demo.hello }])
  const [draft, setDraft] = useState('')
  const [trace, setTrace] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const busyRef = useRef(false)
  const promptIndex = useRef(0)
  const autoTimer = useRef<number | null>(null)

  busyRef.current = busy

  useEffect(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
    setBusy(false)
    setTrace(null)
    setDraft('')
    promptIndex.current = 0
    setMessages([{ id: 'hello', role: 'agent', text: demo.hello }])
  }, [lang, demo.hello])

  useEffect(() => {
    const node = scroller.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, trace])

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id))
      if (autoTimer.current) window.clearTimeout(autoTimer.current)
    }
  }, [])

  function later(fn: () => void, ms: number) {
    const id = window.setTimeout(fn, ms)
    timers.current.push(id)
  }

  function run(raw: string) {
    const text = raw.trim()
    if (!text || busyRef.current) return
    const script = replyFor(text, demo)
    const userId = `u-${Date.now()}`
    const agentId = `a-${Date.now()}`

    setBusy(true)
    setDraft('')
    setTrace(script.trace[0] ?? '')
    setMessages((current) => [...current, { id: userId, role: 'user', text }])

    script.trace.forEach((step, index) => {
      later(() => setTrace(step), index * 480)
    })

    later(() => {
      setTrace(null)
      setMessages((current) => [...current, { id: agentId, role: 'agent', text: '' }])
      let cursor = 0
      const tick = () => {
        cursor += 2
        const next = script.text.slice(0, cursor)
        setMessages((current) => current.map((message) => (message.id === agentId ? { ...message, text: next } : message)))
        if (cursor < script.text.length) later(tick, 16)
        else setBusy(false)
      }
      tick()
    }, script.trace.length * 480 + 240)
  }

  useEffect(() => {
    if (autoTimer.current) window.clearTimeout(autoTimer.current)

    const schedule = () => {
      autoTimer.current = window.setTimeout(() => {
        if (!busyRef.current) {
          const prompts = demo.prompts
          const next = prompts[promptIndex.current % prompts.length]
          promptIndex.current += 1
          run(next)
        }
        schedule()
      }, 11000)
    }

    autoTimer.current = window.setTimeout(() => {
      if (!busyRef.current) {
        promptIndex.current = 1
        run(demo.prompts[0])
      }
      schedule()
    }, 2800)

    return () => {
      if (autoTimer.current) window.clearTimeout(autoTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, demo.prompts])

  return (
    <div className="agent-console agent-console--luxe" role="region" aria-label={demo.name}>
      <div className="luxe-glow" aria-hidden />
      <header className="agent-console__bar luxe-bar">
        <div className="flex min-w-0 items-center gap-3">
          <span className="agent-console__avatar is-biz luxe-avatar">
            <BriefcaseBusiness size={16} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{demo.name}</p>
            <p className="truncate text-[11px] text-sky-200/70">
              {demo.role} · {demo.note}
            </p>
          </div>
        </div>
        <span className="agent-console__live luxe-live">
          <span className="agent-console__dot" />
          {demo.online}
        </span>
      </header>

      <div className="agent-console__meta luxe-meta">
        {demo.meta.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div ref={scroller} className="agent-console__log luxe-log">
        {messages.map((message) => (
          <div key={message.id} className={`agent-msg agent-msg--${message.role} ${message.role === 'agent' ? 'luxe-msg' : 'luxe-msg-user'}`}>
            {message.role === 'agent' && <span className="agent-msg__who">{demo.who}</span>}
            <p>{message.text || '…'}</p>
          </div>
        ))}
        {trace && (
          <div className="agent-trace luxe-trace">
            <span className="agent-console__dot" />
            {trace}
          </div>
        )}
      </div>

      <div className="agent-console__prompts luxe-prompts">
        {demo.prompts.map((prompt) => (
          <button key={prompt} type="button" disabled={busy} onClick={() => run(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="agent-console__form luxe-form"
        onSubmit={(event: FormEvent) => {
          event.preventDefault()
          run(draft)
        }}
      >
        <label className="sr-only" htmlFor="agent-input">
          {demo.label}
        </label>
        <input
          id="agent-input"
          value={draft}
          disabled={busy}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={demo.placeholder}
          autoComplete="off"
        />
        <button type="submit" disabled={busy || !draft.trim()} aria-label={demo.send}>
          <ArrowUp size={16} />
        </button>
      </form>
    </div>
  )
}

function useIsPhone(maxWidth = 767) {
  const [isPhone, setIsPhone] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`)
    const apply = () => setIsPhone(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [maxWidth])

  return isPhone
}

export function AgentDemo() {
  const { t } = useI18n()
  const [persona, setPersona] = useState<Persona>('business')
  const isPhone = useIsPhone(767)

  return (
    <div id="agent-demo" className={`agent-demo-shell ${isPhone ? 'is-phone' : ''} ${persona === 'business' ? 'is-biz' : ''}`}>
      <div className="agent-console__switch" role="tablist" aria-label={t.demo.switchLabel}>
        <button
          type="button"
          role="tab"
          aria-selected={persona === 'business'}
          className={persona === 'business' ? 'is-active' : ''}
          onClick={() => setPersona('business')}
        >
          <BriefcaseBusiness size={14} />
          {t.demo.tabBiz}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={persona === 'dave'}
          className={persona === 'dave' ? 'is-active' : ''}
          onClick={() => setPersona('dave')}
        >
          <Stethoscope size={14} />
          {t.demo.tabDave}
        </button>
      </div>

      {persona === 'dave' ? (
        isPhone === null ? (
          <div className="ddm-placeholder" aria-hidden />
        ) : isPhone ? (
          <DaveDoctorMobile />
        ) : (
          <DaveDoctorWorkspace />
        )
      ) : (
        <BusinessAgentChat />
      )}
    </div>
  )
}
