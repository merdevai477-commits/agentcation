'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PLATFORMS } from '@/lib/bizniz/platforms'
import { useBiznizApps } from '@/lib/bizniz/store'
import type { ConnectedApp } from '@/lib/bizniz/types'
import { AppDetailModal } from '@/components/bizniz/app-detail-modal'
import { MotionIn } from '@/components/bizniz/motion-in'
import { PlatformIcon } from '@/components/bizniz/platform-icon'
import { StatusDot } from '@/components/bizniz/status-dot'
import { BiznizTopbar } from '@/components/bizniz/shell/topbar'
import { platformLabel } from '@/lib/bizniz/platforms'

export default function AuthenticatePage() {
  const { apps, pause, resume, disconnect, connectDemo } = useBiznizApps()
  const [selected, setSelected] = useState<ConnectedApp | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  async function simulateConnect(app: ConnectedApp) {
    setBusy(app.id)
    setToast('Opening connector…')
    await new Promise((r) => setTimeout(r, 700))
    const platform = PLATFORMS.find((p) => p.id === app.platformId)
    if (!platform?.connectorAvailable) {
      // Honest: no real OAuth in repo — still allow demo connect for UI walkthrough
      connectDemo(
        app.id,
        app.platformId === 'whatsapp'
          ? '+20 10 •••• 0000'
          : app.platformId === 'instagram'
            ? '@your.brand'
            : app.platformId === 'telegram'
              ? '@your_bot'
              : 'Page · demo',
      )
      setToast(
        `Demo connection saved for ${platformLabel(app.platformId)}. Real OAuth/session connector is not wired yet.`,
      )
    }
    setBusy(null)
  }

  return (
    <>
      <MotionIn>
        <BiznizTopbar
          title="Authenticate"
          subtitle="Connect social channels for your Business Agents."
          showNewAutomation={false}
        />
      </MotionIn>

      <MotionIn delay={40}>
        <p className="mb-4 rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/90">
          No live WhatsApp Web / Meta OAuth connectors are implemented in this repository yet. Connect
          actions update <strong>demo local state</strong> so you can test the UI.
        </p>
      </MotionIn>

      {toast ? (
        <p className="mb-4 rounded-xl border border-violet-400/25 bg-violet-500/10 px-3 py-2 text-xs text-violet-100">
          {toast}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {apps.map((app, i) => {
          const connected = app.status === 'active' || app.status === 'paused' || app.status === 'error'
          return (
            <MotionIn key={app.id} as="article" className="bz-card bz-glass" delay={60 + i * 50}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="bz-platform-card__icon">
                    <PlatformIcon id={app.platformId} size={22} />
                  </span>
                  <div>
                    <h2 className="font-medium text-white">{platformLabel(app.platformId)}</h2>
                    <StatusDot status={app.status} />
                    <p className="mt-1 text-xs text-slate-500">{app.accountLabel || 'No account linked'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {!connected ? (
                  <button
                    type="button"
                    className="bz-btn bz-btn--primary bz-btn--glow"
                    disabled={busy === app.id}
                    onClick={() => void simulateConnect(app)}
                  >
                    {busy === app.id ? 'Connecting…' : 'Connect'}
                  </button>
                ) : null}
                {connected && app.status === 'active' ? (
                  <button type="button" className="bz-btn bz-btn--ghost" onClick={() => pause(app.id)}>
                    Pause automation
                  </button>
                ) : null}
                {connected && app.status === 'paused' ? (
                  <button type="button" className="bz-btn bz-btn--ghost" onClick={() => resume(app.id)}>
                    Resume automation
                  </button>
                ) : null}
                {connected ? (
                  <>
                    <Link
                      href={`/dashboard/messages?platform=${app.platformId}`}
                      className="bz-btn bz-btn--ghost"
                    >
                      View messages
                    </Link>
                    <button type="button" className="bz-btn bz-btn--ghost" onClick={() => setSelected(app)}>
                      Details
                    </button>
                    <button
                      type="button"
                      className="bz-btn bz-btn--danger"
                      onClick={() => {
                        if (window.confirm(`Disconnect ${platformLabel(app.platformId)}?`)) {
                          disconnect(app.id)
                        }
                      }}
                    >
                      Disconnect
                    </button>
                  </>
                ) : null}
              </div>
            </MotionIn>
          )
        })}
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
