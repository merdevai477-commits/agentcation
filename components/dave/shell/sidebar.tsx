'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Bot,
  FileText,
  FolderGit2,
  Gauge,
  GitPullRequest,
  Home,
  Menu,
  Plug,
  Settings,
  Stethoscope,
  X,
} from 'lucide-react'
import { daveCopy } from '@/lib/dave/copy'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { WORKSPACES } from '@/lib/dave/fixtures'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorSelect } from '@/components/dave/ui/kit'
import { AccountMenu } from './menus'
import { cn } from '@/lib/utils'

const GROUPS = [
  {
    id: 'operate',
    items: [
      { href: '/dashboard', key: 'overview', icon: Home },
      { href: '/dashboard/projects', key: 'projects', icon: FolderGit2 },
      { href: '/dashboard/monitoring', key: 'monitoring', icon: Activity },
    ],
  },
  {
    id: 'investigate',
    items: [
      { href: '/dashboard/incidents', key: 'incidents', icon: AlertTriangle },
      { href: '/dashboard/tasks', key: 'tasks', icon: Stethoscope },
      { href: '/dashboard/code', key: 'code', icon: GitPullRequest },
      { href: '/dashboard/reports', key: 'reports', icon: FileText },
    ],
  },
  {
    id: 'system',
    items: [
      { href: '/dashboard/knowledge', key: 'knowledge', icon: BookOpen },
      { href: '/dashboard/integrations', key: 'integrations', icon: Plug },
      { href: '/dashboard/automation', key: 'automation', icon: Bot },
      { href: '/dashboard/usage', key: 'usage', icon: Gauge },
      { href: '/dashboard/preferences', key: 'settings', icon: Settings },
    ],
  },
] as const

export function DaveSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { lang } = useBiznizLang()
  const t = daveCopy(lang)
  const copy = doctorCopy(lang)
  const { workspaceId, setWorkspaceId } = useDoctorWorkspace()
  const [logoSrc, setLogoSrc] = useState('/logo.png')

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const px = frame.data
      for (let i = 0; i < px.length; i += 4) {
        const max = Math.max(px[i], px[i + 1], px[i + 2])
        const min = Math.min(px[i], px[i + 1], px[i + 2])
        if (max < 26) px[i + 3] = 0
        else if (max < 78 && max - min < 22) px[i + 3] = Math.round(((max - 26) / 52) * 255)
      }
      ctx.putImageData(frame, 0, 0)
      setLogoSrc(canvas.toDataURL('image/png'))
    }
    img.src = '/logo.png'
  }, [])

  const Nav = (
    <>
      <Link href="/dashboard" className="dv-sidebar__brand" onClick={() => setOpen(false)}>
        <span className="dv-sidebar__mark">
          <img src={logoSrc} alt="" width={28} height={28} />
        </span>
        <div>
          <p className="dv-sidebar__title">{t.brandTitle}</p>
          <p className="dv-sidebar__sub">{t.brandSub}</p>
        </div>
      </Link>

      <div className="dv-ws">
        <DoctorSelect
          label={copy.workspace}
          value={workspaceId}
          onChange={setWorkspaceId}
          fullWidth
          className="dv-hu-select--ws"
          options={WORKSPACES.map((workspace) => ({ value: workspace.id, label: workspace.name }))}
        />
      </div>

      <nav className="dv-sidebar__nav" aria-label={t.brandTitle}>
        {GROUPS.map((group) => (
          <div key={group.id} className="dv-nav-group">
            <p>{copy.groups[group.id]}</p>
            {group.items.map((item) => {
              const active =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              const label = copy.nav[item.key]
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn('dv-nav-link', active && 'is-active')}
                  aria-current={active ? 'page' : undefined}
                  title={label}
                  onClick={() => setOpen(false)}
                >
                  <span className="dv-nav-link__icon">
                    <Icon size={15} strokeWidth={active ? 2.25 : 1.75} />
                  </span>
                  <span className="dv-nav-link__label">{label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="dv-sidebar__footer">
        <div className="dv-sidebar__quiet">
          <Link href="/dashboard/approvals" onClick={() => setOpen(false)}>
            {copy.links.approvals}
          </Link>
          <Link href="/dashboard/investigate" onClick={() => setOpen(false)}>
            {copy.links.replay}
          </Link>
        </div>
        <AccountMenu compact />
        <Link href="/" className="dv-back-site" onClick={() => setOpen(false)}>
          {t.backSite}
        </Link>
      </div>
    </>
  )

  return (
    <>
      <button
        type="button"
        className="dv-mobile-toggle dv-glass"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      {open ? <button type="button" className="dv-backdrop" aria-label="Close" onClick={() => setOpen(false)} /> : null}
      <aside className={cn('dv-sidebar dv-glass-side', open && 'is-open')}>{Nav}</aside>
    </>
  )
}
