'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bot,
  ChevronDown,
  Home,
  KeyRound,
  Menu,
  MessageSquare,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { BIZNIZ_NAV } from '@/lib/bizniz/customize-copy'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { cn } from '@/lib/utils'

type Props = {
  userName: string
  companyName?: string
}

export function BiznizSidebar({ userName, companyName }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { lang } = useBiznizLang()
  const nav = BIZNIZ_NAV[lang]
  const initial = userName.trim().charAt(0).toUpperCase() || 'U'
  const [logoSrc, setLogoSrc] = useState('/logo.png')

  useEffect(() => {
    // Soften black logo plate on dark sidebar
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

  const NAV = [
    { href: '/dashboard', label: nav.home, icon: Home, exact: true },
    { href: '/dashboard/clients', label: nav.clients, icon: Users },
    { href: '/dashboard/customize', label: nav.customize, icon: SlidersHorizontal },
    { href: '/dashboard/automations', label: nav.automations, icon: Bot },
    { href: '/dashboard/messages', label: nav.messages, icon: MessageSquare },
    { href: '/dashboard/authenticate', label: nav.authenticate, icon: KeyRound },
  ]

  const Nav = (
    <>
      <Link href="/dashboard" className="bz-sidebar__brand" onClick={() => setOpen(false)}>
        <span className="bz-sidebar__mark bz-sidebar__mark--logo">
          <img src={logoSrc} alt="" width={28} height={28} />
        </span>
        <div>
          <p className="bz-sidebar__title">{nav.brandTitle}</p>
          <p className="bz-sidebar__sub">{nav.brandSub}</p>
        </div>
      </Link>

      <nav className="bz-sidebar__nav" aria-label={nav.brandTitle} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('bz-nav-link', active && 'is-active')}
              onClick={() => setOpen(false)}
            >
              <span className="bz-nav-link__icon">
                <Icon size={16} strokeWidth={active ? 2.25 : 1.85} />
              </span>
              <span>{item.label}</span>
              {active ? <span className="bz-nav-link__glow" aria-hidden /> : null}
            </Link>
          )
        })}
      </nav>

      <div className="bz-sidebar__footer">
        <div className="bz-user-chip bz-glass">
          <span className="bz-avatar">{initial}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <p className="truncate text-[11px] text-slate-500">
              {companyName ? `${companyName} · ${nav.owner}` : nav.owner}
            </p>
          </div>
          <ChevronDown size={14} className="text-slate-500" />
        </div>
        <Link href="/" className="bz-back-site" onClick={() => setOpen(false)}>
          {nav.backSite}
        </Link>
      </div>
    </>
  )

  const tabs = [
    { href: '/dashboard', label: nav.home, icon: Home, exact: true },
    { href: '/dashboard/clients', label: nav.clients, icon: Users },
    { href: '/dashboard/messages', label: nav.messages, icon: MessageSquare },
    { href: '/dashboard/authenticate', label: nav.authenticate, icon: KeyRound },
  ]

  return (
    <>
      <header className="bz-mobile-bar">
        <button
          type="button"
          className="bz-mobile-toggle bz-glass"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
        <span className="bz-mobile-bar__title">{nav.brandTitle}</span>
      </header>
      {open ? (
        <button type="button" className="bz-backdrop" aria-label="Close" onClick={() => setOpen(false)} />
      ) : null}
      <aside className={cn('bz-sidebar bz-glass-side', open && 'is-open')}>{Nav}</aside>
      <nav className="bz-tabbar" aria-label={nav.brandTitle}>
        {tabs.map((item) => {
          const active = 'exact' in item && item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className={cn(active && 'is-active')} onClick={() => setOpen(false)}>
              <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
              <span>{item.label}</span>
            </Link>
          )
        })}
        <button type="button" onClick={() => setOpen(true)}>
          <Menu size={18} />
          <span>{lang === 'ar' ? 'المزيد' : 'More'}</span>
        </button>
      </nav>
    </>
  )
}
