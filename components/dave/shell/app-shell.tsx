'use client'

import type { ReactNode } from 'react'
import { BiznizLangProvider } from '@/components/bizniz/use-bizniz-lang'
import { daveCopy } from '@/lib/dave/copy'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { DoctorWorkspaceProvider } from '@/components/dave/workspace-context'
import { DaveSidebar } from './sidebar'
import { DaveMobileWatch } from '@/components/dave/mobile-watch'

type Props = {
  userName: string
  companyName?: string
  children: ReactNode
}

function DemoBar() {
  const { lang } = useBiznizLang()
  const t = daveCopy(lang)
  return (
    <div className="dv-demo-bar" role="status">
      <span className="dv-demo-bar__pulse" />
      {t.demoBar}
    </div>
  )
}

function ShellFrame({ children }: { children: ReactNode }) {
  const { isRtl } = useBiznizLang()
  return (
    <div className="dv-shell dark" data-theme="dark" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="dv-ambiance" aria-hidden>
        <span className="dv-ambiance__orb dv-ambiance__orb--cyan" />
        <span className="dv-ambiance__orb dv-ambiance__orb--violet" />
        <span className="dv-ambiance__orb dv-ambiance__orb--deep" />
        <span className="dv-ambiance__grid" />
      </div>
      {children}
    </div>
  )
}

export function DaveAppShell({ userName, companyName, children }: Props) {
  return (
    <BiznizLangProvider>
      <DoctorWorkspaceProvider userName={userName} companyName={companyName}>
        <ShellFrame>
          <DaveSidebar />
          <div className="dv-main">
            <DemoBar />
            <div className="dv-main__inner">
              <div className="dv-mobile-only">
                <DaveMobileWatch />
              </div>
              <div className="dv-desktop-only">{children}</div>
            </div>
          </div>
        </ShellFrame>
      </DoctorWorkspaceProvider>
    </BiznizLangProvider>
  )
}
