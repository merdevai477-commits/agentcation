'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import {
  deploymentById,
  incidentById,
  inScope,
  INCIDENTS,
  KNOWLEDGE,
  projectById,
  projectsIn,
  REPOS,
} from '@/lib/dave/fixtures'
import { DEPLOYMENTS, HEALTH_CHECKS, seriesFor } from '@/lib/dave/fixtures/monitoring'
import { formatStamp } from '@/lib/dave/format'
import { sliceSeries } from '@/lib/dave/format'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import {
  Badge,
  ConfirmDialog,
  connectionLabel,
  connectionTone,
  healthTone,
  MissingRecord,
  Panel,
  SampleTag,
  SearchField,
  SelectField,
  SeriesChart,
  StateBlock,
  TabBar,
} from '@/components/dave/ui/kit'

export function ProjectsPage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId, projectId } = useDoctorWorkspace()
  const [query, setQuery] = useState('')
  const [env, setEnv] = useState('all')
  const [connection, setConnection] = useState('all')
  const projects = useMemo(() => {
    return projectsIn(workspaceId)
      .filter((project) => projectId === 'all' || project.id === projectId)
      .filter((project) => env === 'all' || project.environment === env)
      .filter((project) => connection === 'all' || project.connection === connection)
      .filter((project) => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return `${project.name} ${project.description} ${project.repoProvider} ${project.hostProvider}`.toLowerCase().includes(q)
      })
  }, [workspaceId, projectId, env, connection, query])

  return (
    <DoctorPage title={copy.pages.projects.title} subtitle={copy.pages.projects.sub}>
      <div className="dv-filters">
        <SearchField value={query} onChange={setQuery} placeholder="Name, host, repository" />
        <SelectField
          label="Environment"
          value={env}
          onChange={setEnv}
          options={[
            { value: 'all', label: 'All environments' },
            { value: 'production', label: 'Production' },
            { value: 'staging', label: 'Staging' },
            { value: 'preview', label: 'Preview' },
          ]}
        />
        <SelectField
          label="Connection example"
          value={connection}
          onChange={setConnection}
          options={[
            { value: 'all', label: 'Any example state' },
            { value: 'sample-connected', label: 'Example: connected' },
            { value: 'sample-degraded', label: 'Example: degraded' },
            { value: 'sample-disconnected', label: 'Example: disconnected' },
          ]}
        />
      </div>
      {projects.length === 0 ? (
        <StateBlock
          title="No projects match"
          body="Clear the filters, or switch from the empty Sandbox workspace to Northwind Engineering."
          action={
            <Link href="/dashboard/integrations" className="dv-btn dv-btn--ghost">
              View the integration catalog
            </Link>
          }
        />
      ) : (
        <div className="dv-grid-cards">
          {projects.map((project) => {
            const incident = project.latestIncidentId ? incidentById(project.latestIncidentId) : undefined
            const deploy = deploymentById(project.latestDeploymentId)
            return (
              <article key={project.id} className="dv-card dv-glass">
                <div className="dv-card__head">
                  <h2>
                    <Link href={`/dashboard/projects/${project.id}`}>{project.name}</Link>
                  </h2>
                  <SampleTag />
                </div>
                <p className="dv-prose">{project.description}</p>
                <dl className="dv-kvs mt-3">
                  <div>
                    <dt>Repository</dt>
                    <dd>{project.repoProvider}</dd>
                  </div>
                  <div>
                    <dt>Hosting</dt>
                    <dd>{project.hostProvider}</dd>
                  </div>
                  <div>
                    <dt>Environment</dt>
                    <dd>{project.environment}</dd>
                  </div>
                  <div>
                    <dt>Connection</dt>
                    <dd>
                      <Badge tone={connectionTone(project.connection)}>{connectionLabel(project.connection)}</Badge>
                    </dd>
                  </div>
                  <div>
                    <dt>Latest deploy</dt>
                    <dd>
                      {deploy ? `${deploy.id} · ${deploy.status}` : 'None'}
                      {deploy ? <span className="block text-xs text-slate-500">{formatStamp(deploy.finishedAt)}</span> : null}
                    </dd>
                  </div>
                  <div>
                    <dt>Health</dt>
                    <dd>
                      <Badge tone={healthTone(project.health)}>{project.health}</Badge>
                    </dd>
                  </div>
                </dl>
                <p className="mt-3 text-sm text-slate-300">
                  Latest incident:{' '}
                  {incident ? (
                    <Link className="dv-link" href={`/dashboard/incidents/${incident.id}`}>
                      {incident.title}
                    </Link>
                  ) : (
                    'None in the sample'
                  )}
                </p>
              </article>
            )
          })}
        </div>
      )}
    </DoctorPage>
  )
}

type Tab = 'summary' | 'monitoring' | 'incidents' | 'deployments' | 'repository' | 'architecture' | 'settings'

