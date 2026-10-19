'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  BookOpen,
  CircleHelp,
  Languages,
  MessageSquareOff,
  Sparkles,
} from 'lucide-react'
import { customizeCopy, kindLabel } from '@/lib/bizniz/customize-copy'
import { useCustomizeQueue } from '@/lib/bizniz/customize-store'
import type { CustomizeKind, CustomizeStatus } from '@/lib/bizniz/customize-types'
import { platformLabel } from '@/lib/bizniz/platforms'
import { relativeTime } from '@/lib/bizniz/store'
import { MotionIn } from '@/components/bizniz/motion-in'
import { PlatformIcon } from '@/components/bizniz/platform-icon'
import { BiznizTopbar } from '@/components/bizniz/shell/topbar'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { cn } from '@/lib/utils'
import { DeviClerk } from './devi-clerk'

type Tab = 'all' | CustomizeKind

function StatusMark({ status, label }: { status: CustomizeStatus; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className={cn(
          'size-1.5 rounded-full',
          status === 'open' && 'bg-amber-400',
          status === 'in_review' && 'bz-status-pulse bg-violet-400',
          status === 'resolved' && 'bg-emerald-400',
        )}
      />
      <span
        className={cn(
          status === 'open' && 'text-amber-200/90',
          status === 'in_review' && 'text-violet-200/90',
          status === 'resolved' && 'text-emerald-300/90',
        )}
      >
        {label}
      </span>
    </span>
  )
}

