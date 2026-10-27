'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Alert } from '@heroui/react'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { incidentById, INCIDENTS, projectById, pullById, reportById } from '@/lib/dave/fixtures'
import { formatStamp, includesQuery } from '@/lib/dave/format'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import {
  Badge,
  EvidenceTag,
  FixStepper,
  MissingRecord,
  Panel,
  SampleTag,
  SearchField,
  SelectField,
  severityTone,
  StateBlock,
} from '@/components/dave/ui/kit'

export function IncidentsPage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId, projectId } = useDoctorWorkspace()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [severity, setSeverity] = useState('all')
  const rows = useMemo(() => {
    return INCIDENTS.filter((incident) => workspaceId === 'ws_northwind')
      .filter((incident) => projectId === 'all' || incident.projectId === projectId)
      .filter((incident) => status === 'all' || incident.status === status)
      .filter((incident) => severity === 'all' || incident.severity === severity)
      .filter((incident) => includesQuery(query, [incident.title, incident.suspectedCause, incident.step, projectById(incident.projectId)?.name]))
  }, [workspaceId, projectId, status, severity, query])

  return (
    <DoctorPage title={copy.pages.incidents.title} subtitle={copy.pages.incidents.sub}>
      <Alert status="warning">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{lang === 'ar' ? 'التحقق منفصل عن الحالة' : 'Verification is separate from status'}</Alert.Title>
          <Alert.Description>
            Proposed, approved, applied, and verified are different. A pull request or a green deploy leaves the incident open until
            verification passes.
          </Alert.Description>
        </Alert.Content>
      </Alert>
      <div className="dv-filters">
        <SearchField value={query} onChange={setQuery} placeholder="Title, project, cause" />
        <SelectField
          label="Status"
          value={status}
          onChange={setStatus}
          options={[{ value: 'all', label: 'All statuses' }, ...Object.entries(copy.incident).map(([value, label]) => ({ value, label }))]}
        />
        <SelectField
          label="Severity"
          value={severity}
          onChange={setSeverity}
          options={[
            { value: 'all', label: 'All severities' },
            { value: 'critical', label: 'Critical' },
            { value: 'high', label: 'High' },
            { value: 'medium', label: 'Medium' },
            { value: 'low', label: 'Low' },
          ]}
        />
      </div>
      {rows.length === 0 ? (
        <StateBlock title="No incidents" body="No sample incident matches the current workspace, project, or filters." />
      ) : (
        <div className="dv-table-wrap">
          <table className="dv-table">
            <caption>Sample incidents. Verification is shown separately from status.</caption>
            <thead>
              <tr>
                <th>Incident</th>
                <th>Severity</th>
                <th>Project</th>
                <th>Environment</th>
                <th>Status</th>
                <th>Detected</th>
                <th>Investigation</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((incident) => (
                <tr key={incident.id}>
                  <td data-label="Incident">
                    <Link href={`/dashboard/incidents/${incident.id}`}>{incident.title}</Link>
                  </td>
                  <td data-label="Severity">
                    <Badge tone={severityTone(incident.severity)}>{incident.severity}</Badge>
                  </td>
                  <td data-label="Project">{projectById(incident.projectId)?.name}</td>
                  <td data-label="Environment">{incident.environment}</td>
                  <td data-label="Status">{copy.incident[incident.status]}</td>
                  <td data-label="Detected">{formatStamp(incident.detectedAt)}</td>
                  <td data-label="Investigation">{incident.investigation}</td>
                  <td data-label="Verification">{copy.verify[incident.verification]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DoctorPage>
  )
}

const SECTIONS = [
  ['summary', 'Summary'],
  ['timeline', 'Timeline'],
  ['logs', 'Related logs'],
  ['metrics', 'Metrics'],
  ['changes', 'Commits & deploys'],
  ['investigation', 'Investigation'],
  ['cause', 'Suspected cause'],
  ['evidence', 'Evidence'],
  ['fix', 'Remediation'],
  ['pr', 'Pull request'],
  ['verification', 'Verification'],
  ['risks', 'Remaining risks'],
  ['report', 'Report'],
] as const

export function IncidentDetailPage({ incidentId }: { incidentId: string }) {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId } = useDoctorWorkspace()
  const incident = incidentById(incidentId)
  if (!incident || workspaceId !== 'ws_northwind') {
    return (
      <DoctorPage title="Incident" subtitle="Sample record">
        <MissingRecord href="/dashboard/incidents" label="Back to incidents" />
      </DoctorPage>
    )
  }
  const pull = incident.pullRequestId ? pullById(incident.pullRequestId) : undefined
  const report = incident.reportId ? reportById(incident.reportId) : undefined
  const project = projectById(incident.projectId)

  return (
    <DoctorPage
      title={incident.title}
      subtitle={`${project?.name} · ${incident.environment} · ${incident.investigation}`}
      actions={
        <Link href="/dashboard/incidents" className="dv-btn dv-btn--ghost">
          All incidents
        </Link>
      }
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge tone={severityTone(incident.severity)}>{incident.severity}</Badge>
        <Badge tone="info">{copy.incident[incident.status]}</Badge>
        <Badge tone="violet">{copy.fix[incident.fixStage]}</Badge>
        <Badge tone={incident.verification === 'passed' ? 'ok' : incident.verification === 'failed' ? 'bad' : 'warn'}>
          Verification {copy.verify[incident.verification]}
        </Badge>
        <SampleTag />
      </div>
      <nav className="dv-section-nav" aria-label="Incident sections">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <div className="dv-stack">
        <Panel id="summary" title="Summary">
          <p className="dv-prose">{incident.summary}</p>
          <p className="dv-prose">Current step: {incident.step}</p>
        </Panel>
        <Panel id="timeline" title="Incident timeline">
          <ol className="dv-timeline">
            {incident.timeline.map((event) => (
              <li key={event.at + event.title}>
                <time dateTime={event.at}>{formatStamp(event.at)}</time>
                <strong>{event.title}</strong>
                <p>{event.detail}</p>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel id="logs" title="Related logs">
          {incident.logs.length === 0 ? (
            <p className="dv-prose">No sample logs were collected. The project connection may be an example disconnected state.</p>
          ) : (
            <ul className="dv-stack">
              {incident.logs.map((line) => (
                <li key={line.traceId} className="text-sm text-slate-300">
                  <Badge tone={line.severity === 'ERROR' ? 'bad' : 'warn'}>{line.severity}</Badge> {formatStamp(line.at)} · {line.service} · {line.message} · {line.traceId}
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel id="metrics" title="Relevant metrics">
          {incident.metrics.length === 0 ? <p className="dv-prose">No metric sample attached.</p> : null}
          <dl className="dv-kvs">
            {incident.metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>
                  {metric.value}
                  <span className="mt-1 block text-xs text-slate-500">{metric.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Panel>
        <Panel id="changes" title="Related commits and deployments">
          <ul className="dv-stack">
            {incident.commits.map((commit) => (
              <li key={commit.sha} className="text-sm text-slate-300">
                {commit.sha} · {commit.message}
              </li>
            ))}
            {incident.deployments.map((deploy) => (
              <li key={deploy.id} className="text-sm text-slate-300">
                {deploy.id} · {deploy.status} · {formatStamp(deploy.at)} — {deploy.note}
              </li>
            ))}
            {incident.commits.length === 0 && incident.deployments.length === 0 ? <li className="dv-prose">None linked.</li> : null}
          </ul>
        </Panel>
        <Panel id="investigation" title="AI investigation status">
          <p className="dv-prose">{incident.investigation}</p>
          <p className="dv-prose">Confidence {incident.confidence}% on a {incident.causeKind} cause. Confidence is not proof.</p>
          <div className="dv-meter mt-3">
            <div>
              <span>Confidence</span>
              <span>{incident.confidence}%</span>
            </div>
            <div className="dv-meter__track" role="meter" aria-valuenow={incident.confidence} aria-valuemin={0} aria-valuemax={100} aria-label="Confidence">
              <span style={{ width: `${incident.confidence}%` }} />
            </div>
          </div>
        </Panel>
        <Panel id="cause" title="Suspected root cause">
          <p className="mb-2">
            <EvidenceTag kind={incident.causeKind} />
          </p>
          <p className="dv-prose">{incident.suspectedCause}</p>
        </Panel>
        <Panel id="evidence" title="Evidence">
          <ul className="dv-stack">
            {incident.evidence.map((item) => (
              <li key={item.text}>
                <EvidenceTag kind={item.kind} /> <span className="text-sm text-slate-200">{item.source}</span>
                <p className="dv-prose">{item.text}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel id="fix" title="Recommended remediation">
          <FixStepper stage={incident.fixStage} />
          <p className="dv-prose mt-3">{incident.remediation}</p>
        </Panel>
        <Panel id="pr" title="Related pull request">
          {pull ? (
            <>
              <p className="dv-prose">
                <Link className="dv-link" href={`/dashboard/code/${pull.id}`}>
                  PR #{pull.number} · {pull.title}
                </Link>
              </p>
              <p className="dv-prose">
                Review: {pull.review}. Deploy: {pull.deploy}. Fix stage: {copy.fix[pull.fixStage]}.
              </p>
            </>
          ) : (
            <p className="dv-prose">No pull request has been prepared.</p>
          )}
        </Panel>
        <Panel id="verification" title="Verification results">
          <p className="dv-callout dv-callout--info">{incident.verificationDetail}</p>
        </Panel>
        <Panel id="risks" title="Remaining risks">
          {incident.risks.length === 0 ? <p className="dv-prose">No remaining risks were recorded after verification.</p> : null}
          <ul className="list-disc ps-5 text-sm text-slate-300">
            {incident.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </Panel>
        <Panel id="report" title="Final report">
          {report ? (
            <Link className="dv-link" href={`/dashboard/reports/${report.id}`}>
              {report.title}
            </Link>
          ) : (
            <p className="dv-prose">No report has been filed for this incident yet.</p>
          )}
        </Panel>
      </div>
    </DoctorPage>
  )
}
