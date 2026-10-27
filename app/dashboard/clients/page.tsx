'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { DEMO_CLIENTS } from '@/lib/bizniz/demo-data'
import { platformLabel } from '@/lib/bizniz/platforms'
import { relativeTime } from '@/lib/bizniz/store'
import type { PlatformId } from '@/lib/bizniz/types'
import { BiznizTopbar } from '@/components/bizniz/shell/topbar'
import { MotionIn } from '@/components/bizniz/motion-in'
import { PlatformIcon } from '@/components/bizniz/platform-icon'
import { cn } from '@/lib/utils'

export default function ClientsPage() {
  const [platform, setPlatform] = useState<'all' | PlatformId>('all')
  const [q, setQ] = useState('')

  const clients = useMemo(() => {
    return DEMO_CLIENTS.filter((c) => {
      const matchPlatform = platform === 'all' || c.platforms.includes(platform)
      const matchQ =
        !q.trim() ||
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.lastPreview.toLowerCase().includes(q.toLowerCase())
      return matchPlatform && matchQ
    })
  }, [platform, q])

  return (
    <>
      <MotionIn>
        <BiznizTopbar
          title="Clients"
          subtitle="Unique contacts across connected channels (demo)."
          showNewAutomation={false}
        />
      </MotionIn>

      <MotionIn delay={60} className="mb-4 flex flex-wrap items-center gap-2">
        <input
          className="bz-search"
          placeholder="Search clients…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
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

      <MotionIn as="section" className="bz-card bz-glass overflow-x-auto" delay={100}>
        <table className="bz-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Platforms</th>
              <th>Last message</th>
              <th>When</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td data-label="Client">
                  <div className="flex items-center gap-2">
                    <span className="bz-avatar bz-avatar--sm">{c.initials}</span>
                    <span className="text-white">{c.name}</span>
                  </div>
                </td>
                <td data-label="Platforms">
                  <div className="flex items-center gap-1.5">
                    {c.platforms.map((p) => (
                      <PlatformIcon key={p} id={p} size={14} />
                    ))}
                  </div>
                </td>
                <td data-label="Last message" className="text-slate-400">{c.lastPreview}</td>
                <td data-label="When" className="text-slate-500">{relativeTime(c.lastMessageAt)}</td>
                <td data-label="">
                  <Link href={`/dashboard/messages?client=${c.id}`} className="bz-link">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {clients.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-slate-500">No clients match this filter.</p>
        ) : null}
      </MotionIn>
    </>
  )
}
