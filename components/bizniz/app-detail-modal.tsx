'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { Eye, Pause, Play, Trash2, X } from 'lucide-react'
import type { ConnectedApp } from '@/lib/bizniz/types'
import { platformLabel } from '@/lib/bizniz/platforms'
import { PlatformIcon } from './platform-icon'
import { StatusDot } from './status-dot'
import { WhatsAppSessionCard } from './whatsapp-session-card'

type Props = {
  app: ConnectedApp | null
  onClose: () => void
  onPause: (id: string) => void
  onResume: (id: string) => void
  onDisconnect: (id: string) => void
}

export function AppDetailModal({ app, onClose, onPause, onResume, onDisconnect }: Props) {
  if (!app) return null

  const isWhatsApp = app.platformId === 'whatsapp'
  const connected = app.status === 'active' || app.status === 'paused' || app.status === 'error'

  return (
    <div className="bz-modal-root" role="dialog" aria-modal="true" aria-labelledby="app-modal-title">
      <button type="button" className="bz-modal-backdrop" aria-label="Close" onClick={onClose} />
      <div className={`bz-modal ${isWhatsApp ? 'bz-modal--pro' : ''}`}>
        <div className="bz-modal__head">
          <div className="flex items-center gap-3">
            <PlatformIcon id={app.platformId} size={22} />
            <div>
              <h2 id="app-modal-title" className="text-lg font-semibold tracking-tight text-white">
                {platformLabel(app.platformId)}
              </h2>
              {!isWhatsApp ? <StatusDot status={app.status} /> : (
                <p className="text-[11px] text-slate-500">ربط حي · جلسة لكل مستخدم</p>
              )}
            </div>
          </div>
          <button type="button" className="bz-icon-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {isWhatsApp ? (
          <div className="bz-modal__body space-y-4 pb-4">
            <WhatsAppSessionCard professional />
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard/authenticate" className="bz-btn bz-btn--ghost" onClick={onClose}>
                صفحة الربط الكاملة
              </Link>
              <Link
                href="/dashboard/messages?platform=whatsapp"
                className="bz-btn bz-btn--ghost"
                onClick={onClose}
              >
                <Eye size={14} /> الرسائل الحقيقية
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bz-modal__body space-y-3 text-sm">
              <Row label="Status" value={<StatusDot status={app.status} />} />
              <Row
                label="Connected"
                value={
                  app.connectedAt
                    ? new Date(app.connectedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—'
                }
              />
              <Row label="Account" value={app.accountLabel || 'Not connected'} />
              <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
                القنوات دي لسه demo. واتساب فقط مربوط بجلسة حقيقية لكل user id.
              </p>
            </div>

            <div className="bz-modal__actions">
              {connected && app.status === 'active' ? (
                <button type="button" className="bz-btn bz-btn--ghost" onClick={() => onPause(app.id)}>
                  <Pause size={14} /> Pause Automation
                </button>
              ) : null}
              {connected && app.status === 'paused' ? (
                <button type="button" className="bz-btn bz-btn--ghost" onClick={() => onResume(app.id)}>
                  <Play size={14} /> Resume Automation
                </button>
              ) : null}
              <Link
                href={`/dashboard/messages?platform=${app.platformId}`}
                className="bz-btn bz-btn--ghost"
                onClick={onClose}
              >
                <Eye size={14} /> View Messages
              </Link>
              {connected ? (
                <button
                  type="button"
                  className="bz-btn bz-btn--danger"
                  onClick={() => {
                    if (window.confirm(`Disconnect ${platformLabel(app.platformId)}?`)) {
                      onDisconnect(app.id)
                      onClose()
                    }
                  }}
                >
                  <Trash2 size={14} /> Disconnect
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 py-2">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  )
}
