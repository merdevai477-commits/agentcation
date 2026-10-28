'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import {
  clearWhatsApp,
  fetchWhatsAppSession,
  startWhatsApp,
  stopWhatsApp,
  subscribeWhatsAppEvents,
  type WhatsAppSession,
} from '@/lib/bizniz/api'
import { PlatformIcon } from '@/components/bizniz/platform-icon'

function statusLabel(status: string) {
  switch (status) {
    case 'ready':
      return 'متصل'
    case 'qr':
      return 'بانتظار المسح'
    case 'connecting':
      return 'جاري الاتصال…'
    case 'logged_out':
      return 'تم تسجيل الخروج'
    case 'stopped':
    default:
      return 'متوقف'
  }
}

function statusTone(status: string) {
  if (status === 'ready') return 'text-emerald-300'
  if (status === 'qr' || status === 'connecting') return 'text-amber-200'
  if (status === 'logged_out') return 'text-rose-300'
  return 'text-slate-400'
}

export function WhatsAppSessionCard({ compact = false }: { compact?: boolean }) {
  const { getToken, isSignedIn } = useAuth()
  const [session, setSession] = useState<WhatsAppSession | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  const tokenFn = useCallback(() => getToken(), [getToken])

  const applySession = useCallback((next: Partial<WhatsAppSession> & { status?: string }) => {
    setSession((prev) => ({
      status: next.status || prev?.status || 'stopped',
      phoneE164: next.phoneE164 !== undefined ? (next.phoneE164 as string | null) : prev?.phoneE164 ?? null,
      displayName:
        next.displayName !== undefined ? (next.displayName as string | null) : prev?.displayName ?? null,
      lastError: next.lastError !== undefined ? (next.lastError as string | null) : prev?.lastError ?? null,
      qrDataUrl:
        next.qrDataUrl !== undefined ? (next.qrDataUrl as string | null) : prev?.qrDataUrl ?? null,
      lastQrAt: next.lastQrAt !== undefined ? (next.lastQrAt as string | null) : prev?.lastQrAt ?? null,
    }))
  }, [])

  useEffect(() => {
    if (!isSignedIn) return
    let cancelled = false
    void (async () => {
      try {
        const s = await fetchWhatsAppSession(tokenFn)
        if (!cancelled) setSession(s)
      } catch (err) {
        if (!cancelled) setError((err as Error).message)
      }
    })()

    const unsub = subscribeWhatsAppEvents(tokenFn, (ev) => {
      if (ev.type === 'qr') {
        applySession({
          status: 'qr',
          qrDataUrl: (ev.qrDataUrl as string) || null,
        })
        return
      }
      if (ev.type === 'ready') {
        applySession({
          status: 'ready',
          phoneE164: (ev.phoneE164 as string) || null,
          displayName: (ev.displayName as string) || null,
          qrDataUrl: null,
        })
        return
      }
      applySession({
        status: (ev.status as string) || undefined,
        phoneE164: ev.phoneE164 as string | null | undefined,
        displayName: ev.displayName as string | null | undefined,
        qrDataUrl: ev.qrDataUrl as string | null | undefined,
        lastError: (ev.error as string) || (ev.lastError as string) || undefined,
      })
    })

    return () => {
      cancelled = true
      unsub()
    }
  }, [isSignedIn, tokenFn, applySession])

  async function run(action: 'start' | 'stop' | 'clear') {
    setBusy(action)
    setError('')
    try {
      const fn = action === 'start' ? startWhatsApp : action === 'stop' ? stopWhatsApp : clearWhatsApp
      const s = await fn(tokenFn)
      setSession(s)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const status = session?.status || 'stopped'
  const connected = status === 'ready'

  return (
    <article className={compact ? 'space-y-3' : 'bz-card bz-glass'}>
      {!compact ? (
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="bz-platform-card__icon">
              <PlatformIcon id="whatsapp" size={22} />
            </span>
            <div>
              <h2 className="font-medium text-white">WhatsApp</h2>
              <p className={`mt-0.5 text-xs ${statusTone(status)}`}>{statusLabel(status)}</p>
              {connected ? (
                <p className="mt-1 text-xs text-slate-400">
                  {[session?.displayName, session?.phoneE164].filter(Boolean).join(' · ') || 'Connected'}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">امسح QR من واتساب على الموبايل (أجهزة مرتبطة)</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className={`text-sm ${statusTone(status)}`}>{statusLabel(status)}</p>
          {connected ? (
            <p className="mt-1 text-xs text-slate-400">
              {[session?.displayName, session?.phoneE164].filter(Boolean).join(' · ') || 'Connected'}
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-500">امسح QR من واتساب على الموبايل (أجهزة مرتبطة)</p>
          )}
        </div>
      )}

      {status === 'qr' && session?.qrDataUrl ? (
        <div className="mt-4 flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={session.qrDataUrl} alt="WhatsApp QR" className="h-56 w-56 rounded-lg bg-white p-2" />
          <p className="text-center text-xs text-slate-400">افتح واتساب ← الأجهزة المرتبطة ← ربط جهاز</p>
        </div>
      ) : null}

      {error || session?.lastError ? (
        <p className="mt-3 rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
          {error || session?.lastError}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="bz-btn bz-btn--primary bz-btn--glow"
          disabled={!!busy || status === 'ready' || status === 'connecting'}
          onClick={() => void run('start')}
        >
          {busy === 'start' ? '…' : 'تشغيل'}
        </button>
        <button
          type="button"
          className="bz-btn bz-btn--ghost"
          disabled={!!busy || status === 'stopped'}
          onClick={() => void run('stop')}
        >
          {busy === 'stop' ? '…' : 'إيقاف'}
        </button>
        <button
          type="button"
          className="bz-btn bz-btn--danger"
          disabled={!!busy}
          onClick={() => {
            if (window.confirm('مسح الجلسة وتسجيل الخروج من واتساب؟')) void run('clear')
          }}
        >
          {busy === 'clear' ? '…' : 'مسح'}
        </button>
      </div>
    </article>
  )
}
