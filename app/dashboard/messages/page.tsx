'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DEMO_CONVERSATIONS } from '@/lib/bizniz/demo-data'
import { platformLabel } from '@/lib/bizniz/platforms'
import { relativeTime } from '@/lib/bizniz/store'
import type { PlatformId } from '@/lib/bizniz/types'
import { BiznizTopbar } from '@/components/bizniz/shell/topbar'
import { MotionIn } from '@/components/bizniz/motion-in'
import { PlatformIcon } from '@/components/bizniz/platform-icon'
import { cn } from '@/lib/utils'
import { Suspense } from 'react'

function MessagesInner() {
  const params = useSearchParams()
  const initialPlatform = (params.get('platform') as PlatformId | null) || 'all'
  const initialConv = params.get('c')
  const clientFilter = params.get('client')

  const [platform, setPlatform] = useState<'all' | PlatformId>(
    initialPlatform === 'whatsapp' ||
      initialPlatform === 'instagram' ||
      initialPlatform === 'telegram' ||
      initialPlatform === 'messenger'
      ? initialPlatform
      : 'all',
  )
  const [q, setQ] = useState('')
  const [selectedId, setSelectedId] = useState(
    initialConv || DEMO_CONVERSATIONS[0]?.id || '',
  )

  const list = useMemo(() => {
    return DEMO_CONVERSATIONS.filter((c) => {
      if (platform !== 'all' && c.platformId !== platform) return false
      if (clientFilter && c.clientId !== clientFilter) return false
      if (!q.trim()) return true
      const hay = `${c.clientName} ${c.preview} ${c.messages.map((m) => m.text).join(' ')}`.toLowerCase()
      return hay.includes(q.toLowerCase())
    })
  }, [platform, q, clientFilter])

  const selected = list.find((c) => c.id === selectedId) || list[0]

  return (
    <>
      <MotionIn>
        <BiznizTopbar
          title="Messages"
          subtitle="Inspect customer ↔ AI conversations across channels."
          showNewAutomation={false}
        />
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

      <MotionIn delay={90} className="bz-inbox">
        <div className="bz-inbox__list bz-glass">
          <input
            className="bz-inbox__search"
            placeholder="Search name or message…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <ul className="flex-1 overflow-y-auto p-2">
            {list.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={cn('bz-msg-row w-full', selected?.id === c.id && 'bg-white/[0.04]')}
                  onClick={() => setSelectedId(c.id)}
                >
                  <span className="bz-avatar bz-avatar--sm">{c.initials}</span>
                  <div className="min-w-0 flex-1 text-start">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-sm text-white">{c.clientName}</span>
                      <PlatformIcon id={c.platformId} size={12} />
                    </div>
                    <p className="truncate text-xs text-slate-500">{c.preview}</p>
                  </div>
                  <span className="text-[10px] text-slate-600">{relativeTime(c.updatedAt)}</span>
                </button>
              </li>
            ))}
            {list.length === 0 ? (
              <li className="px-3 py-10 text-center text-sm text-slate-500">No conversations found.</li>
            ) : null}
          </ul>
        </div>

        <div className="bz-inbox__thread bz-glass flex flex-col">
          {selected ? (
            <>
              <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
                <span className="bz-avatar">{selected.initials}</span>
                <div>
                  <p className="font-medium text-white">{selected.clientName}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <PlatformIcon id={selected.platformId} size={12} />
                    {platformLabel(selected.platformId)}
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
                    <p>{m.text}</p>
                    <p className="mt-1 text-[10px] opacity-60">{relativeTime(m.at)}</p>
                  </div>
                ))}
              </div>
              <p className="border-t border-white/8 px-4 py-3 text-[11px] text-slate-500">
                Reply sending is not connected — demo read-only thread.
              </p>
            </>
          ) : (
            <div className="grid flex-1 place-items-center text-sm text-slate-500">
              Select a conversation
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