export function ProjectDetailPage({ projectId: id }: { projectId: string }) {
  const { workspaceId, range, pushToast } = useDoctorWorkspace()
  const project = projectById(id)
  const [tab, setTab] = useState<Tab>('summary')
  const [envDefault, setEnvDefault] = useState(project?.environment ?? 'production')
  const [confirm, setConfirm] = useState(false)
  if (!project || project.workspaceId !== workspaceId) {
    return (
      <DoctorPage title="Project" subtitle="Sample record">
        <MissingRecord href="/dashboard/projects" label="Back to projects" />
      </DoctorPage>
    )
  }
  const incident = project.latestIncidentId ? incidentById(project.latestIncidentId) : undefined
  const repo = REPOS.find((item) => item.id === project.repoId)
  const incidents = inScope(INCIDENTS, workspaceId, project.id)
  const deployments = inScope(DEPLOYMENTS, workspaceId, project.id)
  const checks = inScope(HEALTH_CHECKS, workspaceId, project.id)
  const notes = inScope(KNOWLEDGE, workspaceId, project.id)

  return (
    <DoctorPage
      title={project.name}
      subtitle={`${project.repoProvider} · ${project.hostProvider} · ${project.environment}`}
      actions={
        <Link href="/dashboard/projects" className="dv-btn dv-btn--ghost">
          All projects
        </Link>
      }
    >
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge tone={connectionTone(project.connection)}>{connectionLabel(project.connection)}</Badge>
        <Badge tone={healthTone(project.health)}>{project.health}</Badge>
        <SampleTag />
      </div>
      <TabBar
        label="Project sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'summary', label: 'Summary' },
          { id: 'monitoring', label: 'Monitoring' },
          { id: 'incidents', label: 'Incidents' },
          { id: 'deployments', label: 'Deployments' },
          { id: 'repository', label: 'Repository' },
          { id: 'architecture', label: 'Architecture' },
          { id: 'settings', label: 'Settings' },
        ]}
      />
      {tab === 'summary' ? (
        <Panel title="What this project is">
          <p className="dv-prose">{project.description}</p>
          <p className="dv-prose">
            Latest incident:{' '}
            {incident ? <Link className="dv-link" href={`/dashboard/incidents/${incident.id}`}>{incident.title}</Link> : 'none'}
          </p>
        </Panel>
      ) : null}
      {tab === 'monitoring' ? (
        <div className="dv-stack">
          <SeriesChart title="Error rate" unit="%" points={sliceSeries(seriesFor('errors', project.id), range)} />
          <ul className="dv-stack">
            {checks.map((check) => (
              <li key={check.id} className="dv-card dv-glass">
                <strong className="text-white">{check.name}</strong>
                <p className="text-sm text-slate-400">{check.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {tab === 'incidents' ? (
        <ul className="dv-stack">
          {incidents.map((item) => (
            <li key={item.id}>
              <Link href={`/dashboard/incidents/${item.id}`} className="dv-link">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {tab === 'deployments' ? (
        <ul className="dv-stack">
          {deployments.map((item) => (
            <li key={item.id} className="text-sm text-slate-300">
              {item.id} · {item.sha} · {item.status} · {formatStamp(item.finishedAt)}
            </li>
          ))}
        </ul>
      ) : null}
      {tab === 'repository' ? (
        <Panel title={repo?.name ?? 'Repository'}>
          <p className="dv-prose">
            {repo?.provider} · default branch {repo?.defaultBranch}. {connectionLabel(repo?.connection ?? 'sample-disconnected')}.
          </p>
          <Link href="/dashboard/code" className="dv-link">
            Open code & pull requests
          </Link>
        </Panel>
      ) : null}
      {tab === 'architecture' ? (
        <ul className="dv-stack">
          {notes.length === 0 ? <li className="text-sm text-slate-400">No architecture notes in the sample.</li> : null}
          {notes.map((note) => (
            <li key={note.id}>
              <Link className="dv-link" href={`/dashboard/knowledge/${note.id}`}>
                {note.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {tab === 'settings' ? (
        <Panel title="Project defaults">
          <p className="dv-callout dv-callout--info">Saved locally for this session. Nothing is sent to a host.</p>
          <SelectField
            label="Default environment"
            value={envDefault}
            onChange={(value) => setEnvDefault(value as typeof envDefault)}
            options={[
              { value: 'production', label: 'Production' },
              { value: 'staging', label: 'Staging' },
              { value: 'preview', label: 'Preview' },
            ]}
          />
          <button type="button" className="dv-btn dv-btn--primary mt-3" onClick={() => setConfirm(true)}>
            Save defaults
          </button>
          <ConfirmDialog
            open={confirm}
            title="Save project defaults?"
            body="This writes the choice into the browser session only."
            confirmLabel="Save"
            onClose={() => setConfirm(false)}
            onConfirm={() => {
              setConfirm(false)
              pushToast('Project defaults saved in this browser session only.')
            }}
          />
        </Panel>
      ) : null}
    </DoctorPage>
  )
}
