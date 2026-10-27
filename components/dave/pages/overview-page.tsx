'use client'

import Link from 'next/link'
import { Alert, Card, Chip } from '@heroui/react'
import { MotionIn } from '@/components/bizniz/motion-in'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import {
  ACTIVE_INCIDENT,
  INCIDENTS,
  inScope,
  overviewCounts,
  projectById,
  projectsIn,
  scopedActivity,
  scopedFeed,
} from '@/lib/dave/fixtures'
import { healthSnapshot } from '@/lib/dave/fixtures/monitoring'
import { formatStamp } from '@/lib/dave/format'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DoctorPage } from '@/components/dave/ui/doctor-page'
import { Badge, SampleTag, severityTone, StateBlock } from '@/components/dave/ui/kit'

export function OverviewPage() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId, projectId, range } = useDoctorWorkspace()
  const workspace = workspaceId === 'ws_sandbox' ? 'Sandbox' : 'Northwind Engineering'
  const counts = overviewCounts(workspaceId, projectId)
  const projects = projectsIn(workspaceId).filter((project) => projectId === 'all' || project.id === projectId)
  const health = healthSnapshot(projectId, range)
  const feed = [...scopedFeed(workspaceId, projectId)].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 7)
  const activity = [...scopedActivity(workspaceId, projectId)].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 7)
  const openIncidents = inScope(INCIDENTS, workspaceId, projectId)
    .filter((incident) => ACTIVE_INCIDENT.has(incident.status))
    .sort((a, b) => {
      const rank = { critical: 0, high: 1, medium: 2, low: 3 }
      return rank[a.severity] - rank[b.severity] || b.detectedAt.localeCompare(a.detectedAt)
    })
  const queue = openIncidents.filter((incident) =>
    ['awaiting_approval', 'needs_human', 'reopened', 'verifying'].includes(incident.status),
  )
  const appTone = health.app === 'operational' ? 'ok' : 'warn'

  const kpis = [
    { n: counts.activeIncidents, label: lang === 'ar' ? 'حوادث نشطة' : 'Active incidents', href: '/dashboard/incidents', tone: counts.activeIncidents ? 'bad' : 'ok' },
    { n: counts.investigations, label: lang === 'ar' ? 'تحقيقات' : 'Investigations', href: '/dashboard/incidents', tone: 'warn' },
    { n: counts.awaitingVerification, label: lang === 'ar' ? 'بانتظار تحقق' : 'Awaiting verify', href: '/dashboard/tasks', tone: 'info' },
    { n: counts.verified, label: lang === 'ar' ? 'تم التحقق' : 'Verified', href: '/dashboard/incidents', tone: 'ok' },
    { n: counts.projects, label: lang === 'ar' ? 'مشاريع' : 'Projects', href: '/dashboard/projects', tone: 'neutral' },
    { n: counts.deployments, label: lang === 'ar' ? 'نشرات' : 'Deploys', href: '/dashboard/monitoring', tone: 'neutral' },
  ] as const

  const healthRows = [
    { label: lang === 'ar' ? 'التطبيق' : 'Application', value: health.app, tone: appTone },
    { label: lang === 'ar' ? 'معدل الأخطاء' : 'Error rate', value: health.errorRate, tone: 'neutral' },
    { label: lang === 'ar' ? 'زمن الاستجابة' : 'Latency', value: health.latency, tone: 'neutral' },
    { label: lang === 'ar' ? 'الذاكرة' : 'Memory', value: health.memory, tone: 'neutral' },
    { label: lang === 'ar' ? 'النشر' : 'Deploy', value: health.deploy, tone: 'neutral' },
    { label: lang === 'ar' ? 'المراقبة' : 'Monitor', value: health.monitoring, tone: 'warn' },
  ] as const

  return (
    <DoctorPage
      title={lang === 'ar' ? 'نظرة العمليات' : 'Operations overview'}
      subtitle={`${workspace} · ${copy.range[range]} · ${copy.pages.overview.sub}`}
      emptyTitle="No sample activity"
      emptyBody="The preview is hiding workspace records. Set UI preview back to Ready."
    >
      {projects.length === 0 ? (
        <StateBlock
          title="This workspace has no projects"
          body="Sandbox workspace is an empty sample. Switch back to Northwind Engineering to see incidents, deploys, and reports."
        />
      ) : (
        <div className="dv-ops">
          <MotionIn>
            <Alert status="accent" className="mb-0">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{lang === 'ar' ? 'معاينة عمليات' : 'Operations preview'}</Alert.Title>
                <Alert.Description>{copy.localOnly}</Alert.Description>
              </Alert.Content>
            </Alert>
          </MotionIn>

          <MotionIn delay={30}>
            <section className="dv-ops-kpis" aria-label="Key counts">
              {kpis.map((kpi) => (
                <Link key={kpi.label} href={kpi.href} className={`dv-ops-kpi is-${kpi.tone}`}>
                  <span className="dv-ops-kpi__n">{kpi.n}</span>
                  <span className="dv-ops-kpi__l">{kpi.label}</span>
                </Link>
              ))}
            </section>
          </MotionIn>

          <div className="dv-ops-grid">
            <MotionIn delay={60}>
              <Card className="dv-hu-card dv-ops-panel dv-ops-panel--health w-full" variant="secondary">
                <Card.Header className="flex flex-row items-center justify-between gap-3">
                  <Card.Title>{lang === 'ar' ? 'صحة النظام' : 'System health'}</Card.Title>
                  <SampleTag />
                </Card.Header>
                <Card.Content>
                  <ul className="dv-ops-health">
                    {healthRows.map((row) => (
                      <li key={row.label} className={`is-${row.tone}`}>
                        <span>{row.label}</span>
                        <strong>{row.value}</strong>
                      </li>
                    ))}
                  </ul>
                </Card.Content>
              </Card>
            </MotionIn>

            <MotionIn delay={100}>
              <Card className="dv-hu-card dv-ops-panel w-full" variant="secondary">
                <Card.Header className="flex flex-row items-center justify-between gap-3">
                  <Card.Title>{lang === 'ar' ? 'يحتاج قرارًا' : 'Needs a decision'}</Card.Title>
                  <Chip size="sm" variant="primary" color={queue.length ? 'warning' : 'success'}>
                    {queue.length}
                  </Chip>
                </Card.Header>
                <Card.Content>
                  {queue.length === 0 ? (
                    <p className="dv-ops-empty">{lang === 'ar' ? 'لا يوجد قرار معلّق في هذه العينة.' : 'No pending decision in this sample.'}</p>
                  ) : (
                    <ol className="dv-ops-queue">
                      {queue.map((incident, index) => (
                        <li key={incident.id}>
                          <span className="dv-ops-queue__i">{index + 1}</span>
                          <div>
                            <Link href={`/dashboard/incidents/${incident.id}`}>{incident.title}</Link>
                            <p>
                              {projectById(incident.projectId)?.name} · {copy.incident[incident.status]} · {copy.fix[incident.fixStage]}
                            </p>
                          </div>
                          <Badge tone={severityTone(incident.severity)}>{incident.severity}</Badge>
                        </li>
                      ))}
                    </ol>
                  )}
                </Card.Content>
              </Card>
            </MotionIn>
          </div>

          <MotionIn delay={140}>
            <Card className="dv-hu-card dv-ops-panel w-full" variant="secondary">
            <Card.Header className="flex flex-row items-center justify-between gap-3">
              <Card.Title>{lang === 'ar' ? 'حوادث مفتوحة' : 'Open incidents'}</Card.Title>
              <Link href="/dashboard/incidents" className="dv-link">
                {copy.links.all}
              </Link>
            </Card.Header>
            <Card.Content>
            <div className="dv-table-wrap">
              <table className="dv-table dv-ops-table">
                <caption>{lang === 'ar' ? 'حوادث العينة غير المحققة كحل نهائي.' : 'Sample incidents that are not verified resolutions.'}</caption>
                <thead>
                  <tr>
                    <th>Sev</th>
                    <th>Incident</th>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Detected</th>
                    <th>Next step</th>
                    <th>Verify</th>
                  </tr>
                </thead>
                <tbody>
                  {openIncidents.map((incident) => (
                    <tr key={incident.id}>
                      <td data-label="Sev">
                        <Badge tone={severityTone(incident.severity)}>{incident.severity}</Badge>
                      </td>
                      <td data-label="Incident">
                        <Link href={`/dashboard/incidents/${incident.id}`}>{incident.title}</Link>
                      </td>
                      <td data-label="Project">{projectById(incident.projectId)?.name}</td>
                      <td data-label="Status">{copy.incident[incident.status]}</td>
                      <td data-label="Detected">
                        <time dateTime={incident.detectedAt}>{formatStamp(incident.detectedAt)}</time>
                      </td>
                      <td data-label="Next step">{incident.step}</td>
                      <td data-label="Verify">{copy.verify[incident.verification]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </Card.Content>
            </Card>
          </MotionIn>

          <div className="dv-ops-grid dv-ops-grid--bottom">
            <MotionIn delay={180}>
              <Card className="dv-hu-card dv-ops-panel w-full" variant="secondary">
                <Card.Header>
                  <Card.Title>{lang === 'ar' ? 'نشاط Dave Doctor' : 'Dave Doctor activity'}</Card.Title>
                </Card.Header>
                <Card.Content>
                  <ul className="dv-ops-feed">
                    {activity.map((item) => (
                      <li key={item.id}>
                        <time dateTime={item.at}>{formatStamp(item.at)}</time>
                        <div>
                          <Badge tone="info">{copy.activity[item.state]}</Badge>
                          <Link href={item.href}>{item.title}</Link>
                          <p>{item.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card.Content>
              </Card>
            </MotionIn>

            <MotionIn delay={220}>
              <Card className="dv-hu-card dv-ops-panel w-full" variant="secondary">
                <Card.Header>
                  <Card.Title>{lang === 'ar' ? 'سجل هندسي' : 'Engineering log'}</Card.Title>
                </Card.Header>
                <Card.Content>
                  <ul className="dv-ops-feed">
                    {feed.map((item) => (
                      <li key={item.id}>
                        <time dateTime={item.at}>{formatStamp(item.at)}</time>
                        <div>
                          <span className="dv-ops-kind">{item.kind.replace(/_/g, ' ')}</span>
                          <Link href={item.href}>{item.title}</Link>
                          <p>{item.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card.Content>
              </Card>
            </MotionIn>
          </div>
        </div>
      )}
    </DoctorPage>
  )
}
