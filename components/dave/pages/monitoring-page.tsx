'use client'

import { useMemo, useState } from 'react'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { projectById } from '@/lib/dave/fixtures'
import { DEPLOYMENTS, HEALTH_CHECKS, LOGS, seriesFor } from '@/lib/dave/fixtures/monitoring'
import { formatStamp, includesQuery, sliceSeries } from '@/lib/dave/format'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import { Badge, healthTone, Panel, SampleTag, SearchField, SelectField, SeriesChart, StateBlock, TabBar } from '@/components/dave/ui/kit'

type Tab = 'logs' | 'metrics' | 'deployments' | 'health'

export function MonitoringPage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId, projectId, range } = useDoctorWorkspace()
  const [tab, setTab] = useState<Tab>('logs')
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState('all')
  const [envFilter, setEnvFilter] = useState('all')

  const allowed = useMemo(() => {
    return new Set(
      (projectId === 'all'
        ? ['prj_checkout', 'prj_auth', 'prj_billing', 'prj_docs']
        : [projectId]
      ).filter((id) => workspaceId === 'ws_northwind'),
    )
  }, [workspaceId, projectId])

  const logs = LOGS.filter((line) => allowed.has(line.projectId))
    .filter((line) => severity === 'all' || line.severity === severity)
    .filter((line) => envFilter === 'all' || line.environment === envFilter)
    .filter((line) => includesQuery(query, [line.message, line.service, line.traceId, line.severity]))

  const deployments = DEPLOYMENTS.filter((item) => allowed.has(item.projectId))
  const checks = HEALTH_CHECKS.filter((item) => allowed.has(item.projectId))
  const chartProject = projectId === 'all' ? 'all' : projectId

  return (
    <DoctorPage title={copy.pages.monitoring.title} subtitle={copy.pages.monitoring.sub}>
      <p className="dv-callout dv-callout--violet">
        <SampleTag /> Monitoring connection is an example. These rows are fixtures, not a live tail.
      </p>
      <TabBar
        label="Monitoring sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'logs', label: 'Logs' },
          { id: 'metrics', label: 'Metrics' },
          { id: 'deployments', label: 'Deployments' },
          { id: 'health', label: 'Health checks' },
        ]}
      />
      {allowed.size === 0 ? (
        <StateBlock title="Nothing to monitor" body="The sandbox workspace has no sample collector and no projects." />
      ) : null}
      {allowed.size > 0 && tab === 'logs' ? (
        <>
          <div className="dv-filters">
            <SearchField value={query} onChange={setQuery} placeholder="Message, service, trace" />
            <SelectField
              label="Severity"
              value={severity}
              onChange={setSeverity}
              options={['all', 'ERROR', 'WARN', 'INFO', 'DEBUG'].map((item) => ({ value: item, label: item === 'all' ? 'All severities' : item }))}
            />
            <SelectField
              label="Environment"
              value={envFilter}
              onChange={setEnvFilter}
              options={[
                { value: 'all', label: 'All environments' },
                { value: 'production', label: 'Production' },
                { value: 'staging', label: 'Staging' },
                { value: 'preview', label: 'Preview' },
              ]}
            />
          </div>
          {logs.length === 0 ? (
            <StateBlock title="No log lines" body="Nothing in the sample matches this search or severity." />
          ) : (
            <div className="dv-table-wrap">
              <table className="dv-table">
                <caption>Sample log lines for the selected project and range filters.</caption>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Severity</th>
                    <th>Service</th>
                    <th>Environment</th>
                    <th>Message</th>
                    <th>Trace</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((line) => (
                    <tr key={line.id}>
                      <td data-label="Time">{formatStamp(line.at)}</td>
                      <td data-label="Severity">
                        <Badge tone={line.severity === 'ERROR' ? 'bad' : line.severity === 'WARN' ? 'warn' : 'neutral'}>{line.severity}</Badge>
                      </td>
                      <td data-label="Service">{line.service}</td>
                      <td data-label="Environment">{line.environment}</td>
                      <td data-label="Message">{line.message}</td>
                      <td data-label="Trace">{line.traceId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
      {allowed.size > 0 && tab === 'metrics' ? (
        <div className="dv-grid-cards">
          {(['cpu', 'memory', 'latency', 'errors', 'availability'] as const).map((metric) => {
            const meta = { cpu: ['CPU', '%'], memory: ['Memory RSS', ' MB'], latency: ['Request latency', ' ms'], errors: ['Error rate', '%'], availability: ['Availability', '%'] }[metric]
            return (
              <SeriesChart
                key={metric}
                title={meta[0]}
                unit={meta[1]}
                points={sliceSeries(seriesFor(metric, chartProject), range)}
              />
            )
          })}
        </div>
      ) : null}
      {allowed.size > 0 && tab === 'deployments' ? (
        <div className="dv-table-wrap">
          <table className="dv-table">
            <caption>Sample deployments. A succeeded deploy is not a verified fix.</caption>
            <thead>
              <tr>
                <th>Deployment</th>
                <th>Commit</th>
                <th>Branch</th>
                <th>Environment</th>
                <th>Started</th>
                <th>Finished</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((item) => (
                <tr key={item.id}>
                  <td data-label="Deployment">{item.id}</td>
                  <td data-label="Commit">{item.sha}</td>
                  <td data-label="Branch">{item.branch}</td>
                  <td data-label="Environment">{item.environment}</td>
                  <td data-label="Started">{formatStamp(item.startedAt)}</td>
                  <td data-label="Finished">{formatStamp(item.finishedAt)}</td>
                  <td data-label="Status">
                    <Badge tone={healthTone(item.status)}>{item.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {allowed.size > 0 && tab === 'health' ? (
        <div className="dv-stack">
          {checks.map((check) => (
            <Panel key={check.id} title={check.name} action={<Badge tone={healthTone(check.status)}>{check.status}</Badge>}>
              <p className="dv-prose">
                {projectById(check.projectId)?.name} · last check {formatStamp(check.checkedAt)}
              </p>
              <p className="dv-prose">{check.reason}</p>
              <div className="dv-dots mt-3" aria-label="Sample status history, oldest to newest">
                {check.history.map((point, index) => (
                  <i key={`${check.id}-${index}`} className={point} title={point} />
                ))}
              </div>
            </Panel>
          ))}
        </div>
      ) : null}
    </DoctorPage>
  )
}
