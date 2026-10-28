'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { CheckCircle2, Link2Off, Loader2, QrCode, ShieldCheck } from 'lucide-react'
import {
  clearWhatsApp,
  fetchWhatsAppSession,
  startWhatsApp,
  stopWhatsApp,
  subscribeWhatsAppEvents,
  type WhatsAppSession,
} from '@/lib/bizniz/api'
import { PlatformIcon } from '@/components/bizniz/platform-icon'
import { cn } from '@/lib/utils'

function statusLabel(status: string) {
  switch (status) {
    case 'ready':
      return 'مرتبط'
    case 'qr':
      return 'بانتظار المسح'
    case 'connecting':
      return 'جاري الربط…'
    case 'logged_out':
      return 'غير مرتبط'
    case 'stopped':
    default:
      return 'غير مرتبط'
  }
}

export function WhatsAppSessionCard({
  compact = false,
  professional = false,
}: {
  compact?: boolean
  professional?: boolean
}) {
  const { getToken, isSignedIn, userId } = useAuth()
  const [session, setSession] = useState<WhatsAppSession | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  const tokenFn = useCallback(() => getToken(), [getToken])

  const applySession = useCallback((next: Partial<WhatsAppSession> & { status?: string }) => {
    setSession((prev) => ({
      userId: (next.userId as string | undefined) || prev?.userId,
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
        applySession({ status: 'qr', qrDataUrl: (ev.qrDataUrl as string) || null })
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
      setSession(await fn(tokenFn))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const status = session?.status || 'stopped'
  const linked = status === 'ready'
  const shell = professional || compact

  return (
    <article className={cn(!shell && 'bz-card bz-glass', shell && 'bz-wa-pro')}>
      <div className="bz-wa-pro__hero">
        <div className="bz-wa-pro__brand">
          <span className="bz-wa-pro__icon">
            <PlatformIcon id="whatsapp" size={26} />
          </span>
          <div>
            <p className="bz-wa-pro__eyebrow">جلسة واتساب حقيقية</p>
            <h3 className="bz-wa-pro__title">WhatsApp Business Link</h3>
          </div>
        </div>
        <span className={cn('bz-wa-pro__badge', linked ? 'is-on' : 'is-off')}>
          {linked ? <CheckCircle2 size={14} /> : <Link2Off size={14} />}
          {statusLabel(status)}
        </span>
      </div>

      <div className="bz-wa-pro__grid">
        <div className="bz-wa-pro__tile">
          <span>حساب Clerk</span>
          <strong className="truncate">{userId || session?.userId || '—'}</strong>
        </div>
        <div className="bz-wa-pro__tile">
          <span>رقم واتساب</span>
          <strong>{linked ? session?.phoneE164 || '—' : 'غير مرتبط'}</strong>
        </div>
        <div className="bz-wa-pro__tile">
          <span>اسم العرض</span>
          <strong>{linked ? session?.displayName || '—' : '—'}</strong>
        </div>
        <div className="bz-wa-pro__tile">
          <span>الحالة</span>
          <strong className={linked ? 'text-emerald-300' : 'text-slate-300'}>{statusLabel(status)}</strong>
        </div>
      </div>

      {status === 'qr' && session?.qrDataUrl ? (
        <div className="bz-wa-pro__qr">
          <div className="bz-wa-pro__qr-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={session.qrDataUrl} alt="WhatsApp QR" />
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-white">
              <QrCode size={16} /> امسح من الموبايل
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              واتساب ← الإعدادات ← الأجهزة المرتبطة ← ربط جهاز. الجلسة مربوطة بـ user id بتاعك فقط.
            </p>
          </div>
        </div>
      ) : null}

      {linked ? (
        <p className="bz-wa-pro__ok">
          <ShieldCheck size={14} /> الرقم ده مربوط بحسابك — الرسائل الواردة هترد تلقائي حسب قصة البيزنز.
        </p>
      ) : (
        <p className="bz-wa-pro__hint">
          اضغط تشغيل واظهر QR، بعد المسح هيظهر الرقم والاسم هنا كـ «مرتبط».
        </p>
      )}

      {error || session?.lastError ? (
        <p className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
          {error || session?.lastError}
        </p>
      ) : null}

      <div className="bz-wa-pro__actions">
        <button
          type="button"
          className="bz-btn bz-btn--primary bz-btn--glow"
          disabled={!!busy || status === 'ready' || status === 'connecting'}
          onClick={() => void run('start')}
        >
          {busy === 'start' ? <Loader2 size={14} className="animate-spin" /> : null}
          {busy === 'start' ? 'جاري التشغيل…' : 'تشغيل'}
        </button>
        <button
          type="button"
          className="bz-btn bz-btn--ghost"
          disabled={!!busy || status === 'stopped' || status === 'logged_out'}
          onClick={() => void run('stop')}
        >
          إيقاف
        </button>
        <button
          type="button"
          className="bz-btn bz-btn--danger"
          disabled={!!busy}
          onClick={() => {
            if (window.confirm('مسح الجلسة وفك ارتباط واتساب من حسابك؟')) void run('clear')
          }}
        >
          مسح الارتباط
        </button>
      </div>
    </article>
  )
}
