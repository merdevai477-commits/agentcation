'use client'

import Link from 'next/link'
import { useEffect, type ReactNode } from 'react'
import { Languages, Stethoscope } from 'lucide-react'
import { Button } from '@heroui/react'
import { daveCopy } from '@/lib/dave/copy'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { projectsIn } from '@/lib/dave/fixtures'
import type { TimeRange } from '@/lib/dave/fixtures'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorSelect } from '@/components/dave/ui/kit'
import { NotificationButton } from './menus'

type Props = {
  title: string
  subtitle?: string
  showInvestigate?: boolean
  extra?: ReactNode
}

const RANGES: TimeRange[] = ['1h', '6h', '24h', '7d', '30d']

export function DaveTopbar({ title, subtitle, showInvestigate = true, extra }: Props) {
  const { lang, toggle } = useBiznizLang()
  const t = daveCopy(lang)
  const copy = doctorCopy(lang)
  const { workspaceId, projectId, setProjectId, range, setRange } = useDoctorWorkspace()
  const projects = projectsIn(workspaceId)
  const selected = projects.some((project) => project.id === projectId) ? projectId : 'all'

  useEffect(() => {
    if (projectId !== 'all' && !projects.some((project) => project.id === projectId)) {
      setProjectId('all')
    }
  }, [projectId, projects, setProjectId])

  return (
    <header className="dv-topbar">
      <div className="min-w-0">
        <div className="dv-topbar__eyebrow">
          <Stethoscope size={11} />
          {t.eyebrow}
        </div>
        <h1 className="dv-topbar__title">{title}</h1>
        {subtitle ? <p className="dv-topbar__sub">{subtitle}</p> : null}
      </div>
      <div className="dv-toolbar" role="toolbar" aria-label={copy.project}>
        <DoctorSelect
          label={copy.project}
          value={selected}
          onChange={setProjectId}
          className="dv-hu-select--toolbar"
          options={[
            { value: 'all', label: copy.projectAll },
            ...projects.map((project) => ({ value: project.id, label: project.name })),
          ]}
        />
        <DoctorSelect
          label={copy.rangeLabel}
          value={range}
          onChange={(next) => setRange(next as TimeRange)}
          className="dv-hu-select--toolbar dv-hu-select--range"
          options={RANGES.map((item) => ({ value: item, label: copy.range[item] }))}
        />
        {extra}
        <Button variant="secondary" size="sm" onPress={toggle}>
          <Languages size={14} />
          {t.langToggle}
        </Button>
        <NotificationButton />
        {showInvestigate ? (
          <Link href="/dashboard/investigate" className="dv-btn dv-btn--primary">
            <Stethoscope size={15} />
            {t.navInvestigate}
          </Link>
        ) : null}
      </div>
    </header>
  )
}
