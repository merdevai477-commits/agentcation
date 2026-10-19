export type StageStatus = 'pending' | 'running' | 'completed' | 'needs_approval'

export type DemoStageId =
  | 'detect'
  | 'logs'
  | 'correlate'
  | 'code'
  | 'root_cause'
  | 'report'
  | 'fix'
  | 'validate'
  | 'verify'

export type DemoPhase =
  | 'healthy'
  | 'detect'
  | 'logs'
  | 'code'
  | 'report'
  | 'fix'
  | 'verify'
  | 'done'

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'OK'

export type LogEntry = {
  id: string
  time: string
  level: LogLevel
  message: string
  /** ms from demo start when this log appears */
  at: number
  highlight?: boolean
}

export type MetricSnapshot = {
  errorRate: number
  p95Ms: number
  rps: number
  poolPct: number
  health: 'healthy' | 'degraded' | 'incident' | 'recovering'
}

export type CodeLine = {
  n: number
  text: string
  kind?: 'normal' | 'suspect' | 'add' | 'remove'
}

export type StageDef = {
  id: DemoStageId
  title: string
  description: string
  /** when stage becomes running */
  startMs: number
  /** when stage becomes completed (or needs_approval for fix) */
  endMs: number
  approval?: boolean
}

/** Deterministic simulated checkout-service incident (~22s). */
export const DEMO_DURATION_MS = 22000

export const STAGES: StageDef[] = [
  {
    id: 'detect',
    title: 'Detecting anomaly',
    description: 'Unusual increase in HTTP 500 responses after deploy.',
    startMs: 2000,
    endMs: 4500,
  },
  {
    id: 'logs',
    title: 'Inspecting logs',
    description: 'Database pool utilization rose shortly before failures.',
    startMs: 4500,
    endMs: 7500,
  },
  {
    id: 'correlate',
    title: 'Correlating deploy & metrics',
    description: 'Deploy #1842 aligns with the error-rate cliff.',
    startMs: 5500,
    endMs: 8500,
  },
  {
    id: 'code',
    title: 'Analyzing source code',
    description: 'Reviewing exception path and connection lifecycle.',
    startMs: 7500,
    endMs: 10500,
  },
  {
    id: 'root_cause',
    title: 'Identifying probable root cause',
    description: 'Connection may not release on the error path.',
    startMs: 9500,
    endMs: 12000,
  },
  {
    id: 'report',
    title: 'Generating incident report',
    description: 'Summarizing evidence and recommended next action.',
    startMs: 11000,
    endMs: 14000,
  },
  {
    id: 'fix',
    title: 'Preparing proposed fix',
    description: 'Illustrative cleanup patch — awaiting human approval.',
    startMs: 14000,
    endMs: 17500,
    approval: true,
  },
  {
    id: 'validate',
    title: 'Running simulated validation',
    description: 'Illustrative checks against the proposed change.',
    startMs: 17500,
    endMs: 19500,
  },
  {
    id: 'verify',
    title: 'Verifying service recovery',
    description: 'Simulated metrics return toward baseline.',
    startMs: 19500,
    endMs: 22000,
  },
]

export const LOGS: LogEntry[] = [
  { id: 'l1', time: '10:41:58', level: 'INFO', message: 'Checkout request received', at: 400 },
  { id: 'l2', time: '10:41:59', level: 'INFO', message: 'Payment intent authorized', at: 900 },
  { id: 'l3', time: '10:42:00', level: 'INFO', message: 'Order persisted successfully', at: 1400 },
  { id: 'l4', time: '10:42:01', level: 'INFO', message: 'Checkout request received', at: 2200 },
  { id: 'l5', time: '10:42:02', level: 'WARN', message: 'Database pool utilization: 94%', at: 2800, highlight: true },
  { id: 'l6', time: '10:42:03', level: 'ERROR', message: 'Checkout failed: connection timeout', at: 3400, highlight: true },
  { id: 'l7', time: '10:42:04', level: 'ERROR', message: 'HTTP 500 returned by checkout-service', at: 3900, highlight: true },
  { id: 'l8', time: '10:42:05', level: 'ERROR', message: 'Pool wait queue depth: 47', at: 4600, highlight: true },
  { id: 'l9', time: '10:42:06', level: 'WARN', message: 'Retry storm detected on /checkout', at: 5200 },
  { id: 'l10', time: '10:42:08', level: 'ERROR', message: 'Upstream chargeOrder aborted', at: 6200 },
  { id: 'l11', time: '10:42:18', level: 'INFO', message: 'Simulated validation suite started', at: 17800 },
  { id: 'l12', time: '10:42:20', level: 'OK', message: 'Simulated checks passed (illustrative)', at: 19000 },
  { id: 'l13', time: '10:42:21', level: 'INFO', message: 'Error rate trending down (simulated)', at: 20000 },
  { id: 'l14', time: '10:42:22', level: 'OK', message: 'Checkout requests succeeding again', at: 21000 },
]

export const CODE_BEFORE: CodeLine[] = [
  { n: 14, text: 'async function processCheckout(order) {' },
  { n: 15, text: '  const connection = await pool.connect();' },
  { n: 16, text: '' },
  { n: 17, text: '  try {' },
  { n: 18, text: '    return await chargeOrder(connection, order);' },
  { n: 19, text: '  } catch (error) {' },
  { n: 20, text: '    logger.error(error);', kind: 'suspect' },
  { n: 21, text: '    throw error;', kind: 'suspect' },
  { n: 22, text: '  }' },
  { n: 23, text: '}' },
]

