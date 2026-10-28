'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { DEMO_CONVERSATIONS } from '@/lib/bizniz/demo-data'
import { fetchLiveConversations, type LiveConversation } from '@/lib/bizniz/api'
import { platformLabel } from '@/lib/bizniz/platforms'
import { relativeTime } from '@/lib/bizniz/store'
import type { PlatformId } from '@/lib/bizniz/types'
import { BiznizTopbar } from '@/components/bizniz/shell/topbar'
import { MotionIn } from '@/components/bizniz/motion-in'
import { PlatformIcon } from '@/components/bizniz/platform-icon'
import { cn } from '@/lib/utils'

type Thread = {
  id: string
  platformId: PlatformId
  clientName: string
  initials: string
  preview: string
  updatedAt: string
  live: boolean
  messages: { id: string; role: 'customer' | 'ai'; senderLabel: string; text: string; at: string }[]
}

function toThread(c: LiveConversation): Thread {
  return {
    id: c.id,
    platformId: c.platformId,
    clientName: c.clientName,
    initials: c.initials,
    preview: c.preview,
    updatedAt: c.updatedAt,
    live: true,
    messages: c.messages,
  }
}

function demoThreads(): Thread[] {
  return DEMO_CONVERSATIONS.map((c) => ({
    id: c.id,
    platformId: c.platformId,
    clientName: c.clientName,
    initials: c.initials,
    preview: c.preview,
    updatedAt: c.updatedAt,
    live: false,
    messages: c.messages.map((m) => ({
      id: m.id,
      role: m.role,
      senderLabel: m.role === 'customer' ? c.clientName : 'AI Agent',
      text: m.text,
      at: m.at,
    })),
  }))
}

