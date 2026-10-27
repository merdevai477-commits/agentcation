'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { knowledgeById, KNOWLEDGE, projectById } from '@/lib/dave/fixtures'
import { formatDay, includesQuery } from '@/lib/dave/format'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import { Badge, MissingRecord, Panel, SearchField, SelectField, StateBlock } from '@/components/dave/ui/kit'

export function KnowledgePage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId, projectId } = useDoctorWorkspace()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const rows = useMemo(() => {
    return KNOWLEDGE.filter(() => workspaceId === 'ws_northwind')
      .filter((entry) => projectId === 'all' || entry.projectId === projectId)
      .filter((entry) => category === 'all' || entry.category === category)
      .filter((entry) => includesQuery(query, [entry.title, entry.summary, entry.source]))
  }, [workspaceId, projectId, query, category])

  return (
    <DoctorPage title={copy.pages.knowledge.title} subtitle={copy.pages.knowledge.sub}>
      <div className="dv-filters">
        <SearchField value={query} onChange={setQuery} placeholder="Title, source, summary" />
        <SelectField
          label="Category"
          value={category}
          onChange={setCategory}
          options={[{ value: 'all', label: 'All categories' }, ...Object.entries(copy.knowledge).map(([value, label]) => ({ value, label }))]}
        />
      </div>
      {rows.length === 0 ? (
        <StateBlock title="No knowledge entries" body="No sample note matches. The knowledge engine itself is not running." />
      ) : (
        <div className="dv-table-wrap">
          <table className="dv-table">
            <caption>Sample project knowledge. Version history is on the detail page.</caption>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Project</th>
                <th>Source</th>
                <th>Updated</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((entry) => (
                <tr key={entry.id}>
                  <td data-label="Title">
                    <Link href={`/dashboard/knowledge/${entry.id}`}>{entry.title}</Link>
                  </td>
                  <td data-label="Category">{copy.knowledge[entry.category]}</td>
                  <td data-label="Project">{projectById(entry.projectId)?.name}</td>
                  <td data-label="Source">{entry.source}</td>
                  <td data-label="Updated">{formatDay(entry.updatedAt)}</td>
                  <td data-label="Verification">
                    <Badge tone={entry.verification === 'passed' ? 'ok' : entry.verification === 'pending' ? 'warn' : 'neutral'}>
                      {copy.verify[entry.verification]}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DoctorPage>
  )
}

export function KnowledgeDetailPage({ entryId }: { entryId: string }) {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId } = useDoctorWorkspace()
  const entry = knowledgeById(entryId)
  if (!entry || workspaceId !== 'ws_northwind') {
    return (
      <DoctorPage title="Knowledge" subtitle="Sample record">
        <MissingRecord href="/dashboard/knowledge" label="Back to knowledge" />
      </DoctorPage>
    )
  }
  return (
    <DoctorPage
      title={entry.title}
      subtitle={`${copy.knowledge[entry.category]} · ${projectById(entry.projectId)?.name}`}
      actions={
        <Link href="/dashboard/knowledge" className="dv-btn dv-btn--ghost">
          All entries
        </Link>
      }
    >
      <div className="dv-stack">
        <Panel title="Summary">
          <p className="dv-prose">{entry.summary}</p>
          <p className="mt-2 text-xs text-slate-500">
            Source {entry.source} · updated {formatDay(entry.updatedAt)} · {copy.verify[entry.verification]}
          </p>
        </Panel>
        <Panel title="Detail">
          {entry.body.map((paragraph) => (
            <p key={paragraph} className="dv-prose">
              {paragraph}
            </p>
          ))}
        </Panel>
        <Panel title="Version history">
          <p className="dv-prose mb-3">Sample history only. Editing a version is not implemented.</p>
          <ol className="dv-timeline">
            {entry.history.map((version) => (
              <li key={version.at}>
                <time dateTime={version.at}>{formatDay(version.at)}</time>
                <strong>{version.author}</strong>
                <p>{version.note}</p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </DoctorPage>
  )
}
