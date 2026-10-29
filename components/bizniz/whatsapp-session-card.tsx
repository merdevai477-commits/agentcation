'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { CheckCircle2, Link2Off, Loader2, QrCode, RotateCcw, ShieldCheck } from 'lucide-react'
import {
  clearWhatsApp,
  fetchWhatsAppSession,
  restartWhatsApp,
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
    case 'reconnecting':
      return 'إعادة اتصال…'
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
  const [linkingHint, setLinkingHint] = useState(false)
  const sawQr = useRef(false)

  const tokenFn = useCallback(() => getToken(), [getToken])

  const applySession = useCallback((next: Partial<WhatsAppSession> & { status?: string }) => {
    setSession((prev) => {
      const status = next.status || prev?.status || 'stopped'
      const qrDataUrl =
        next.qrDataUrl !== undefined ? (next.qrDataUrl as string | null) : prev?.qrDataUrl ?? null
      if (status === 'qr' && qrDataUrl) sawQr.current = true
      if (status === 'ready' || status === 'logged_out' || status === 'stopped') {
        sawQr.current = false
        setLinkingHint(false)
      } else if (sawQr.current && (status === 'connecting' || (!qrDataUrl && status !== 'qr'))) {
        setLinkingHint(true)
      }
      return {
        userId: (next.userId as string | undefined) || prev?.userId,
        status,
        phoneE164: next.phoneE164 !== undefined ? (next.phoneE164 as string | null) : prev?.phoneE164 ?? null,
        displayName:
          next.displayName !== undefined ? (next.displayName as string | null) : prev?.displayName ?? null,
        lastError: next.lastError !== undefined ? (next.lastError as string | null) : prev?.lastError ?? null,
        qrDataUrl,
        lastQrAt: next.lastQrAt !== undefined ? (next.lastQrAt as string | null) : prev?.lastQrAt ?? null,
        hasCreds: next.hasCreds !== undefined ? next.hasCreds : prev?.hasCreds,
        canRestart: next.canRestart !== undefined ? next.canRestart : prev?.canRestart,
        sessionsDurable:
          next.sessionsDurable !== undefined ? next.sessionsDurable : prev?.sessionsDurable,
        sessionsDir: next.sessionsDir !== undefined ? next.sessionsDir : prev?.sessionsDir,
        linked: next.linked !== undefined ? next.linked : prev?.linked,
        live: next.live !== undefined ? next.live : prev?.live,
      }
    })
  }, [])

  useEffect(() => {
    if (!isSignedIn) return
    let cancelled = false
    void (async () => {
      try {
        const s = await fetchWhatsAppSession(tokenFn)
        if (!cancelled) {
          if (s.status === 'qr' && s.qrDataUrl) sawQr.current = true
          setSession(s)
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message)
      }
    })()

    const unsub = subscribeWhatsAppEvents(tokenFn, (ev) => {
      if (ev.type === 'qr') {
        sawQr.current = true
        setLinkingHint(false)
        applySession({ status: 'qr', qrDataUrl: (ev.qrDataUrl as string) || null })
        return
      }
      if (ev.type === 'ready') {
        sawQr.current = false
        setLinkingHint(false)
        applySession({
          status: 'ready',
          phoneE164: (ev.phoneE164 as string) || null,
          displayName: (ev.displayName as string) || null,
          qrDataUrl: null,
          hasCreds: true,
          canRestart: true,
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

  async function run(action: 'start' | 'stop' | 'clear' | 'restart') {
    setBusy(action)
    setError('')
    try {
      const fn =
        action === 'start'
          ? startWhatsApp
          : action === 'stop'
            ? stopWhatsApp
            : action === 'clear'
              ? clearWhatsApp
              : restartWhatsApp
      const next = await fn(tokenFn)
      if (action === 'clear') {
        sawQr.current = false
        setLinkingHint(false)
      }
      setSession(next)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const status = session?.status || 'stopped'
  const linked = status === 'ready'
  const hasCreds = Boolean(session?.hasCreds || session?.canRestart || session?.linked)
  const loading =
    busy === 'start' ||
    busy === 'restart' ||
    status === 'connecting' ||
    status === 'reconnecting' ||
    linkingHint ||
    (status === 'qr' && !session?.qrDataUrl)
  const waitingScan = status === 'qr' && Boolean(session?.qrDataUrl)
  const hasAccount = Boolean(session?.phoneE164) || status === 'reconnecting' || linked || hasCreds
  const shell = professional || compact
  const badgeWait = loading || waitingScan
  const durable = session?.sessionsDurable !== false

  return (
    <article className={cn(!shell && 'bz-card bz-glass', shell && 'bz-wa-pro')}>
      <div className="bz-wa-pro__hero">
        <div className="bz-wa-pro__brand">
          <span className="bz-wa-pro__icon">
            <PlatformIcon id="whatsapp" size={26} />
          </span>
          <div>
            <p className="bz-wa-pro__eyebrow">جلسة واتساب حقيقية · إعادة اتصال تلقائي</p>
            <h3 className="bz-wa-pro__title">WhatsApp Business Link</h3>
          </div>
        </div>
        <span
          className={cn(
            'bz-wa-pro__badge',
            linked ? 'is-on' : badgeWait ? 'is-wait' : 'is-off',
          )}
        >
          {linked ? (
            <CheckCircle2 size={14} />
          ) : loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : waitingScan ? (
            <QrCode size={14} />
          ) : (
            <Link2Off size={14} />
          )}
          {loading && status === 'qr' ? 'جاري الربط…' : statusLabel(status)}
        </span>
      </div>

      <div className="bz-wa-pro__grid">
        <div className="bz-wa-pro__tile">
          <span>حساب Clerk</span>
          <strong className="truncate">{userId || session?.userId || '—'}</strong>
        </div>
        <div className="bz-wa-pro__tile">
          <span>رقم واتساب</span>
          <strong>{hasAccount ? session?.phoneE164 || '—' : 'غير مرتبط'}</strong>
        </div>
        <div className="bz-wa-pro__tile">
          <span>اسم العرض</span>
          <strong>{hasAccount ? session?.displayName || '—' : '—'}</strong>
        </div>
        <div className="bz-wa-pro__tile">
          <span>الحالة</span>
          <strong
            className={
              linked
                ? 'text-emerald-300'
                : loading || waitingScan
                  ? 'text-amber-200'
                  : 'text-slate-300'
            }
          >
            {loading && !linked ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 size={13} className="animate-spin" />
                {status === 'reconnecting' || busy === 'restart' ? 'إعادة تشغيل…' : 'جاري الربط…'}
              </span>
            ) : (
              statusLabel(status)
            )}
          </strong>
        </div>
      </div>

      {session && session.sessionsDurable === false ? (
        <p className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          تحذير: مجلد الجلسة مش على Volume ثابت. بعد كل ديبلوي هتحتاج QR تاني. في Railway اعمل Volume
          mount على <code className="text-amber-50">/data</code> وVariable{' '}
          <code className="text-amber-50">WHATSAPP_SESSIONS_DIR=/data/.wa-sessions</code>.
        </p>
      ) : null}

      {loading && !waitingScan ? (
        <div className="bz-wa-pro__loading" role="status" aria-live="polite">
          <Loader2 size={22} className="animate-spin text-amber-300" />
          <div>
            <p className="text-sm font-medium text-white">
              {busy === 'restart' || status === 'reconnecting'
                ? 'جاري إعادة تشغيل الجلسة المحفوظة…'
                : 'جاري تحميل واتساب…'}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {hasCreds
                ? 'بنستخدم ملفات الجلسة المحفوظة — من غير QR جديد.'
                : 'بعد المسح بنكمّل الربط — استنى ثواني لحد ما تظهر «مرتبط».'}
            </p>
          </div>
        </div>
      ) : null}

      {waitingScan ? (
        <div className="bz-wa-pro__qr">
          <div className="bz-wa-pro__qr-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={session?.qrDataUrl || ''} alt="WhatsApp QR" />
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-white">
              <QrCode size={16} /> امسح من الموبايل
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              واتساب ← الإعدادات ← الأجهزة المرتبطة ← ربط جهاز. بعد أول مسح ناجح، زر «إعادة التشغيل»
              بيرجع الجلسة من غير QR (طالما الـ Volume محفوظ).
            </p>
          </div>
        </div>
      ) : null}

      {linked ? (
        <p className="bz-wa-pro__ok">
          <ShieldCheck size={14} /> الرقم مربوط. لو الديلوي قطع الاتصال، اضغط «إعادة التشغيل» — هترجع من
          الجلسة المحفوظة{durable ? '' : ' (بعد ما تثبّت Volume)'}.
        </p>
      ) : loading ? (
        <p className="bz-wa-pro__hint inline-flex items-center gap-1.5">
          <Loader2 size={13} className="animate-spin" />
          التحميل شغّال — متقفلش الصفحة لحد ما الحالة تبقى مرتبط.
        </p>
      ) : hasCreds ? (
        <p className="bz-wa-pro__hint">
          في جلسة محفوظة على السيرفر. اضغط «إعادة التشغيل» عشان تشتغل من غير QR جديد.
        </p>
      ) : (
        <p className="bz-wa-pro__hint">
          اضغط تشغيل واظهر QR، بعد المسح هيظهر الرقم هنا كـ «مرتبط».
        </p>
      )}

      {error || (session?.lastError && status !== 'ready') ? (
        <p className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
          {error || session?.lastError}
        </p>
      ) : null}

      <div className="bz-wa-pro__actions">
        <button
          type="button"
          className="bz-btn bz-btn--primary bz-btn--glow"
          disabled={
            !!busy || status === 'ready' || status === 'connecting' || status === 'reconnecting' || linkingHint
          }
          onClick={() => void run('start')}
        >
          {busy === 'start' ? <Loader2 size={14} className="animate-spin" /> : null}
          {busy === 'start' ? 'جاري التشغيل…' : hasCreds ? 'تشغيل الجلسة' : 'تشغيل'}
        </button>
        <button
          type="button"
          className="bz-btn bz-btn--ghost"
          disabled={!!busy || !hasCreds || status === 'connecting' || status === 'reconnecting' || linkingHint}
          onClick={() => void run('restart')}
          title="إعادة تشغيل من الجلسة المحفوظة بدون QR"
        >
          {busy === 'restart' ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <RotateCcw size={14} />
          )}
          {busy === 'restart' ? 'جاري إعادة التشغيل…' : 'إعادة التشغيل'}
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