export function CustomizeDashboard() {
  const { lang, toggle, isRtl } = useBiznizLang()
  const t = customizeCopy(lang)
  const { items, setStatus, addFromDevi } = useCustomizeQueue()
  const [tab, setTab] = useState<Tab>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(
    () => (tab === 'all' ? items : items.filter((i) => i.kind === tab)),
    [items, tab],
  )

  const selected = filtered.find((i) => i.id === selectedId) || filtered[0] || null

  const counts = useMemo(() => {
    const by = (k: CustomizeKind) => items.filter((i) => i.kind === k && i.status !== 'resolved').length
    return {
      unanswered: by('unanswered'),
      out_of_context: by('out_of_context'),
      profanity: by('profanity'),
      train:
        items.filter(
          (i) => (i.kind === 'knowledge' || i.kind === 'pricing') && i.status !== 'resolved',
        ).length,
      open: items.filter((i) => i.status !== 'resolved').length,
    }
  }, [items])

  const workstreams = [
    {
      id: 'unanswered' as Tab,
      label: t.tabUnanswered,
      desc: t.wsUnansweredDesc,
      count: counts.unanswered,
      icon: CircleHelp,
      tone: 'amber',
    },
    {
      id: 'out_of_context' as Tab,
      label: t.tabOutOfContext,
      desc: t.wsContextDesc,
      count: counts.out_of_context,
      icon: MessageSquareOff,
      tone: 'sky',
    },
    {
      id: 'profanity' as Tab,
      label: t.tabProfanity,
      desc: t.wsModDesc,
      count: counts.profanity,
      icon: AlertTriangle,
      tone: 'rose',
    },
    {
      id: 'knowledge' as Tab,
      label: t.tabKnowledge,
      desc: t.wsTrainDesc,
      count: counts.train,
      icon: BookOpen,
      tone: 'violet',
    },
  ]

  const tabs: { id: Tab; label: string }[] = [
    { id: 'all', label: t.tabAll },
    { id: 'unanswered', label: t.tabUnanswered },
    { id: 'out_of_context', label: t.tabOutOfContext },
    { id: 'profanity', label: t.tabProfanity },
    { id: 'knowledge', label: t.tabKnowledge },
    { id: 'pricing', label: t.tabPricing },
  ]

  return (
    <div className="bz-cz" dir={isRtl ? 'rtl' : 'ltr'}>
      <MotionIn>
        <BiznizTopbar
          title={t.title}
          subtitle={t.subtitle}
          showNewAutomation={false}
          eyebrow={t.eyebrow}
        />
      </MotionIn>

      <MotionIn delay={30} className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <p className="bz-cz-banner max-w-3xl">{t.demoHint}</p>
        <button type="button" className="bz-btn bz-btn--ghost shrink-0" onClick={toggle}>
          <Languages size={14} />
          {t.langToggle}
        </button>
      </MotionIn>

      <div className="bz-cz-ws">
        {workstreams.map((ws, i) => {
          const Icon = ws.icon
          const active = tab === ws.id || (ws.id === 'knowledge' && (tab === 'knowledge' || tab === 'pricing'))
          return (
            <MotionIn key={ws.id} delay={50 + i * 45}>
              <button
                type="button"
                className={cn('bz-card bz-glass bz-cz-ws__card', active && 'is-active')}
                onClick={() => setTab(ws.id === 'knowledge' ? 'knowledge' : ws.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={cn('bz-cz-ws__icon', `bz-cz-ws__icon--${ws.tone}`)}>
                    <Icon size={18} />
                  </span>
                  <span className="bz-cz-ws__count">{ws.count}</span>
                </div>
                <h2 className="mt-4 text-[0.95rem] font-semibold tracking-tight text-white">{ws.label}</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{ws.desc}</p>
              </button>
            </MotionIn>
          )
        })}
      </div>

      <MotionIn delay={120} className="mb-3 mt-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-white">{t.queueTitle}</h2>
          <p className="text-xs text-slate-500">{t.queueMeta}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              type="button"
              className={cn('bz-pill', tab === tb.id && 'is-active')}
              onClick={() => {
                setTab(tb.id)
                setSelectedId(null)
              }}
            >
              {tb.label}
            </button>
          ))}
        </div>
      </MotionIn>

      <div className="bz-cz-split">
        <MotionIn delay={140} className="bz-cz-split__list">
          {filtered.map((item, i) => {
            const q = lang === 'ar' ? item.questionAr : item.question
            const isSel = selected?.id === item.id
            const statusLabel =
              item.status === 'open'
                ? t.statusOpen
                : item.status === 'in_review'
                  ? t.statusReview
                  : t.statusResolved
            return (
              <button
                key={item.id}
                type="button"
                className={cn('bz-card bz-glass bz-cz-row', isSel && 'is-selected')}
                style={{ animationDelay: `${i * 30}ms` }}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={cn('bz-cz-kind', `bz-cz-kind--${item.kind}`)}>
                    {kindLabel(lang, item.kind)}
                  </span>
                  <StatusMark status={item.status} label={statusLabel} />
                </div>
                <p className="mt-3 line-clamp-2 text-start text-sm font-medium leading-snug text-white">
                  {q}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <PlatformIcon id={item.platformId} size={12} />
                    {platformLabel(item.platformId)}
                  </span>
                  <span className="opacity-40">·</span>
                  <span>{item.clientName}</span>
                  <span className="opacity-40">·</span>
                  <span>{relativeTime(item.at)}</span>
                </div>
              </button>
            )
          })}
          {filtered.length === 0 ? (
            <div className="bz-card bz-glass px-4 py-14 text-center text-sm text-slate-500">{t.empty}</div>
          ) : null}
        </MotionIn>

        <MotionIn delay={180} className="bz-card bz-glass bz-cz-detail">
          {selected ? (
            <>
              <div className="bz-cz-detail__head">
                <div className="flex items-center gap-3">
                  <span className="bz-platform-card__icon">
                    <PlatformIcon id={selected.platformId} size={20} />
                  </span>
                  <div>
                    <p className="text-xs text-slate-500">{t.channel}</p>
                    <p className="text-sm font-medium text-white">{platformLabel(selected.platformId)}</p>
                  </div>
                </div>
                <StatusMark
                  status={selected.status}
                  label={
                    selected.status === 'open'
                      ? t.statusOpen
                      : selected.status === 'in_review'
                        ? t.statusReview
                        : t.statusResolved
                  }
                />
              </div>

              <span className={cn('bz-cz-kind mt-4 inline-flex', `bz-cz-kind--${selected.kind}`)}>
                {kindLabel(lang, selected.kind)}
              </span>

              <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-white">
                {lang === 'ar' ? selected.questionAr : selected.question}
              </h3>

              <dl className="bz-cz-detail__meta">
                <div>
                  <dt>{t.client}</dt>
                  <dd>{selected.clientName}</dd>
                </div>
                <div>
                  <dt>{lang === 'ar' ? 'الوقت' : 'When'}</dt>
                  <dd>{relativeTime(selected.at)}</dd>
                </div>
              </dl>

              {(lang === 'ar' ? selected.noteAr : selected.note) ? (
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  {lang === 'ar' ? selected.noteAr : selected.note}
                </p>
              ) : null}

              {(lang === 'ar' ? selected.suggestedFixAr : selected.suggestedFix) ? (
                <div className="bz-cz-detail__fix">
                  <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-violet-300/90">
                    <Sparkles size={12} />
                    {t.suggested}
                  </div>
                  <p className="text-sm leading-relaxed text-violet-50/95">
                    {lang === 'ar' ? selected.suggestedFixAr : selected.suggestedFix}
                  </p>
                </div>
              ) : null}

              <div className="bz-cz-detail__actions">
                {selected.status !== 'in_review' && selected.status !== 'resolved' ? (
                  <button
                    type="button"
                    className="bz-btn bz-btn--ghost"
                    onClick={() => setStatus(selected.id, 'in_review')}
                  >
                    {t.actionReview}
                  </button>
                ) : null}
                {selected.status !== 'resolved' ? (
                  <button
                    type="button"
                    className="bz-btn bz-btn--primary bz-btn--glow"
                    onClick={() => setStatus(selected.id, 'resolved')}
                  >
                    {t.actionTeach}
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400/90">{t.statusResolved}</span>
                )}
              </div>
            </>
          ) : (
            <div className="grid h-full min-h-[220px] place-items-center text-sm text-slate-500">
              {t.empty}
            </div>
          )}
        </MotionIn>
      </div>

      <DeviClerk lang={lang} onFiled={(text) => addFromDevi(text)} />
    </div>
  )
}
