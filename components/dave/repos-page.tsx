'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GitBranch, Plus } from 'lucide-react'
import { daveCopy } from '@/lib/dave/copy'
import { DEMO_REPOS, relativeDaveTime } from '@/lib/dave/demo-data'
import { MotionIn } from '@/components/bizniz/motion-in'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { DaveTopbar } from './shell/topbar'
import { cn } from '@/lib/utils'

export function DaveReposPage() {
  const { lang, isRtl } = useBiznizLang()
  const t = daveCopy(lang)
  const [repos, setRepos] = useState(DEMO_REPOS)
  const [toast, setToast] = useState('')

  function toggle(id: string) {
    setRepos((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              connected: !r.connected,
              lastScanAt: !r.connected ? new Date().toISOString() : r.lastScanAt,
            }
          : r,
      ),
    )
    setToast(t.demoHint)
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <MotionIn>
        <DaveTopbar title={t.reposTitle} subtitle={t.reposSub} showInvestigate={false} />
      </MotionIn>

      <MotionIn delay={30}>
        <p className="dv-banner mb-4">
          {t.demoHint}{' '}
          <Link href="/dashboard/code" className="dv-link">
            Open Code & Pull Requests
          </Link>
        </p>
      </MotionIn>

      {toast ? (
        <p className="mb-4 rounded-xl border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
          {toast}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {repos.map((repo, i) => (
          <MotionIn key={repo.id} as="article" className="dv-card dv-glass" delay={50 + i * 45}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="dv-stat__icon dv-stat__icon--sky">
                  <GitBranch size={18} />
                </span>
                <div>
                  <h2 className="font-medium text-white">{repo.name}</h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {repo.provider} · {repo.branch}
                  </p>
                  <p
                    className={cn(
                      'mt-1.5 text-xs',
                      repo.connected ? 'text-emerald-400' : 'text-slate-500',
                    )}
                  >
                    {repo.connected ? t.connected : t.notConnected}
                    {repo.connected && repo.lastScanAt
                      ? ` · ${t.lastScan} ${relativeDaveTime(repo.lastScanAt)}`
                      : ''}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className={cn(
                  'dv-btn',
                  repo.connected ? 'dv-btn--ghost' : 'dv-btn--primary dv-btn--glow',
                )}
                onClick={() => toggle(repo.id)}
              >
                {repo.connected ? (
                  lang === 'ar' ? 'فصل' : 'Disconnect'
                ) : (
                  <>
                    <Plus size={14} /> {t.connectRepo}
                  </>
                )}
              </button>
            </div>
          </MotionIn>
        ))}
      </div>
    </div>
  )
}
