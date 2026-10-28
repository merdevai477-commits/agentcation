'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ChevronRight, Loader2, MoreVertical, TrendingUp, Users } from 'lucide-react'
import { BIZNIZ_DEMO_LABEL } from '@/lib/bizniz/demo-data'
import { platformLabel } from '@/lib/bizniz/platforms'
import { relativeTime, useBiznizApps } from '@/lib/bizniz/store'
import { useLiveOverview } from '@/lib/bizniz/use-live-overview'
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
  const { apps, pause, resume, disconnect } = useBiznizApps()
  const { data: live, loading: liveLoading } = useLiveOverview()
  const [platformFilter, setPlatformFilter] = useState<'all' | PlatformId>('all')
  const [selected, setSelected] = useState<ConnectedApp | null>(null)
  const [menuId, setMenuId] = useState<string | null>(null)

  const mergedApps = useMemo(() => {
    return apps.map((app) => {
      if (app.platformId !== 'whatsapp' || !live?.whatsapp) return app
      const wa = live.whatsapp
      return {
        ...app,
        status: wa.status,
        accountLabel: wa.accountLabel,
        connectedAt: wa.linked ? wa.session.lastQrAt || new Date().toISOString() : undefined,
        automationPaused: wa.status !== 'active',
        messagesThisMonth: wa.messagesThisMonth,
        messageDeltaPct: wa.messageDeltaPct,
      } satisfies ConnectedApp
    })
  }, [apps, live])

  const chart = useMemo(() => {
    const series = live?.chart?.length
      ? live.chart
      : Array.from({ length: 14 }, (_, i) => {
          const d = new Date()
          d.setUTCDate(d.getUTCDate() - (13 - i))
          return {
            date: d.toISOString().slice(0, 10),
            label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
            value: 0,
          }
        })
    if (platformFilter === 'all' || platformFilter === 'whatsapp') return series
    return series.map((p) => ({ ...p, value: 0 }))
  }, [live, platformFilter])

  const max = Math.max(...chart.map((c) => c.value), 1)
  const recentLogs = live?.recentLogs || []
  const clients = live?.clients || []
  const clientCount = live?.whatsapp.clientCount ?? 0
  const waSummary = mergedApps.filter((a) => a.platformId === 'whatsapp')
  const summaryApps =
    platformFilter === 'all'
      ? waSummary
      : mergedApps.filter((a) => a.platformId === platformFilter)

  return (
    <>
      <MotionIn>
        <BiznizTopbar
          title={`Welcome back, ${userName.split(' ')[0] || userName}`}
          subtitle="Manage your clients and automate their business in one place."
        />
      </MotionIn>

      <p className="bz-hint mb-5 flex items-center gap-2">
        {liveLoading ? <Loader2 size={12} className="animate-spin" /> : null}
        {BIZNIZ_DEMO_LABEL}
      </p>

      <div className="bz-home-grid">
        <MotionIn as="section" className="bz-card bz-glass bz-span-8" delay={40}>
          <div className="bz-card__head">
            <div>
              <h2>AI Automations</h2>
              <p className="bz-card__meta">Live WhatsApp volume from your linked session</p>
            </div>
            <span className="bz-chip">This Month</span>
          </div>
          {summaryApps.length === 0 ? (
            <Empty text="Connect WhatsApp from Authenticate to see live volume." href="/dashboard/authenticate" />
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
                    {liveLoading && app.platformId === 'whatsapp' ? (
                      <Loader2 size={18} className="animate-spin text-slate-400" />
                    ) : (
                      app.messagesThisMonth.toLocaleString()
                    )}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    {typeof app.messageDeltaPct === 'number' && app.messagesThisMonth > 0 ? (
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
                      <span className="text-slate-500">live</span>
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
            {mergedApps.map((app) => (
              <li key={app.id} className="relative">
                <button type="button" className="bz-row" onClick={() => setSelected(app)}>
                  <span className="bz-platform-card__icon bz-platform-card__icon--sm">
                    <PlatformIcon id={app.platformId} size={15} />
                  </span>
                  <span className="flex-1 text-start text-sm text-slate-200">
                    {platformLabel(app.platformId)}
                    {app.platformId === 'whatsapp' && app.accountLabel ? (
                      <span className="mt-0.5 block truncate text-[10px] text-slate-500">{app.accountLabel}</span>
                    ) : null}
                  </span>
                  {app.platformId === 'whatsapp' &&
                  (live?.whatsapp.session.status === 'connecting' ||
                    live?.whatsapp.session.status === 'reconnecting' ||
                    live?.whatsapp.session.status === 'qr') ? (
                    <Loader2 size={14} className="animate-spin text-amber-300" />
                  ) : (
                    <StatusDot status={app.status} />
                  )}
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
              <p className="bz-card__meta">WhatsApp volume from your linked inbox</p>
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
          <div className="bz-chart" role="img" aria-label="Message volume chart">
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
                <span>{point.label.replace(/^[A-Za-z]+ /, '')}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-slate-500">
            {platformFilter === 'instagram' || platformFilter === 'telegram' || platformFilter === 'messenger'
              ? 'No live connector for this channel yet — chart stays empty.'
              : 'Live WhatsApp series from stored conversations.'}
          </p>
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
          {recentLogs.length === 0 ? (
            <p className="px-1 py-6 text-center text-xs text-slate-500">
              {liveLoading ? 'Loading live messages…' : 'No WhatsApp messages yet.'}
            </p>
          ) : (
            <ul className="space-y-1.5">
              {recentLogs.slice(0, 3).map((log) => (
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
          )}
        </MotionIn>

        <MotionIn as="section" className="bz-card bz-glass bz-span-8" delay={200}>
          <div className="bz-card__head">
            <h2>Recent Logs</h2>
            <Link href="/dashboard/messages" className="bz-link">
              View All
            </Link>
          </div>
          {recentLogs.length === 0 ? (
            <p className="px-1 py-8 text-center text-xs text-slate-500">
              {liveLoading ? 'Loading…' : 'Logs appear here when customers message your linked WhatsApp.'}
            </p>
          ) : (
            <ul className="space-y-1.5">
              {recentLogs.slice(0, 5).map((log) => (
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
                      {log.aiResponse || '—'}
                    </span>
                    <span className="shrink-0 text-[11px] text-slate-500">{relativeTime(log.at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
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
                {(clients.length ? clients : [{ initials: '?' }]).slice(0, 4).map((c, i) => (
                  <span key={`${c.initials}-${i}`} className="bz-avatar bz-avatar--sm">
                    {c.initials}
                  </span>
                ))}
              </div>
              <p className="text-3xl font-semibold tracking-tight text-white">{clientCount}</p>
              <p className="text-xs font-medium text-emerald-400">WhatsApp contacts</p>
              <p className="mt-1 text-[10px] text-slate-500">From your linked session</p>
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
