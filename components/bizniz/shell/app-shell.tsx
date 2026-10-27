'use client'

import { useEffect, type ReactNode } from 'react'
import { BiznizLangProvider, useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { BiznizSidebar } from './sidebar'
import { BiznizMobileWatch } from '@/components/bizniz/mobile-watch'

const THEME_KEY = 'agentication_bizniz_theme'

type Props = {
  userName: string
  companyName?: string
  children: ReactNode
}

function BiznizFrame({ userName, companyName, children }: Props) {
  const { isRtl } = useBiznizLang()
  useEffect(() => {
    const t = localStorage.getItem(THEME_KEY)
    if (t === 'light' || t === 'dark') {
      document.documentElement.dataset.bzTheme = t
    }
  }, [])

  return (
    <div className="bz-shell" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="bz-ambiance" aria-hidden>
          <span className="bz-ambiance__orb bz-ambiance__orb--violet" />
          <span className="bz-ambiance__orb bz-ambiance__orb--cyan" />
          <span className="bz-ambiance__grid" />
        </div>
        <BiznizSidebar userName={userName} companyName={companyName} />
        <div className="bz-main">
          <div className="bz-demo-bar" role="status">
            <span className="bz-demo-bar__pulse" />
            DEMO WORKSPACE — connections & counts are illustrative until live connectors ship.
          </div>
          <div className="bz-main__inner">
            <div className="bz-mobile-only">
              <BiznizMobileWatch />
            </div>
            <div className="bz-desktop-only">{children}</div>
          </div>
        </div>
    </div>
  )
}

export function BiznizAppShell({ userName, companyName, children }: Props) {
  return (
    <BiznizLangProvider>
      <BiznizFrame userName={userName} companyName={companyName}>
        {children}
      </BiznizFrame>
    </BiznizLangProvider>
  )
}
