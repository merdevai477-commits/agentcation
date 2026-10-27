'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { projectById, reportById, REPORTS } from '@/lib/dave/fixtures'
import { formatStamp, includesQuery } from '@/lib/dave/format'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import { Badge, EvidenceTag, MissingRecord, Panel, SearchField, SelectField, StateBlock } from '@/components/dave/ui/kit'

export function ReportsPage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId, projectId } = useDoctorWorkspace()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const rows = useMemo(() => {
    return REPORTS.filter(() => workspaceId === 'ws_northwind')
      .filter((report) => projectId === 'all' || report.projectId === projectId)
      .filter((report) => category === 'all' || report.category === category)
      .filter((report) => includesQuery(query, [report.title, report.executive, projectById(report.projectId)?.name]))
  }, [workspaceId, projectId, query, category])

  return (
    <DoctorPage title={copy.pages.reports.title} subtitle={copy.pages.reports.sub}>
      <div className="dv-filters">
        <SearchField value={query} onChange={setQuery} placeholder="Title or finding" />
        <SelectField
          label="Category"
          value={category}
          onChange={setCategory}
          options={[{ value: 'all', label: 'All categories' }, ...Object.entries(copy.report).map(([value, label]) => ({ value, label }))]}
        />
      </div>
      {rows.length === 0 ? (
        <StateBlock title="No reports" body="No sample report matches this filter." />
      ) : (
        <div className="dv-grid-cards">
          {rows.map((report) => (
            <article key={report.id} className="dv-card dv-glass">
              <Badge tone="violet">{copy.report[report.category]}</Badge>
              <h2 className="mt-2 text-base text-white">
                <Link href={`/dashboard/reports/${report.id}`}>{report.title}</Link>
              </h2>
              <p className="mt-2 text-sm text-slate-400">{report.executive}</p>
              <p className="mt-3 text-xs text-slate-500">
                {projectById(report.projectId)?.name} · {formatStamp(report.updatedAt)}
              </p>
            </article>
          ))}
        </div>
      )}
    </DoctorPage>
  )
}

export function ReportDetailPage({ reportId }: { reportId: string }) {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId } = useDoctorWorkspace()
  const report = reportById(reportId)
  if (!report || workspaceId !== 'ws_northwind') {
    return (
      <DoctorPage title="Report" subtitle="Sample record">
        <MissingRecord href="/dashboard/reports" label="Back to reports" />
      </DoctorPage>
    )
  }
  return (
    <DoctorPage
      title={report.title}
      subtitle={copy.report[report.category]}
      actions={
        <Link href="/dashboard/reports" className="dv-btn dv-btn--ghost">
          All reports
        </Link>
      }
    >
      <div className="dv-stack">
        <Panel title="Executive summary">
          <p className="dv-prose">{report.executive}</p>
        </Panel>
        <Panel title="Project and environment">
          <p className="dv-prose">
            {projectById(report.projectId)?.name} · {report.environment}
          </p>
        </Panel>
        <Panel title="Time range">
          <p className="dv-prose">{report.rangeLabel}</p>
          <p className="text-xs text-slate-500">Updated {formatStamp(report.updatedAt)}</p>
        </Panel>
        <Panel title="Evidence sources">
          <ul className="dv-stack">
            {report.sources.map((source) => (
              <li key={source.name}>
                <EvidenceTag kind={source.kind} /> <span className="text-sm text-slate-200">{source.name}</span>
                <p className="dv-prose">{source.detail}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Findings">
          <ul className="dv-stack">
            {report.findings.map((finding) => (
              <li key={finding.text}>
                <EvidenceTag kind={finding.kind} /> <span className="text-sm text-slate-300">{finding.text}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Suspected root cause">
          <p className="mb-2">
            <EvidenceTag kind={report.cause.kind} />
          </p>
          <p className="dv-prose">{report.cause.text}</p>
        </Panel>
        <Panel title="Recommended or applied fix">
          <p className="dv-prose">{report.fix}</p>
        </Panel>
        <Panel title="Verification outcome">
          <p className="dv-prose">{report.verification}</p>
        </Panel>
        <Panel title="Remaining risks">
          {report.risks.length === 0 ? <p className="dv-prose">None recorded.</p> : null}
          <ul className="list-disc ps-5 text-sm text-slate-300">
            {report.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
          {report.incidentId ? (
            <Link className="dv-link mt-3 inline-block" href={`/dashboard/incidents/${report.incidentId}`}>
              Open the incident
            </Link>
          ) : null}
        </Panel>
      </div>
    </DoctorPage>
  )
}
