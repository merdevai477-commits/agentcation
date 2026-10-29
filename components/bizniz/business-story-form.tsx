'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  EMPTY_STORY,
  fetchBusinessStory,
  saveBusinessStory,
  type BusinessStory,
} from '@/lib/bizniz/api'

function linesToList(value: string) {
  return value
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function listToLines(value: string[]) {
  return (value || []).join('\n')
}

export function BusinessStoryForm() {
  const { getToken, isSignedIn } = useAuth()
  const [story, setStory] = useState<BusinessStory>(EMPTY_STORY)
  const [servicesText, setServicesText] = useState('')
  const [doNotText, setDoNotText] = useState('')
  const [samplesText, setSamplesText] = useState('')
  const [faqsText, setFaqsText] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const tokenFn = useCallback(() => getToken(), [getToken])

  useEffect(() => {
    if (!isSignedIn) return
    void (async () => {
      try {
        const s = await fetchBusinessStory(tokenFn)
        setStory(s)
        setServicesText(listToLines(s.services))
        setDoNotText(listToLines(s.doNot))
        setSamplesText(listToLines(s.sampleReplies))
        setFaqsText(
          (s.faqs || [])
            .map((f) => `${f.q} | ${f.a}`)
            .join('\n'),
        )
      } catch (err) {
        setError((err as Error).message)
      }
    })()
  }, [isSignedIn, tokenFn])

  async function onSave(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const faqs = faqsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [q, ...rest] = line.split('|')
          return { q: (q || '').trim(), a: rest.join('|').trim() }
        })

      const next: BusinessStory = {
        ...story,
        services: linesToList(servicesText),
        doNot: linesToList(doNotText),
        sampleReplies: linesToList(samplesText),
        faqs,
      }
      const saved = await saveBusinessStory(tokenFn, next)
      setStory(saved)
      setMessage('تم حفظ قصة البيزنز — هتدخل في ردود واتساب تلقائيًا.')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={(e) => void onSave(e)} className="bz-card bz-glass space-y-4">
      <div>
        <h2 className="font-medium text-white">قصة البيزنز + برومبت الوكيل</h2>
        <p className="mt-1 text-xs text-slate-400">
          أي برومبت طويل تلصقه هنا أو في Devi بيتخزن كامل ويبقا ملزم لردود واتساب.
        </p>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs text-slate-400">برومبت الوكيل (تعليمات كاملة — أولوية على باقي الحقول)</span>
        <textarea
          className="bz-input min-h-40 w-full font-mono text-[11px] leading-relaxed"
          value={story.agentPrompt || ''}
          onChange={(e) => setStory({ ...story, agentPrompt: e.target.value })}
          placeholder="الصق هنا نظام خدمة العملاء / هوية البيزنس كامل…"
        />
        <span className="text-[10px] text-slate-500">
          {(story.agentPrompt || '').length.toLocaleString()} حرف محفوظة
        </span>
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs text-slate-400">اسم النشاط</span>
        <input
          className="bz-input w-full"
          value={story.businessName}
          onChange={(e) => setStory({ ...story, businessName: e.target.value })}
          placeholder="مثلاً: مطعم أبو علي"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs text-slate-400">اللهجة</span>
          <select
            className="bz-input w-full"
            value={story.dialect}
            onChange={(e) => setStory({ ...story, dialect: e.target.value })}
          >
            <option value="egyptian_colloquial">عامية مصرية</option>
            <option value="gulf">خليجي</option>
            <option value="msa">فصحى مبسطة</option>
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs text-slate-400">نبرة الرد</span>
          <select
            className="bz-input w-full"
            value={story.tone}
            onChange={(e) => setStory({ ...story, tone: e.target.value })}
          >
            <option value="friendly_support">ودّي / دعم</option>
            <option value="sales">بيعي</option>
            <option value="formal">رسمي</option>
          </select>
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs text-slate-400">الخدمات (سطر لكل خدمة)</span>
        <textarea
          className="bz-input min-h-20 w-full"
          value={servicesText}
          onChange={(e) => setServicesText(e.target.value)}
          placeholder={'توصيل\nحجز طاولة\nكاترينج'}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs text-slate-400">ساعات العمل</span>
          <input
            className="bz-input w-full"
            value={story.hours}
            onChange={(e) => setStory({ ...story, hours: e.target.value })}
            placeholder="يومياً 12ظ–12ص"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs text-slate-400">ملاحظات الأسعار</span>
          <input
            className="bz-input w-full"
            value={story.pricingNotes}
            onChange={(e) => setStory({ ...story, pricingNotes: e.target.value })}
            placeholder="التوصيل من 30ج"
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs text-slate-400">أسئلة شائعة (سطر: سؤال | جواب)</span>
        <textarea
          className="bz-input min-h-24 w-full"
          value={faqsText}
          onChange={(e) => setFaqsText(e.target.value)}
          placeholder={'في توصيل؟ | أيوه لحد المعادي\nفين الفرع؟ | شارع الهرم'}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs text-slate-400">ممنوع (سطر لكل قاعدة)</span>
        <textarea
          className="bz-input min-h-16 w-full"
          value={doNotText}
          onChange={(e) => setDoNotText(e.target.value)}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs text-slate-400">أمثلة ردود</span>
        <textarea
          className="bz-input min-h-16 w-full"
          value={samplesText}
          onChange={(e) => setSamplesText(e.target.value)}
          placeholder={'أهلاً بيك 🌟 قولي عايز إيه؟'}
        />
      </label>

      {error ? (
        <p className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
          {message}
        </p>
      ) : null}

      <button type="submit" className="bz-btn bz-btn--primary" disabled={busy}>
        {busy ? 'جاري الحفظ…' : 'حفظ قصة البيزنز'}
      </button>
    </form>
  )
}
