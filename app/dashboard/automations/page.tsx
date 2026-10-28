'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Loader2, Pause, Play, Plus } from 'lucide-react'
import { platformLabel } from '@/lib/bizniz/platforms'
import { relativeTime } from '@/lib/bizniz/store'
import { useLiveOverview } from '@/lib/bizniz/use-live-overview'
import { BiznizTopbar } from '@/components/bizniz/shell/topbar'
import { MotionIn } from '@/components/bizniz/motion-in'
import { PlatformIcon } from '@/components/bizniz/platform-icon'
import { StatusDot } from '@/components/bizniz/status-dot'

function AutomationsInner() {
  const params = useSearchParams()
  const highlightNew = params.get('new') === '1'
  const { data: live, loading } = useLiveOverview()
  const [paused, setPaused] = useState(false)
  const [notice, setNotice] = useState(
    highlightNew ? 'Connect WhatsApp from Authenticate, then manage the live agent here.' : '',
  )

  const row = useMemo(() => {
    const wa = live?.whatsapp
    if (!wa) {
      return {
        name: 'WhatsApp Support Agent',
        platformId: 'whatsapp' as const,
        status: 'paused' as const,
        messageCount: 0,
        lastActivityAt: new Date(0).toISOString(),
        linking: false,
      }
    }
    const linking =
      wa.session.status === 'connecting' ||
      wa.session.status === 'reconnecting' ||
      wa.session.status === 'qr'
    const active = wa.linked && !paused
    return {
      name: 'WhatsApp Support Agent',
      platformId: 'whatsapp' as const,
      status: (active ? 'active' : 'paused') as 'active' | 'paused',
      messageCount: wa.messagesThisMonth,
      lastActivityAt: wa.lastActivityAt || new Date(0).toISOString(),
      linking,
      accountLabel: wa.accountLabel,
    }
  }, [live, paused])

  return (
    <>
      <MotionIn>
        <BiznizTopbar
          title="AI Automations"
          subtitle="Pause or resume channel automations for your Business Agents."
        />
      </MotionIn>

      {notice ? (
        <MotionIn delay={40}>
          <p className="mb-4 rounded-xl border border-violet-400/25 bg-violet-500/10 px-3 py-2 text-xs text-violet-100">
            {notice}{' '}
            <button type="button" className="underline" onClick={() => setNotice('')}>
              Dismiss
            </button>
          </p>
        </MotionIn>
      ) : null}

      <MotionIn as="section" className="bz-card bz-glass overflow-x-auto" delay={80}>
        <table className="bz-table">
          <thead>
            <tr>
              <th>Automation</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Messages</th>
              <th>Last activity</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Automation" className="font-medium text-white">
                {row.name}
                {row.accountLabel ? (
                  <span className="mt-0.5 block text-[11px] font-normal text-slate-500">{row.accountLabel}</span>
                ) : null}
              </td>
              <td data-label="Platform">
                <span className="inline-flex items-center gap-1.5 text-slate-300">
                  <PlatformIcon id={row.platformId} size={14} />
                  {platformLabel(row.platformId)}
                </span>
              </td>
              <td data-label="Status">
                {loading || row.linking ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-200">
                    <Loader2 size={13} className="animate-spin" />
                    {row.linking ? 'Linking…' : 'Loading…'}
                  </span>
                ) : (
                  <StatusDot status={row.status === 'active' ? 'active' : 'paused'} />
                )}
              </td>
              <td data-label="Messages" className="text-slate-300">
                {loading ? '—' : row.messageCount.toLocaleString()}
              </td>
              <td data-label="Last activity" className="text-slate-500">
                {row.lastActivityAt === new Date(0).toISOString()
                  ? '—'
                  : relativeTime(row.lastActivityAt)}
              </td>
              <td data-label="">
                {row.status === 'active' ? (
                  <button type="button" className="bz-btn bz-btn--ghost" onClick={() => setPaused(true)}>
                    <Pause size={13} /> Pause
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bz-btn bz-btn--ghost"
                    onClick={() => {
                      if (!live?.whatsapp.linked) {
                        setNotice('Link WhatsApp from Authenticate before resuming the agent.')
                        return
                      }
                      setPaused(false)
                    }}
                  >
                    <Play size={13} /> Resume
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </MotionIn>

      <MotionIn delay={120} className="mt-4 flex flex-wrap gap-2">
        <Link href="/dashboard/authenticate" className="bz-btn bz-btn--primary bz-btn--glow">
          <Plus size={15} /> Link WhatsApp
        </Link>
        <button
          type="button"
          className="bz-btn bz-btn--ghost"
          onClick={() =>
            setNotice('Other platforms (Instagram / Telegram / Messenger) stay unavailable until their live connectors ship.')
          }
        >
          New Automation
        </button>
      </MotionIn>
    </>
  )
}

export default function AutomationsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
      <AutomationsInner />
    </Suspense>
  )
}
