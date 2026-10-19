'use client'

import { useEffect, type ReactNode } from 'react'
import { BiznizLangProvider } from '@/components/bizniz/use-bizniz-lang'
import { BiznizSidebar } from './sidebar'

const THEME_KEY = 'agentication_bizniz_theme'

type Props = {
  userName: string
  companyName?: string
  children: ReactNode
}

export function BiznizAppShell({ userName, companyName, children }: Props) {
  useEffect(() => {
    const t = localStorage.getItem(THEME_KEY)
    if (t === 'light' || t === 'dark') {
      document.documentElement.dataset.bzTheme = t
    }
  }, [])

  return (
    <BiznizLangProvider>
      <div className="bz-shell">
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
          <div className="bz-main__inner">{children}</div>
        </div>
      </div>
    </BiznizLangProvider>
  )
}
