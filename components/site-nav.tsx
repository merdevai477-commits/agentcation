'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BookOpen, BriefcaseBusiness, Code2, LayoutDashboard, Layers, Sparkles } from 'lucide-react'
import { UserButton, useAuth } from '@clerk/nextjs'
import { BrandLogo } from '@/components/brand-logo'
import { LiquidGlass } from '@/components/fx/liquid-glass'
import { LangSwitch, useI18n } from '@/components/i18n'

const navIcons = [Layers, Code2, BriefcaseBusiness, Sparkles, BookOpen]

function HeaderAuth({ compact = false }: { compact?: boolean }) {
  const { isLoaded, isSignedIn } = useAuth()
  const { t } = useI18n()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isLoaded) {
    return <div className={compact ? 'h-8 w-28' : 'h-10 w-[140px]'} aria-hidden />
  }

  if (isSignedIn) {
    return (
      <div className={`flex items-center ${compact ? 'gap-1.5' : 'gap-2'}`}>
        <a
          href="/dashboard"
          className={
            compact
              ? 'site-auth-compact__up inline-flex items-center gap-1'
              : 'fx-btn fx-btn--primary site-nav__cta inline-flex items-center gap-1.5'
          }
        >
          <LayoutDashboard size={compact ? 14 : 15} />
          <span>{t.dashboard}</span>
        </a>
        <UserButton />
      </div>
    )
  }

  if (compact) {
    return (
      <div className="site-auth-compact">
        <a href="/sign-in" className="site-auth-compact__in">
          {t.signIn}
        </a>
        <a href="/sign-up" className="site-auth-compact__up">
          {t.getStarted}
        </a>
      </div>
    )
  }

  return (
    <>
      <a href="/sign-in" className="px-3 py-2 text-sm text-slate-400 hover:text-white">
        {t.signIn}
      </a>
      <a href="/sign-up" className="fx-btn fx-btn--primary site-nav__cta">
        <span>{t.getStarted}</span>
        <ArrowRight size={15} />
      </a>
    </>
  )
}

function useScrollChrome(enabled = true) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const idleRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      setHidden(false)
      return
    }

    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 12)

      if (y < 24) {
        setHidden(false)
        if (idleRef.current) window.clearTimeout(idleRef.current)
        return
      }

      setHidden(true)
      if (idleRef.current) window.clearTimeout(idleRef.current)
      idleRef.current = window.setTimeout(() => setHidden(false), 180)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (idleRef.current) window.clearTimeout(idleRef.current)
    }
  }, [enabled])

  return { hidden, scrolled }
}

export function SiteNav() {
  const { t } = useI18n()
  const [active, setActive] = useState('#platform')
  const { hidden, scrolled } = useScrollChrome(true)

  useEffect(() => {
    const ids = t.nav.map((item) => item.href).filter((href) => href.startsWith('#'))
    const onScroll = () => {
      let current = ids[0] ?? '#platform'
      for (const id of ids) {
        const el = document.querySelector(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= 120) current = id
      }
      // Docs is external — keep last section when near footer
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [t.nav])

  return (
    <>
      {/* Desktop + tablet: floating top liquid glass bar */}
      <header
        className={`site-float site-float--desk ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}
      >
        <LiquidGlass className="site-float__bar">
          <BrandLogo />
          <nav className="site-nav flex items-center gap-3 text-sm text-slate-400 xl:gap-5" aria-label="Primary">
            {t.nav.map((item, i) => {
              const Icon = navIcons[i] ?? Sparkles
              return (
                <a key={item.href} href={item.href} className="site-nav__link inline-flex items-center gap-1.5" title={item.label}>
                  <Icon size={14} className="text-sky-400/80" />
                  <span className="site-nav__label">{item.label}</span>
                </a>
              )
            })}
          </nav>
          <div className="flex items-center gap-2">
            <LangSwitch />
            <HeaderAuth />
          </div>
        </LiquidGlass>
      </header>

      {/* Mobile: top = logo + auth only */}
      <header
        className={`site-float site-float--mobile-top ${scrolled ? 'is-scrolled' : ''} ${hidden ? 'is-hidden' : ''}`}
      >
        <LiquidGlass className="site-float__bar site-float__bar--mobile" interactive={false}>
          <BrandLogo />
          <div className="flex items-center gap-2">
            <LangSwitch />
            <HeaderAuth compact />
          </div>
        </LiquidGlass>
      </header>

      {/* Mobile: bottom floating liquid glass nav */}
      <nav
        className={`site-bottom-nav ${hidden ? 'is-hidden' : ''}`}
        aria-label="Mobile sections"
      >
        <LiquidGlass className="site-bottom-nav__bar" interactive={false}>
          {t.nav.map((item, i) => {
            const Icon = navIcons[i] ?? Sparkles
            const isActive = item.href.startsWith('#') ? active === item.href : false
            return (
              <a
                key={item.href}
                href={item.href}
                className={`site-bottom-nav__item ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  if (item.href.startsWith('#')) setActive(item.href)
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </a>
            )
          })}
        </LiquidGlass>
      </nav>
    </>
  )
}