function MessagesInner() {
  const params = useSearchParams()
  const { getToken, isSignedIn } = useAuth()
  const initialPlatform = (params.get('platform') as PlatformId | null) || 'all'
  const initialConv = params.get('c')

  const [platform, setPlatform] = useState<'all' | PlatformId>(
    initialPlatform === 'whatsapp' ||
      initialPlatform === 'instagram' ||
      initialPlatform === 'telegram' ||
      initialPlatform === 'messenger'
      ? initialPlatform
      : 'all',
  )
  const [q, setQ] = useState('')
  const [live, setLive] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(initialConv || '')
  const [mobileShowThread, setMobileShowThread] = useState(Boolean(initialConv))

  const tokenFn = useCallback(() => getToken(), [getToken])

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false)
      return
    }
    let cancelled = false
    void (async () => {
      try {
        const rows = await fetchLiveConversations(tokenFn, 'whatsapp')
        if (!cancelled) setLive(rows.map(toThread))
      } catch {
        if (!cancelled) setLive([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    const t = setInterval(() => {
      void fetchLiveConversations(tokenFn, 'whatsapp')
        .then((rows) => setLive(rows.map(toThread)))
        .catch(() => undefined)
    }, 12000)
    return () => {
      cancelled = true
      clearInterval(t)
    }
  }, [isSignedIn, tokenFn])

  const list = useMemo(() => {
    // WhatsApp is live-only — never pad with demo threads
    const otherDemo =
      platform === 'whatsapp'
        ? []
        : demoThreads().filter((d) => d.platformId !== 'whatsapp' && (platform === 'all' || d.platformId === platform))

    const merged =
      platform === 'whatsapp'
        ? live
        : platform === 'all'
          ? [...live, ...otherDemo]
          : otherDemo

    return merged.filter((c) => {
      if (platform !== 'all' && c.platformId !== platform) return false
      if (!q.trim()) return true
      const hay = `${c.clientName} ${c.preview} ${c.messages.map((m) => m.text).join(' ')}`.toLowerCase()
      return hay.includes(q.toLowerCase())
    })
  }, [platform, q, live])

  const selected = list.find((c) => c.id === selectedId) || list[0]

  return (
    <>
      <MotionIn>
        <BiznizTopbar
          title="Messages"
          subtitle="محادثات واتساب الحقيقية + القنوات التجريبية الأخرى."
          showNewAutomation={false}
        />
      </MotionIn>

      <MotionIn delay={40} className="mb-3">
        <p className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100/90">
          واتساب = بيانات حقيقية (من / إلى: اسم المرسل + AI Agent). باقي القنوات demo للعرض.
          {loading ? ' جاري التحميل…' : live.length ? ` · ${live.length} محادثة حية` : ' · لا محادثات واتساب بعد'}
        </p>
      </MotionIn>

      <MotionIn delay={50} className="mb-4 flex flex-wrap gap-1.5">
        {(['all', 'whatsapp', 'instagram', 'telegram', 'messenger'] as const).map((p) => (
          <button
            key={p}
            type="button"
            className={cn('bz-pill', platform === p && 'is-active')}
            onClick={() => setPlatform(p)}
          >
            {p === 'all' ? 'All Apps' : platformLabel(p)}
          </button>
        ))}
      </MotionIn>

      <MotionIn delay={90} className={cn('bz-inbox', mobileShowThread && 'is-thread')}>
        <div className="bz-inbox__list bz-glass">
          <input
            className="bz-inbox__search"
            placeholder="ابحث بالاسم أو الرسالة…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <ul className="flex-1 overflow-y-auto p-2">
            {list.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={cn('bz-msg-row w-full', selected?.id === c.id && 'bg-white/[0.04]')}
                  onClick={() => {
                    setSelectedId(c.id)
                    setMobileShowThread(true)
                  }}
                >
                  <span className="bz-avatar bz-avatar--sm">{c.initials}</span>
                  <div className="min-w-0 flex-1 text-start">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm text-white">{c.clientName}</span>
                      <PlatformIcon id={c.platformId} size={12} />
                      {c.live ? (
                        <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] text-emerald-300">
                          live
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] text-slate-500">
                          demo
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-slate-500">{c.preview}</p>
                  </div>
                  <span className="text-[10px] text-slate-600">{relativeTime(c.updatedAt)}</span>
                </button>
              </li>
            ))}
            {list.length === 0 ? (
              <li className="px-3 py-10 text-center text-sm text-slate-500">لا محادثات.</li>
            ) : null}
          </ul>
        </div>

        <div className="bz-inbox__thread bz-glass flex flex-col">
          {selected ? (
            <>
              <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
                <button
                  type="button"
                  className="bz-inbox__back"
                  onClick={() => setMobileShowThread(false)}
                >
                  رجوع
                </button>
                <span className="bz-avatar">{selected.initials}</span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{selected.clientName}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <PlatformIcon id={selected.platformId} size={12} />
                    {platformLabel(selected.platformId)}
                    {selected.live ? ' · حقيقي' : ' · demo'}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                {selected.messages.map((m, i) => (
                  <div
                    key={m.id}
                    className={cn(
                      'bz-bubble',
                      m.role === 'customer' ? 'bz-bubble--customer' : 'bz-bubble--ai',
                    )}
                    style={{ animationDelay: `${i * 45}ms` }}
                  >
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-wide opacity-70">
                      {m.senderLabel}
                    </p>
                    <p>{m.text}</p>
                    <p className="mt-1 text-[10px] opacity-60">{relativeTime(m.at)}</p>
                  </div>
                ))}
              </div>
              <p className="border-t border-white/8 px-4 py-3 text-[11px] text-slate-500">
                {selected.live
                  ? 'الرد التلقائي من الوكيل يعمل على واتساب مع محاكاة كتابة بشرية قبل الإرسال.'
                  : 'محادثة تجريبية — واتساب الحقيقي يظهر بعد ما توصل رسائل للرقم المرتبط.'}
              </p>
            </>
          ) : (
            <div className="grid flex-1 place-items-center text-sm text-slate-500">
              اختر محادثة
            </div>
          )}
        </div>
      </MotionIn>
    </>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading messages…</p>}>
      <MessagesInner />
    </Suspense>
  )
}
