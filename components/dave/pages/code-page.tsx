'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { BRANCHES, COMMITS, incidentById, projectById, pullById, PULLS, REPOS } from '@/lib/dave/fixtures'
import { formatStamp, includesQuery } from '@/lib/dave/format'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import { Badge, connectionLabel, connectionTone, FixStepper, MissingRecord, Panel, SearchField, StateBlock, TabBar } from '@/components/dave/ui/kit'

type Tab = 'repos' | 'branches' | 'commits' | 'pulls'

export function CodePage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId, projectId } = useDoctorWorkspace()
  const [tab, setTab] = useState<Tab>('pulls')
  const [query, setQuery] = useState('')
  const allow = (id: string) => workspaceId === 'ws_northwind' && (projectId === 'all' || projectId === id)
  const repos = REPOS.filter((repo) => allow(repo.projectId)).filter((repo) => includesQuery(query, [repo.name, repo.provider]))
  const branches = BRANCHES.filter((branch) => allow(branch.projectId)).filter((branch) => includesQuery(query, [branch.name]))
  const commits = COMMITS.filter((commit) => allow(commit.projectId)).filter((commit) => includesQuery(query, [commit.message, commit.sha, commit.author]))
  const pulls = PULLS.filter((pull) => allow(pull.projectId)).filter((pull) => includesQuery(query, [pull.title, pull.purpose, String(pull.number)]))

  return (
    <DoctorPage title={copy.pages.code.title} subtitle={copy.pages.code.sub}>
      <p className="dv-callout dv-callout--violet">Repository data is a sample. No Git host is contacted, and nothing can be merged from this screen.</p>
      <TabBar
        label="Code sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'repos', label: 'Repositories' },
          { id: 'branches', label: 'Branches' },
          { id: 'commits', label: 'Commits' },
          { id: 'pulls', label: 'Pull requests' },
        ]}
      />
      <div className="dv-filters">
        <SearchField value={query} onChange={setQuery} placeholder="Search this tab" />
      </div>
      {workspaceId !== 'ws_northwind' ? <StateBlock title="No repositories" body="Sandbox has no sample repositories." /> : null}
      {workspaceId === 'ws_northwind' && tab === 'repos' ? (
        <div className="dv-grid-cards">
          {repos.map((repo) => (
            <article key={repo.id} className="dv-card dv-glass">
              <h2 className="text-base text-white">{repo.name}</h2>
              <p className="mt-2 text-sm text-slate-400">
                {repo.provider} · {repo.defaultBranch} · {projectById(repo.projectId)?.name}
              </p>
              <p className="mt-2">
                <Badge tone={connectionTone(repo.connection)}>{connectionLabel(repo.connection)}</Badge>
              </p>
              <p className="mt-2 text-sm text-slate-400">CI: {repo.ci}</p>
            </article>
          ))}
        </div>
      ) : null}
      {workspaceId === 'ws_northwind' && tab === 'branches' ? (
        <SimpleList
          empty="No branches match."
          rows={branches.map((branch) => ({
            id: branch.id,
            text: `${branch.name} · ${branch.ahead} ahead · ${branch.protected ? 'protected' : 'unprotected'} · ${formatStamp(branch.updatedAt)}`,
          }))}
        />
      ) : null}
      {workspaceId === 'ws_northwind' && tab === 'commits' ? (
        <SimpleList
          empty="No commits match."
          rows={commits.map((commit) => ({
            id: commit.sha,
            text: `${commit.sha} · ${commit.message} · ${commit.author} · ${commit.branch} · ${formatStamp(commit.at)}`,
          }))}
        />
      ) : null}
      {workspaceId === 'ws_northwind' && tab === 'pulls' ? (
        pulls.length === 0 ? (
          <StateBlock title="No pull requests" body="Nothing in the sample matches." />
        ) : (
          <div className="dv-table-wrap">
            <table className="dv-table">
              <caption>Sample pull requests and whether the related fix was verified.</caption>
              <thead>
                <tr>
                  <th>Pull request</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>CI</th>
                  <th>Incident</th>
                  <th>Fix stage</th>
                </tr>
              </thead>
              <tbody>
                {pulls.map((pull) => (
                  <tr key={pull.id}>
                    <td data-label="Pull request">
                      <Link href={`/dashboard/code/${pull.id}`}>#{pull.number} {pull.title}</Link>
                    </td>
                    <td data-label="Project">{projectById(pull.projectId)?.name}</td>
                    <td data-label="Status">{pull.status}</td>
                    <td data-label="CI">{pull.ci}</td>
                    <td data-label="Incident">{pull.incidentId ? incidentById(pull.incidentId)?.title : '—'}</td>
                    <td data-label="Fix stage">{copy.fix[pull.fixStage]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </DoctorPage>
  )
}

function SimpleList({ rows, empty }: { rows: { id: string; text: string }[]; empty: string }) {
  if (rows.length === 0) return <StateBlock title={empty} body="Try another search." />
  return (
    <ul className="dv-stack">
      {rows.map((row) => (
        <li key={row.id} className="dv-card dv-glass text-sm text-slate-300">
          {row.text}
        </li>
      ))}
    </ul>
  )
}

export function PullDetailPage({ pullId }: { pullId: string }) {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId } = useDoctorWorkspace()
  const pull = pullById(pullId)
  const files = useMemo(() => pull?.files ?? [], [pull])
  if (!pull || workspaceId !== 'ws_northwind') {
    return (
      <DoctorPage title="Pull request" subtitle="Sample record">
        <MissingRecord href="/dashboard/code" label="Back to code" />
      </DoctorPage>
    )
  }
  return (
    <DoctorPage
      title={`#${pull.number} ${pull.title}`}
      subtitle={`${projectById(pull.projectId)?.name} · ${pull.branch} → ${pull.base}`}
      actions={
        <Link href="/dashboard/code" className="dv-btn dv-btn--ghost">
          All pull requests
        </Link>
      }
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge tone="info">{pull.status}</Badge>
        <Badge tone={pull.ci === 'passing' ? 'ok' : pull.ci === 'failing' ? 'bad' : 'warn'}>CI {pull.ci}</Badge>
        <Badge tone="violet">{copy.fix[pull.fixStage]}</Badge>
      </div>
      <FixStepper stage={pull.fixStage} />
      <div className="dv-stack mt-4">
        <Panel title="Intended purpose">
          <p className="dv-prose">{pull.purpose}</p>
        </Panel>
        <Panel title="Related issue">
          {pull.incidentId ? (
            <Link className="dv-link" href={`/dashboard/incidents/${pull.incidentId}`}>
              {incidentById(pull.incidentId)?.title}
            </Link>
          ) : (
            <p className="dv-prose">No incident linked.</p>
          )}
        </Panel>
        <Panel title="Summary of changes">
          <p className="dv-prose">{pull.summary}</p>
          <ul className="mt-2 text-sm text-slate-300">
            {files.map((file) => (
              <li key={file.path}>
                {file.path} · +{file.additions} / −{file.deletions}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Tests performed">
          <ul className="list-disc ps-5 text-sm text-slate-300">
            {pull.tests.map((test) => (
              <li key={test}>{test}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="Potential risks">
          {pull.risks.length === 0 ? <p className="dv-prose">No open risks recorded.</p> : null}
          <ul className="list-disc ps-5 text-sm text-slate-300">
            {pull.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="Review, deploy, verification">
          <dl className="dv-kvs">
            <div>
              <dt>Review</dt>
              <dd>{pull.review}</dd>
            </div>
            <div>
              <dt>Deployment</dt>
              <dd>{pull.deploy}</dd>
            </div>
            <div>
              <dt>Verified afterward</dt>
              <dd>{pull.fixStage === 'verified' ? 'Yes. The incident verification passed.' : 'No. Deploy or merge status is not verification.'}</dd>
            </div>
            <div>
              <dt>Opened</dt>
              <dd>{formatStamp(pull.openedAt)}</dd>
            </div>
          </dl>
        </Panel>
      </div>
    </DoctorPage>
  )
}
