'use client'

import { doctorCopy } from '@/lib/dave/doctor-copy'
import {
  ACTIVE_INCIDENT,
  INCIDENTS,
  inScope,
  overviewCounts,
  projectById,
} from '@/lib/dave/fixtures'
import { healthSnapshot } from '@/lib/dave/fixtures/monitoring'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { Badge, severityTone } from '@/components/dave/ui/kit'

export function DaveMobileWatch() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const { workspaceId, projectId, range } = useDoctorWorkspace()
  const counts = overviewCounts(workspaceId, projectId)
  const health = healthSnapshot(projectId, range)
  const incidents = inScope(INCIDENTS, workspaceId, projectId)
    .filter((incident) => ACTIVE_INCIDENT.has(incident.status))
    .slice(0, 5)

  const kpis = [
    { n: counts.activeIncidents, label: lang === 'ar' ? 'حوادث' : 'Incidents', tone: counts.activeIncidents ? 'bad' : 'ok' },
    { n: counts.investigations, label: lang === 'ar' ? 'تحقيق' : 'Investigating', tone: 'warn' },
    { n: counts.awaitingVerification, label: lang === 'ar' ? 'بانتظارك' : 'Needs you', tone: 'info' },
    { n: counts.verified, label: lang === 'ar' ? 'اتقفل' : 'Verified', tone: 'ok' },
  ]

  return (
    <section className="watch" aria-label={lang === 'ar' ? 'متابعة' : 'Watch'}>
      <header className="watch__head">
        <p>{lang === 'ar' ? 'متابعة الموبايل' : 'Mobile watch'}</p>
        <h1>{lang === 'ar' ? 'حالة التشغيل' : 'Live status'}</h1>
        <span>{lang === 'ar' ? 'اللوحة الكاملة على الكمبيوتر.' : 'The full console stays on desktop.'}</span>
      </header>

      <div className="watch__kpis">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`watch__kpi is-${kpi.tone}`}>
            <strong>{kpi.n}</strong>
            <span>{kpi.label}</span>
          </div>
        ))}
      </div>

      <article className="watch__card">
        <h2>{lang === 'ar' ? 'الصحة' : 'Health'}</h2>
        <ul>
          <li><span>{lang === 'ar' ? 'التطبيق' : 'App'}</span><strong>{health.app}</strong></li>
          <li><span>{lang === 'ar' ? 'الأخطاء' : 'Errors'}</span><strong>{health.errorRate}</strong></li>
          <li><span>{lang === 'ar' ? 'الاستجابة' : 'Latency'}</span><strong>{health.latency}</strong></li>
          <li><span>{lang === 'ar' ? 'النشر' : 'Deploy'}</span><strong>{health.deploy}</strong></li>
        </ul>
      </article>

      <article className="watch__card">
        <h2>{lang === 'ar' ? 'محتاج متابعة' : 'Needs a look'}</h2>
        {incidents.length === 0 ? (
          <p className="watch__empty">{lang === 'ar' ? 'مفيش حادث مفتوح في العينة.' : 'No open incident in this sample.'}</p>
        ) : (
          <ol>
            {incidents.map((incident) => (
              <li key={incident.id}>
                <div>
                  <strong>{incident.title}</strong>
                  <span>{projectById(incident.projectId)?.name} · {copy.incident[incident.status]}</span>
                </div>
                <Badge tone={severityTone(incident.severity)}>{incident.severity}</Badge>
              </li>
            ))}
          </ol>
        )}
      </article>
    </section>
  )
}
