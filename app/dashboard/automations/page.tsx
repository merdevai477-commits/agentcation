'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Pause, Play, Plus } from 'lucide-react'
import { platformLabel } from '@/lib/bizniz/platforms'
import { relativeTime, useBiznizAutomations } from '@/lib/bizniz/store'
import { BiznizTopbar } from '@/components/bizniz/shell/topbar'
import { MotionIn } from '@/components/bizniz/motion-in'
import { PlatformIcon } from '@/components/bizniz/platform-icon'
import { StatusDot } from '@/components/bizniz/status-dot'

function AutomationsInner() {
  const params = useSearchParams()
  const highlightNew = params.get('new') === '1'
  const { autos, pause, resume } = useBiznizAutomations()
  const [notice, setNotice] = useState(
    highlightNew ? 'New automation wizard is not connected yet — create flow coming with live connectors.' : '',
  )

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
            {autos.map((a) => (
              <tr key={a.id}>
                <td className="font-medium text-white">{a.name}</td>
                <td>
                  <span className="inline-flex items-center gap-1.5 text-slate-300">
                    <PlatformIcon id={a.platformId} size={14} />
                    {platformLabel(a.platformId)}
                  </span>
                </td>
                <td>
                  <StatusDot status={a.status === 'active' ? 'active' : 'paused'} />
                </td>
                <td className="text-slate-300">{a.messageCount.toLocaleString()}</td>
                <td className="text-slate-500">{relativeTime(a.lastActivityAt)}</td>
                <td>
                  {a.status === 'active' ? (
                    <button type="button" className="bz-btn bz-btn--ghost" onClick={() => pause(a.id)}>
                      <Pause size={13} /> Pause
                    </button>
                  ) : (
                    <button type="button" className="bz-btn bz-btn--ghost" onClick={() => resume(a.id)}>
                      <Play size={13} /> Resume
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </MotionIn>

      <MotionIn delay={120}>
        <button
          type="button"
          className="bz-btn bz-btn--primary bz-btn--glow mt-4"
          onClick={() =>
            setNotice(
              'Creating a new automation needs a connected channel. Connect apps from Authenticate first (demo).',
            )
          }
        >
          <Plus size={15} /> New Automation
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
