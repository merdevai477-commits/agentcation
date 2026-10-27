'use client'

import { useState } from 'react'
import { daveCopy } from '@/lib/dave/copy'
import { DEMO_APPROVALS, relativeDaveTime } from '@/lib/dave/demo-data'
import type { DaveApproval } from '@/lib/dave/types'
import { MotionIn } from '@/components/bizniz/motion-in'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { DaveTopbar } from './shell/topbar'
import { cn } from '@/lib/utils'

export function DaveApprovalsPage() {
  const { lang, isRtl } = useBiznizLang()
  const t = daveCopy(lang)
  const [items, setItems] = useState<DaveApproval[]>(DEMO_APPROVALS)
  const [notice, setNotice] = useState('')

  function decide(id: string, approved: boolean) {
    setItems((prev) => prev.filter((a) => a.id !== id))
    setNotice(
      approved
        ? lang === 'ar'
          ? 'تم تسجيل الموافقة محلياً (تجريبي) — لن يُطبَّق على الإنتاج.'
          : 'Approval recorded locally (demo) — nothing applied to production.'
        : lang === 'ar'
          ? 'تم رفض الاقتراح محلياً (تجريبي).'
          : 'Proposal rejected locally (demo).',
    )
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <MotionIn>
        <DaveTopbar title={t.approvalsTitle} subtitle={t.approvalsSub} />
      </MotionIn>

      <MotionIn delay={30}>
        <p className="dv-banner mb-4">{t.demoHint}</p>
      </MotionIn>

      {notice ? (
        <p className="mb-4 rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
          {notice}
        </p>
      ) : null}

      <div className="grid gap-3">
        {items.map((ap, i) => (
          <MotionIn key={ap.id} as="article" className="dv-card dv-glass" delay={50 + i * 40}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">
                  {lang === 'ar' ? ap.titleAr : ap.title}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {t.risk}:{' '}
                  <span
                    className={cn(
                      ap.risk === 'high' && 'text-rose-300',
                      ap.risk === 'medium' && 'text-amber-300',
                      ap.risk === 'low' && 'text-emerald-300',
                    )}
                  >
                    {ap.risk}
                  </span>
                  {' · '}
                  {relativeDaveTime(ap.at)}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              {lang === 'ar' ? ap.detailAr : ap.detail}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="dv-btn dv-btn--primary dv-btn--glow"
                onClick={() => decide(ap.id, true)}
              >
                {t.approve}
              </button>
              <button type="button" className="dv-btn dv-btn--ghost" onClick={() => decide(ap.id, false)}>
                {t.reject}
              </button>
            </div>
          </MotionIn>
        ))}
        {items.length === 0 ? (
          <div className="dv-card dv-glass py-14 text-center text-sm text-slate-500">
            {t.emptyApprovals}
          </div>
        ) : null}
      </div>
    </div>
  )
}
