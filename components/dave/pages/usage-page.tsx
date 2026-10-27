'use client'

import { doctorCopy } from '@/lib/dave/doctor-copy'
import { projectById } from '@/lib/dave/fixtures'
import { USAGE_BY_PROJECT, USAGE_BY_TYPE, USAGE_OVER_TIME, USAGE_TOTALS } from '@/lib/dave/fixtures/usage'
import { sampleUsd } from '@/lib/dave/format'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import { Meter, Panel, SampleTag, SeriesChart, StateBlock } from '@/components/dave/ui/kit'

export function UsagePage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId, projectId } = useDoctorWorkspace()
  const projects = USAGE_BY_PROJECT.filter((row) => workspaceId === 'ws_northwind' && (projectId === 'all' || row.projectId === projectId))
  const maxTokens = Math.max(...USAGE_BY_TYPE.map((row) => row.tokens))

  return (
    <DoctorPage title={copy.pages.usage.title} subtitle={copy.pages.usage.sub}>
      <p className="dv-callout dv-callout--warn">
        <SampleTag /> Every amount on this page is a sample estimate. It is not usage from a model provider and it is not a billed charge.
      </p>
      {workspaceId !== 'ws_northwind' ? (
        <StateBlock title="No sample usage" body="The sandbox workspace has no estimated activity." />
      ) : (
        <div className="dv-stack">
          <div className="dv-stats">
            {[
              ['Investigations', String(USAGE_TOTALS.investigations)],
              ['Task executions', String(USAGE_TOTALS.taskRuns)],
              ['Input tokens', USAGE_TOTALS.inputTokens.toLocaleString('en-US')],
              ['Output tokens', USAGE_TOTALS.outputTokens.toLocaleString('en-US')],
            ].map(([label, value]) => (
              <article key={label} className="dv-card dv-glass dv-stat">
                <div>
                  <p className="dv-stat__n">{value}</p>
                  <p className="dv-stat__l">{label}</p>
                </div>
              </article>
            ))}
          </div>
          <Panel title="Estimated AI cost">
            <p className="dv-stat__n">{sampleUsd(USAGE_TOTALS.sampleCost)}</p>
            <p className="dv-prose mt-2">
              Sample ceiling {sampleUsd(USAGE_TOTALS.limitCost)}. This number is not an invoice, a balance, or a payment due.
            </p>
          </Panel>
          <div className="dv-home-grid">
            <Panel title="Usage by project" className="dv-span-6">
              <div className="dv-table-wrap">
                <table className="dv-table">
                  <caption>Sample split. Not billing dimensions.</caption>
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Investigations</th>
                      <th>Tokens</th>
                      <th>Sample estimate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((row) => (
                      <tr key={row.projectId}>
                        <td data-label="Project">{projectById(row.projectId)?.name}</td>
                        <td data-label="Investigations">{row.investigations}</td>
                        <td data-label="Tokens">{row.tokens.toLocaleString('en-US')}</td>
                        <td data-label="Estimate">{sampleUsd(row.sampleCost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
            <Panel title="Usage by task type" className="dv-span-6">
              <div className="dv-stack">
                {USAGE_BY_TYPE.map((row) => (
                  <Meter key={row.type} label={`${copy.taskType[row.type as keyof typeof copy.taskType]} · ${row.runs} runs`} value={row.tokens} max={maxTokens} />
                ))}
              </div>
            </Panel>
          </div>
          <SeriesChart title="Sample token volume over time" unit="k" points={USAGE_OVER_TIME} />
          <Panel title="Configured limits">
            <dl className="dv-kvs">
              <div>
                <dt>Investigation cap</dt>
                <dd>{USAGE_TOTALS.limitInvestigations} sample / month</dd>
              </div>
              <div>
                <dt>Token cap</dt>
                <dd>{USAGE_TOTALS.limitTokens.toLocaleString('en-US')} sample tokens</dd>
              </div>
              <div>
                <dt>Estimate cap</dt>
                <dd>{sampleUsd(USAGE_TOTALS.limitCost)}</dd>
              </div>
              <div>
                <dt>Enforcement</dt>
                <dd>Not enforced. Limits are labels on this screen.</dd>
              </div>
            </dl>
          </Panel>
        </div>
      )}
    </DoctorPage>
  )
}
