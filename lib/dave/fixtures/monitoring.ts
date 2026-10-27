import type { Deployment, HealthCheck, LogLine, TimeRange } from './types'

/** Sample telemetry. Not collected from a running monitor. */
export const LOGS: LogLine[] = [
  { id: 'log_1', projectId: 'prj_checkout', at: '2026-10-21T14:21:02Z', severity: 'ERROR', service: 'checkout-service', environment: 'production', message: 'timeout acquiring connection from pool orders', traceId: 'tr_9f21' },
  { id: 'log_2', projectId: 'prj_checkout', at: '2026-10-21T14:21:08Z', severity: 'ERROR', service: 'checkout-service', environment: 'production', message: 'POST /v1/checkout failed status=500', traceId: 'tr_9f22' },
  { id: 'log_3', projectId: 'prj_checkout', at: '2026-10-21T14:22:40Z', severity: 'WARN', service: 'checkout-service', environment: 'production', message: 'retry reserveInventory attempt=3', traceId: 'tr_9f30' },
  { id: 'log_4', projectId: 'prj_checkout', at: '2026-10-21T14:40:00Z', severity: 'INFO', service: 'checkout-service', environment: 'production', message: 'readiness ok build=c4e91ab', traceId: 'tr_9f80' },
  { id: 'log_5', projectId: 'prj_auth', at: '2026-10-21T12:07:11Z', severity: 'WARN', service: 'auth-gateway', environment: 'production', message: 'redis timeout command=GET key=session:8c', traceId: 'tr_aa10' },
  { id: 'log_6', projectId: 'prj_auth', at: '2026-10-21T12:40:00Z', severity: 'INFO', service: 'auth-gateway', environment: 'production', message: 'p95 recovered to 610ms', traceId: 'tr_aa40' },
  { id: 'log_7', projectId: 'prj_billing', at: '2026-10-21T08:20:00Z', severity: 'WARN', service: 'billing-worker', environment: 'staging', message: 'rss=912MB trend=up', traceId: 'tr_mem1' },
  { id: 'log_8', projectId: 'prj_billing', at: '2026-10-21T09:20:00Z', severity: 'INFO', service: 'billing-worker', environment: 'staging', message: 'pdf buffer released job=inv_8821', traceId: 'tr_mem2' },
  { id: 'log_9', projectId: 'prj_billing', at: '2026-10-20T22:41:00Z', severity: 'WARN', service: 'billing-worker', environment: 'staging', message: 'queue billing.invoice oldest=18m', traceId: 'tr_q1' },
  { id: 'log_10', projectId: 'prj_docs', at: '2026-10-19T09:16:00Z', severity: 'WARN', service: 'edge-cache', environment: 'preview', message: 'hit_ratio=0.11 ttl=0 path=/changelog', traceId: 'tr_cdn1' },
  { id: 'log_11', projectId: 'prj_docs', at: '2026-10-19T11:40:00Z', severity: 'INFO', service: 'edge-cache', environment: 'preview', message: 'hit_ratio=0.94 held for 120m', traceId: 'tr_cdn2' },
  { id: 'log_12', projectId: 'prj_checkout', at: '2026-10-21T06:10:12Z', severity: 'ERROR', service: 'checkout-service', environment: 'production', message: 'canceling statement due to lock timeout', traceId: 'tr_lock' },
]

export const DEPLOYMENTS: Deployment[] = [
  { id: 'dpl_214', projectId: 'prj_checkout', sha: 'c4e91ab', branch: 'main', environment: 'production', startedAt: '2026-10-21T14:08:00Z', finishedAt: '2026-10-21T14:12:00Z', status: 'succeeded' },
  { id: 'dpl_228', projectId: 'prj_billing', sha: 'b71c0de', branch: 'fix/pdf-buffer', environment: 'staging', startedAt: '2026-10-21T09:04:00Z', finishedAt: '2026-10-21T09:10:00Z', status: 'succeeded' },
  { id: 'dpl_190', projectId: 'prj_auth', sha: '91ab330', branch: 'main', environment: 'production', startedAt: '2026-10-20T17:54:00Z', finishedAt: '2026-10-20T18:02:00Z', status: 'succeeded' },
  { id: 'dpl_176', projectId: 'prj_docs', sha: 'e80aa12', branch: 'main', environment: 'preview', startedAt: '2026-10-19T09:40:00Z', finishedAt: '2026-10-19T09:44:00Z', status: 'succeeded' },
  { id: 'dpl_160', projectId: 'prj_checkout', sha: 'aa19c33', branch: 'main', environment: 'production', startedAt: '2026-10-18T17:12:00Z', finishedAt: '2026-10-18T17:20:00Z', status: 'succeeded' },
  { id: 'dpl_231', projectId: 'prj_auth', sha: '44de901', branch: 'feat/session-cache', environment: 'staging', startedAt: '2026-10-21T15:01:00Z', finishedAt: '2026-10-21T15:06:00Z', status: 'failed' },
]

