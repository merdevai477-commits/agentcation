'use client'

import Link from 'next/link'
import { Plus, Sparkles } from 'lucide-react'

type Props = {
  title: string
  subtitle?: string
  eyebrow?: string
  showNewAutomation?: boolean
}

export function BiznizTopbar({
  title,
  subtitle,
  eyebrow = 'Dev Bizniz · Live workspace',
  showNewAutomation = true,
}: Props) {
  return (
    <header className="bz-topbar bz-glass">
      <div className="min-w-0">
        <div className="bz-topbar__eyebrow">
          <Sparkles size={11} />
          {eyebrow}
        </div>
        <h1 className="bz-topbar__title">{title}</h1>
        {subtitle ? <p className="bz-topbar__sub">{subtitle}</p> : null}
      </div>
      {showNewAutomation ? (
        <div className="bz-topbar__actions">
          <Link href="/dashboard/automations?new=1" className="bz-btn bz-btn--primary bz-btn--glow">
            <Plus size={15} />
            New Automation
          </Link>
        </div>
      ) : null}
    </header>
  )
}
