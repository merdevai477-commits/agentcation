'use client'

import { useEffect, useState } from 'react'
import { useI18n } from '@/components/i18n'

const LINES = {
  en: [
    'Agentication: Connecting your knowledge…',
    'Business Agent: Drafting a customer reply…',
    'Dave Doctor: Checking checkout-service…',
    'Agentication: Get. Integrate. Grow.',
  ],
  ar: [
    'Agentication: جاري ربط المعرفة…',
    'وكيل الأعمال: يصيغ ردًا للعميل…',
    'ديف دكتور: يفحص خدمة الدفع…',
    'Agentication: جهّز. اربط. انمُ.',
  ],
} as const

export function HeroMascot() {
  const { lang } = useI18n()
  const lines = LINES[lang]
  const [lineIndex, setLineIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const apply = () => setShow(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    setTyped('')
    setLineIndex(0)
  }, [lang])

  useEffect(() => {
    if (!show) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const full = lines[lineIndex]

    if (reduce) {
      setTyped(full)
      return
    }

    if (typed.length < full.length) {
      const id = window.setTimeout(() => setTyped(full.slice(0, typed.length + 1)), 28)
      return () => window.clearTimeout(id)
    }

    const hold = window.setTimeout(() => {
      setTyped('')
      setLineIndex((i) => (i + 1) % lines.length)
    }, 1800)
    return () => window.clearTimeout(hold)
  }, [show, typed, lineIndex, lines, lang])

  if (!show) return null

  return (
    <div className="hero-mascot">
      <div className="hero-mascot__frame">
        <div className="hero-mascot__orbit" aria-hidden />
        <div className="hero-mascot__sparkles" aria-hidden />
        <img
          src="/agent-mascot-laptop.jpg"
          alt={lang === 'ar' ? 'روبوت Agentication يكتب على لابتوب' : 'Agentication robot typing on a laptop'}
          className="hero-mascot__img"
          width={640}
          height={640}
        />
        <div className="hero-mascot__bubble" aria-live="polite">
          <span className="hero-mascot__bubble-text">
            {typed}
            <span className="hero-mascot__caret" aria-hidden />
          </span>
        </div>
      </div>
      <p className="hero-mascot__caption">
        {lang === 'ar' ? 'وكيلك شغال — إحساس الديمو الحي' : 'Your agent at work — live simulation vibe'}
      </p>
    </div>
  )
}