export const HEALTH_CHECKS: HealthCheck[] = [
  { id: 'hc_checkout', projectId: 'prj_checkout', name: 'checkout /ready', status: 'degraded', checkedAt: '2026-10-21T15:10:00Z', reason: 'Ready, but error budget is burning.', history: ['up', 'up', 'up', 'degraded', 'degraded', 'degraded', 'up', 'degraded'] },
  { id: 'hc_auth', projectId: 'prj_auth', name: 'auth /ready', status: 'healthy', checkedAt: '2026-10-21T15:10:00Z', reason: 'Passing. Latency watch remains open.', history: ['up', 'degraded', 'degraded', 'up', 'up', 'up', 'up', 'up'] },
  { id: 'hc_billing', projectId: 'prj_billing', name: 'billing worker heartbeat', status: 'degraded', checkedAt: '2026-10-21T15:08:00Z', reason: 'Heartbeat ok. Memory slope still under review.', history: ['up', 'up', 'degraded', 'degraded', 'down', 'degraded', 'up', 'degraded'] },
  { id: 'hc_docs', projectId: 'prj_docs', name: 'docs origin', status: 'healthy', checkedAt: '2026-10-21T15:09:00Z', reason: 'Hit ratio inside the sample band.', history: ['down', 'degraded', 'up', 'up', 'up', 'up', 'up', 'up'] },
]

const CPU = [22, 24, 21, 26, 28, 27, 25, 30, 34, 41, 38, 36, 33, 31, 29, 28, 32, 35, 44, 46, 40, 37, 34, 32, 30, 29, 31, 33, 36, 34]
const MEMORY = [480, 488, 490, 510, 540, 560, 590, 640, 700, 760, 820, 880, 930, 980, 960, 910, 860, 820, 790, 770, 750, 748, 744, 742, 746, 750, 752, 748, 744, 740]
const LATENCY = [180, 190, 210, 240, 280, 420, 680, 910, 1200, 1900, 1600, 980, 640, 480, 360, 300, 280, 260, 250, 244, 230, 220, 210, 200, 198, 210, 240, 260, 250, 240]
const ERRORS = [0.2, 0.3, 0.2, 0.4, 0.5, 0.8, 1.4, 2.2, 3.1, 4.8, 4.6, 4.1, 3.4, 2.8, 2.2, 1.9, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1, 1.0, 0.9, 0.8, 0.9, 1.1, 1.4, 1.6, 1.8]
const AVAIL = [99.99, 99.98, 99.99, 99.95, 99.9, 99.4, 98.8, 98.2, 97.6, 97.1, 97.4, 98.1, 98.6, 99.0, 99.2, 99.4, 99.5, 99.6, 99.7, 99.8, 99.82, 99.86, 99.9, 99.92, 99.94, 99.95, 99.9, 99.88, 99.86, 99.9]

export const METRIC_SERIES = {
  cpu: { label: 'CPU', unit: '%', points: CPU },
  memory: { label: 'Memory RSS', unit: ' MB', points: MEMORY },
  latency: { label: 'Request latency p95', unit: ' ms', points: LATENCY },
  errors: { label: 'Error rate', unit: '%', points: ERRORS },
  availability: { label: 'Availability', unit: '%', points: AVAIL },
} as const

const FACTOR: Record<string, number> = {
  all: 1,
  prj_checkout: 1,
  prj_auth: 0.62,
  prj_billing: 1.12,
  prj_docs: 0.35,
}

export function seriesFor(metric: keyof typeof METRIC_SERIES, projectId: string) {
  const factor = FACTOR[projectId] ?? 1
  return METRIC_SERIES[metric].points.map((n) => Math.round(n * factor * 10) / 10)
}

export function healthSnapshot(projectId: string, range: TimeRange) {
  const err = seriesFor('errors', projectId)
  const lat = seriesFor('latency', projectId)
  const mem = seriesFor('memory', projectId)
  const slice = range === '1h' ? -1 : range === '6h' ? -3 : -6
  const error = err.at(slice) ?? err.at(-1) ?? 0
  const latency = lat.at(slice) ?? lat.at(-1) ?? 0
  const memory = mem.at(slice) ?? mem.at(-1) ?? 0
  const degraded = projectId === 'all' || projectId === 'prj_checkout' || projectId === 'prj_billing'
  return {
    app: projectId === 'prj_docs' || projectId === 'prj_auth' ? 'operational' : degraded ? 'degraded' : 'unknown',
    errorRate: `${error}%`,
    latency: `${Math.round(latency)} ms`,
    memory: `${Math.round(memory)} MB`,
    deploy: projectId === 'prj_auth' ? 'dpl_231 failed in staging' : 'Latest sample deploy succeeded',
    monitoring: 'Example only — no live collector is connected',
  } as const
}
