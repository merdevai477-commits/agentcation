'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronRight, MoreVertical, TrendingUp, Users } from 'lucide-react'
import {
  BIZNIZ_DEMO_LABEL,
  DEMO_CHART_SERIES,
  DEMO_RECENT_LOGS,
  uniqueClientCount,
} from '@/lib/bizniz/demo-data'
import { platformLabel } from '@/lib/bizniz/platforms'
import { relativeTime, useBiznizApps } from '@/lib/bizniz/store'
import type { ConnectedApp, PlatformId } from '@/lib/bizniz/types'
import { AppDetailModal } from './app-detail-modal'
import { MotionIn } from './motion-in'
import { PlatformIcon } from './platform-icon'
import { StatusDot } from './status-dot'
import { BiznizTopbar } from './shell/topbar'
import { cn } from '@/lib/utils'

type Props = {
  userName: string
}

export function HomeDashboard({ userName }: Props) {
  const { apps, connectedOnly, pause, resume, disconnect } = useBiznizApps()
  const [platformFilter, setPlatformFilter] = useState<'all' | PlatformId>('all')
  const [selected, setSelected] = useState<ConnectedApp | null>(null)
  const [menuId, setMenuId] = useState<string | null>(null)

  const chart = useMemo(() => {
    const series = DEMO_CHART_SERIES
    if (platformFilter === 'all') return series
    const scale =
      platformFilter === 'whatsapp'
        ? 1
        : platformFilter === 'instagram'
          ? 0.7
          : platformFilter === 'telegram'
            ? 0.35
            : 0.25
    return series.map((p) => ({ ...p, value: Math.round(p.value * scale) }))
  }, [platformFilter])

  const max = Math.max(...chart.map((c) => c.value), 1)
  const summaryApps =
    connectedOnly.length > 0
      ? connectedOnly
      : apps.filter((a) => a.status !== 'disconnected').slice(0, 4)

  return (
    <>
      <MotionIn>
        <BiznizTopbar
          title={`Welcome back, ${userName.split(' ')[0] || userName}`}
          subtitle="Manage your clients and automate their business in one place."
        />
      </MotionIn>

      <p className="bz-hint mb-5">{BIZNIZ_DEMO_LABEL}</p>

      <div className="bz-home-grid">
        <MotionIn as="section" className="bz-card bz-glass bz-span-8" delay={40}>
          <div className="bz-card__head">
            <div>
              <h2>AI Automations</h2>
              <p className="bz-card__meta">Incoming volume by connected channel</p>
            </div>
            <span className="bz-chip">This Month</span>
          </div>
          {summaryApps.length === 0 ? (
            <Empty text="No connected apps yet. Connect a channel from Authenticate." href="/dashboard/authenticate" />
          ) : (
            <div className="bz-platform-grid">
              {summaryApps.map((app, i) => (
                <Link
                  key={app.id}
                  href={`/dashboard/messages?platform=${app.platformId}`}
                  className="group bz-platform-card"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="bz-platform-card__icon">
                        <PlatformIcon id={app.platformId} size={18} />
                      </span>
                      <span className="text-sm font-medium text-white">
                        {platformLabel(app.platformId)}
                      </span>
                    </div>
                    <ArrowUpRight size={14} className="text-slate-500 transition group-hover:text-violet-300" />
                  </div>
                  <p className="bz-platform-card__value">
                    {app.messagesThisMonth.toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    {typeof app.messageDeltaPct === 'number' ? (
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 font-medium',
                          app.messageDeltaPct >= 0 ? 'text-emerald-400' : 'text-rose-300',
                        )}
                      >
                        <TrendingUp size={11} className={app.messageDeltaPct < 0 ? 'rotate-180' : ''} />
                        {Math.abs(app.messageDeltaPct)}%
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                    <span className="text-slate-500">messages</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </MotionIn>

        <MotionIn as="section" className="bz-card bz-glass bz-span-4" delay={80}>
          <div className="bz-card__head">
            <h2>Connected Apps</h2>
          </div>
          <ul className="space-y-1">
            {apps.map((app) => (
              <li key={app.id} className="relative">
                <button type="button" className="bz-row" onClick={() => setSelected(app)}>
                  <span className="bz-platform-card__icon bz-platform-card__icon--sm">
                    <PlatformIcon id={app.platformId} size={15} />
                  </span>
                  <span className="flex-1 text-start text-sm text-slate-200">
                    {platformLabel(app.platformId)}
                  </span>
                  <StatusDot status={app.status} />
                  <ChevronRight size={14} className="text-slate-600" />
                  <span
                    className="bz-icon-btn bz-icon-btn--sm"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuId((id) => (id === app.id ? null : app.id))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.stopPropagation()
                        setMenuId((id) => (id === app.id ? null : app.id))
                      }
                    }}
                  >
                    <MoreVertical size={14} />
                  </span>
                </button>
                {menuId === app.id ? (
                  <div className="bz-menu bz-glass">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(app)
                        setMenuId(null)
                      }}
                    >
                      Details
                    </button>
                    <Link
                      href={`/dashboard/messages?platform=${app.platformId}`}
                      onClick={() => setMenuId(null)}
                    >
                      View messages
                    </Link>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </MotionIn>

        <MotionIn as="section" className="bz-card bz-glass bz-span-8" delay={120}>
          <div className="bz-card__head">
            <div>
              <h2>Total Messages</h2>
              <p className="bz-card__meta">Volume over the selected range</p>
            </div>
            <select
              className="bz-select"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as 'all' | PlatformId)}
              aria-label="Platform filter"
            >
              <option value="all">All Apps</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="telegram">Telegram</option>
              <option value="messenger">Messenger</option>
            </select>
          </div>
          <div className="bz-chart" role="img" aria-label="Message volume chart (demo)">
            {chart.map((point, i) => (
              <div key={point.date} className="bz-chart__col">
                <div
                  className="bz-chart__bar"
                  style={
                    {
                      '--bar-h': `${Math.max(10, (point.value / max) * 100)}%`,
                      transitionDelay: `${i * 40}ms`,
                    } as CSSProperties
                  }
                  title={`${point.label}: ${point.value}`}
                />
                <span>{point.label.replace('Oct ', '')}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-slate-500">Demo series — not live production analytics.</p>
        </MotionIn>

        <MotionIn as="section" className="bz-card bz-glass bz-span-4" delay={160}>
          <div className="bz-card__head">
            <h2>Messages</h2>
            <Link href="/dashboard/messages" className="bz-link">
              View All
            </Link>
          </div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {(['all', 'whatsapp', 'instagram', 'telegram', 'messenger'] as const).map((p) => (
              <Link
                key={p}
                href={p === 'all' ? '/dashboard/messages' : `/dashboard/messages?platform=${p}`}
                className={cn('bz-pill', p === 'all' && 'is-active')}
              >
                {p === 'all' ? 'All' : platformLabel(p)}
              </Link>
            ))}
          </div>
          <ul className="space-y-1.5">
            {DEMO_RECENT_LOGS.slice(0, 3).map((log) => (
              <li key={log.id}>
                <Link href={`/dashboard/messages?c=${log.conversationId}`} className="bz-msg-row">
                  <span className="bz-avatar bz-avatar--sm">{log.initials}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm text-white">{log.clientName}</span>
                      <PlatformIcon id={log.platformId} size={12} />
                    </div>
                    <p className="truncate text-xs text-slate-500">{log.customerMessage}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-600">{relativeTime(log.at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </MotionIn>

        <MotionIn as="section" className="bz-card bz-glass bz-span-8" delay={200}>
          <div className="bz-card__head">
            <h2>Recent Logs</h2>
            <Link href="/dashboard/messages" className="bz-link">
              View All
            </Link>
          </div>
          <ul className="space-y-1.5">
            {DEMO_RECENT_LOGS.slice(0, 3).map((log) => (
              <li key={log.id}>
                <Link href={`/dashboard/messages?c=${log.conversationId}`} className="bz-log-row">
                  <span className="bz-avatar">{log.initials}</span>
                  <span className="w-28 truncate text-sm text-white">{log.clientName}</span>
                  <span className="flex w-24 items-center gap-1 text-xs text-slate-400">
                    <PlatformIcon id={log.platformId} size={13} />
                    {platformLabel(log.platformId)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs text-slate-400">
                    “{log.customerMessage}”
                  </span>
                  <span className="hidden text-violet-400/70 sm:inline">→</span>
                  <span className="hidden min-w-0 flex-1 truncate text-xs text-violet-200/85 sm:block">
                    {log.aiResponse}
                  </span>
                  <span className="shrink-0 text-[11px] text-slate-500">{relativeTime(log.at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </MotionIn>

        <MotionIn as="section" className="bz-card bz-glass bz-span-4" delay={240}>
          <div className="bz-card__head">
            <h2>Clients</h2>
            <Link
              href="/dashboard/clients"
              className="bz-icon-btn bz-icon-btn--sm"
              aria-label="Open clients"
            >
              <ChevronRight size={14} />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="bz-clients-orb">
              <Users size={22} />
            </div>
            <div>
              <div className="bz-avatar-stack mb-2">
                {['KS', 'NF', 'OH', 'SB'].map((i) => (
                  <span key={i} className="bz-avatar bz-avatar--sm">
                    {i}
                  </span>
                ))}
              </div>
              <p className="text-3xl font-semibold tracking-tight text-white">{uniqueClientCount()}</p>
              <p className="text-xs font-medium text-emerald-400">+3 this month</p>
              <p className="mt-1 text-[10px] text-slate-500">Unique contacts · demo</p>
            </div>
          </div>
        </MotionIn>
      </div>

      <AppDetailModal
        app={selected}
        onClose={() => setSelected(null)}
        onPause={pause}
        onResume={resume}
        onDisconnect={disconnect}
      />
    </>
  )
}

function Empty({ text, href }: { text: string; href: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-10 text-center text-sm text-slate-400">
      <p>{text}</p>
      <Link href={href} className="bz-link mt-3 inline-flex items-center gap-1">
        Go to Authenticate <ArrowUpRight size={12} />
      </Link>
    </div>
  )
}