export const CODE_DIFF: CodeLine[] = [
  { n: 14, text: 'async function processCheckout(order) {' },
  { n: 15, text: '  const connection = await pool.connect();' },
  { n: 16, text: '' },
  { n: 17, text: '  try {' },
  { n: 18, text: '    return await chargeOrder(connection, order);' },
  { n: 19, text: '  } catch (error) {' },
  { n: 20, text: '    logger.error(error);' },
  { n: 21, text: '    throw error;' },
  { n: 22, text: '  } finally {', kind: 'add' },
  { n: 23, text: '    connection.release();', kind: 'add' },
  { n: 24, text: '  }', kind: 'add' },
  { n: 25, text: '}' },
]

export const REPORT = {
  title: 'Incident report',
  service: 'checkout-service',
  impact: 'Elevated checkout failures and increased request latency.',
  evidence: [
    'HTTP 5xx responses increased after deployment #1842.',
    'Database pool utilization approached capacity.',
    'Connection timeouts appeared in the logs.',
  ],
  probableCause:
    'A database connection cleanup issue may be contributing to connection pool exhaustion.',
  recommendation:
    'Prepare a targeted cleanup fix and validate it in a controlled environment.',
  confidence: 'HIGH — SIMULATED',
}

export const FIX_DETAIL = {
  why: 'The catch path logs and rethrows without releasing the pooled connection, which can exhaust the pool under error load.',
  expected: 'Connections return to the pool on every exit path, reducing timeout risk during elevated error rates.',
  tests: [
    'Unit: processCheckout releases connection on chargeOrder failure.',
    'Integration: pool utilization stays bounded under injected 5xx load.',
    'Canary: error rate and p95 monitored for 15 minutes (human-gated).',
  ],
  approval:
    'No repository write, PR, or deploy is performed by this demo. A person must approve any real change.',
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t))
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

/** Derive metrics purely from elapsed ms — deterministic. */
export function metricsAt(elapsed: number): MetricSnapshot {
  if (elapsed < 2000) {
    return { errorRate: 0.4, p95Ms: 180, rps: 420, poolPct: 38, health: 'healthy' }
  }
  if (elapsed < 4500) {
    const t = easeInOut((elapsed - 2000) / 2500)
    return {
      errorRate: lerp(0.4, 12.8, t),
      p95Ms: lerp(180, 1800, t),
      rps: lerp(420, 510, t),
      poolPct: lerp(38, 96, t),
      health: t > 0.35 ? 'incident' : 'degraded',
    }
  }
  if (elapsed < 17500) {
    return { errorRate: 12.8, p95Ms: 1800, rps: 480, poolPct: 94, health: 'incident' }
  }
  if (elapsed < 22000) {
    const t = easeInOut((elapsed - 17500) / 4500)
    return {
      errorRate: lerp(12.8, 0.6, t),
      p95Ms: lerp(1800, 220, t),
      rps: lerp(480, 430, t),
      poolPct: lerp(94, 42, t),
      health: t > 0.7 ? 'healthy' : 'recovering',
    }
  }
  return { errorRate: 0.5, p95Ms: 190, rps: 425, poolPct: 40, health: 'healthy' }
}

/** Sampled sparkline values 0–1 for charts (error / latency). */
export function sparklineAt(elapsed: number, kind: 'error' | 'latency', points = 24): number[] {
  const out: number[] = []
  const step = Math.max(1, elapsed / (points - 1))
  for (let i = 0; i < points; i++) {
    const t = Math.min(elapsed, i * step)
    const m = metricsAt(t)
    out.push(kind === 'error' ? m.errorRate / 14 : m.p95Ms / 2000)
  }
  return out
}

export function phaseAt(elapsed: number): DemoPhase {
  if (elapsed < 2000) return 'healthy'
  if (elapsed < 4500) return 'detect'
  if (elapsed < 7500) return 'logs'
  if (elapsed < 10500) return 'code'
  if (elapsed < 14000) return 'report'
  if (elapsed < 17500) return 'fix'
  if (elapsed < 22000) return 'verify'
  return 'done'
}

export function stageStatusAt(stage: StageDef, elapsed: number): StageStatus {
  if (elapsed < stage.startMs) return 'pending'
  if (elapsed < stage.endMs) return 'running'
  if (stage.approval && elapsed < 19500) return 'needs_approval'
  return 'completed'
}

export function visibleLogs(elapsed: number): LogEntry[] {
  return LOGS.filter((l) => l.at <= elapsed)
}

export function codeRevealCount(elapsed: number): number {
  if (elapsed < 7500) return 3
  if (elapsed < 8500) return 6
  if (elapsed < 9500) return CODE_BEFORE.length
  return CODE_BEFORE.length
}

export function showSuspectHighlight(elapsed: number) {
  return elapsed >= 8500
}

export function showDiff(elapsed: number) {
  return elapsed >= 14500
}

export function showReport(elapsed: number) {
  return elapsed >= 11500
}

export function showDiagnosis(elapsed: number) {
  return elapsed >= 10000
}

export function phaseLabel(phase: DemoPhase, compact = false): string {
  switch (phase) {
    case 'healthy':
      return compact ? 'HEALTHY' : 'SYSTEM HEALTHY'
    case 'detect':
      return compact ? 'ANOMALY' : 'ANOMALY DETECTED'
    case 'logs':
      return compact ? 'LOGS' : 'INSPECTING LOGS'
    case 'code':
      return compact ? 'CODE' : 'ANALYZING SOURCE CODE'
    case 'report':
      return compact ? 'REPORT' : 'INCIDENT REPORT'
    case 'fix':
      return compact ? 'FIX READY' : 'PROPOSED FIX — AWAITING APPROVAL'
    case 'verify':
      return compact ? 'VALIDATING' : 'SIMULATED VALIDATION'
    case 'done':
      return compact ? 'RECOVERED' : 'SIMULATED RECOVERY COMPLETE'
  }
}
