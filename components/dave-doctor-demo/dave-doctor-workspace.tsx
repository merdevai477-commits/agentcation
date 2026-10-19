'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Check,
  ChevronRight,
  Circle,
  FileCode2,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react'
import {
  CODE_BEFORE,
  CODE_DIFF,
  DEMO_DURATION_MS,
  FIX_DETAIL,
  REPORT,
  STAGES,
  codeRevealCount,
  metricsAt,
  phaseAt,
  phaseLabel,
  showDiagnosis,
  showDiff,
  showReport,
  showSuspectHighlight,
  sparklineAt,
  stageStatusAt,
  visibleLogs,
  type DemoStageId,
  type StageDef,
  type StageStatus,
} from '@/lib/dave-doctor-demo/scenario'
import { useDaveTimeline } from './use-dave-timeline'

type MobileTab = 'signals' | 'investigation' | 'code'
type DetailMode = 'overview' | 'technical'

function Sparkline({ values, stroke }: { values: number[]; stroke: string }) {
  const w = 120
  const h = 36
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * w
      const y = h - 2 - Math.min(1, Math.max(0, v)) * (h - 4)
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg className="dd-spark" viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <polyline fill="none" stroke={stroke} strokeWidth="1.6" points={pts} />
    </svg>
  )
}

function StatusPill({ status }: { status: StageStatus }) {
  const full =
    status === 'pending'
      ? 'Pending'
      : status === 'running'
        ? 'Running'
        : status === 'needs_approval'
          ? 'Needs approval'
          : 'Completed'
  const short =
    status === 'pending' ? 'Wait' : status === 'running' ? 'Run' : status === 'needs_approval' ? 'Approve' : 'Done'
  return (
    <span className={`dd-stage-pill dd-stage-pill--${status}`}>
      <span className="dd-stage-pill__full">{full}</span>
      <span className="dd-stage-pill__short">{short}</span>
    </span>
  )
}

function stageIcon(id: DemoStageId) {
  switch (id) {
    case 'detect':
      return AlertTriangle
    case 'logs':
      return Search
    case 'correlate':
      return Activity
    case 'code':
      return FileCode2
    case 'root_cause':
      return ShieldAlert
    case 'report':
      return Sparkles
    case 'fix':
      return FileCode2
    case 'validate':
      return Gauge
    case 'verify':
      return Check
  }
}

export function DaveDoctorWorkspace() {
  const [reduced, setReduced] = useState(false)
  const [mobileTab, setMobileTab] = useState<MobileTab>('investigation')
  const [detailMode, setDetailMode] = useState<DetailMode>('overview')
  const [selectedStage, setSelectedStage] = useState<DemoStageId | null>(null)
  const [fixOpen, setFixOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const { elapsed, paused, done, replay, togglePause } = useDaveTimeline({
    reducedMotion: reduced,
    autoplay: true,
  })

  const metrics = useMemo(() => metricsAt(elapsed), [elapsed])
  const phase = useMemo(() => phaseAt(elapsed), [elapsed])
  const logs = useMemo(() => visibleLogs(elapsed), [elapsed])
  const errorSpark = useMemo(() => sparklineAt(elapsed, 'error'), [elapsed])
  const latencySpark = useMemo(() => sparklineAt(elapsed, 'latency'), [elapsed])
  const reveal = codeRevealCount(elapsed)
  const suspect = showSuspectHighlight(elapsed)
  const diff = showDiff(elapsed)
  const report = showReport(elapsed)
  const diagnosis = showDiagnosis(elapsed)

  const stages = useMemo(
    () =>
      STAGES.map((s) => ({
        ...s,
        status: stageStatusAt(s, elapsed),
      })),
    [elapsed],
  )

  const activeStage = stages.find((s) => s.status === 'running') ?? stages.filter((s) => s.status !== 'pending').at(-1)
  const reviewed: StageDef | undefined = selectedStage
    ? STAGES.find((s) => s.id === selectedStage)
    : activeStage

  const reviewedStatus = reviewed ? stageStatusAt(reviewed, elapsed) : 'pending'
  const canSelect = (s: (typeof stages)[number]) => s.status !== 'pending'

  function onSelectStage(id: DemoStageId) {
    const s = stages.find((x) => x.id === id)
    if (!s || s.status === 'pending') return
    setSelectedStage(id)
    setMobileTab('investigation')
  }

  const healthLabel =
    metrics.health === 'healthy'
      ? 'Healthy'
      : metrics.health === 'degraded'
        ? 'Degraded'
        : metrics.health === 'recovering'
          ? 'Recovering'
          : 'Incident'

  return (
    <div className="dd-workspace" role="region" aria-label="Dave Doctor simulated incident investigation">
      <header className="dd-bar">
        <div className="dd-bar__identity">
          <span className="dd-bar__avatar">
            <Stethoscope size={16} />
          </span>
          <div>
            <p className="dd-bar__name">Dave Doctor</p>
            <p className="dd-bar__role">AI Engineering Agent</p>
          </div>
        </div>

        <div className="dd-bar__center">
          <span className={`dd-status dd-status--${metrics.health}`}>
            <span className="dd-status__dot" />
            <span className="dd-status__full">{phaseLabel(phase)}</span>
            <span className="dd-status__short">{phaseLabel(phase, true)}</span>
          </span>
          <span className="dd-bar__incident">
            <span className="dd-bar__incident-full">
              {phase === 'healthy' ? 'checkout-service · nominal' : 'Investigating checkout-service'}
            </span>
            <span className="dd-bar__incident-short">
              {phase === 'healthy' ? 'checkout · ok' : 'checkout-service'}
            </span>
          </span>
        </div>

        <div className="dd-bar__actions">
          <span className="dd-sim-badge">
            <span className="dd-sim-badge__full">SIMULATED DEMO</span>
            <span className="dd-sim-badge__short">SIM</span>
          </span>
          <button type="button" className="dd-icon-btn" onClick={togglePause} aria-label={paused ? 'Resume' : 'Pause'}>
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button type="button" className="dd-icon-btn" onClick={replay} aria-label="Replay demo">
            <RotateCcw size={14} />
          </button>
        </div>
      </header>

      <div className="dd-progress" aria-hidden>
        <div className="dd-progress__fill" style={{ width: `${(elapsed / DEMO_DURATION_MS) * 100}%` }} />
      </div>

      <p className="dd-disclaimer">
        <span className="dd-disclaimer__full">Interactive simulation — illustrative data. Not connected to a production environment.</span>
        <span className="dd-disclaimer__short">Simulated demo · illustrative data</span>
      </p>

      <div className="dd-toolbar">
        <div className="dd-seg" role="tablist" aria-label="Detail level">
          <button type="button" role="tab" aria-selected={detailMode === 'overview'} className={detailMode === 'overview' ? 'is-active' : ''} onClick={() => setDetailMode('overview')}>
            Overview
          </button>
          <button type="button" role="tab" aria-selected={detailMode === 'technical'} className={detailMode === 'technical' ? 'is-active' : ''} onClick={() => setDetailMode('technical')}>
            Technical
          </button>
        </div>
        <div className="dd-mobile-tabs" role="tablist" aria-label="Demo panels">
          {(
            [
              ['signals', 'Signals'],
              ['investigation', 'Investigate'],
              ['code', 'Code'],
            ] as const
          ).map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={mobileTab === id} className={mobileTab === id ? 'is-active' : ''} onClick={() => setMobileTab(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="dd-panels">
        <aside className={`dd-panel dd-panel--signals ${mobileTab === 'signals' ? 'is-mobile-active' : ''}`}>
          <div className="dd-panel__head">
            <Activity size={14} />
            Live signals
            <span className="dd-panel__tag">simulated</span>
          </div>

          <div className="dd-metrics">
            <div className="dd-metric">
              <div className="dd-metric__top">
                <span>Error rate</span>
                <strong className={metrics.errorRate > 5 ? 'is-hot' : ''}>{metrics.errorRate.toFixed(1)}%</strong>
              </div>
              <Sparkline values={errorSpark} stroke={metrics.errorRate > 5 ? '#f87171' : '#22d3ee'} />
            </div>
            <div className="dd-metric">
              <div className="dd-metric__top">
                <span>P95 latency</span>
                <strong className={metrics.p95Ms > 600 ? 'is-hot' : ''}>{Math.round(metrics.p95Ms)} ms</strong>
              </div>
              <Sparkline values={latencySpark} stroke="#a78bfa" />
            </div>
            <div className="dd-metric dd-metric--compact">
              <span>RPS</span>
              <strong>{Math.round(metrics.rps)}</strong>
            </div>
            <div className="dd-metric dd-metric--compact">
              <span>DB pool</span>
              <strong className={metrics.poolPct > 85 ? 'is-hot' : ''}>{Math.round(metrics.poolPct)}%</strong>
            </div>
            <div className="dd-metric dd-metric--compact">
              <span>Health</span>
              <strong className={`dd-health dd-health--${metrics.health}`}>{healthLabel}</strong>
            </div>
          </div>

          <div className="dd-logs">
            <div className="dd-panel__sub">Recent logs · checkout-service</div>
            <div className="dd-logs__stream">
              {logs.length === 0 && <p className="dd-muted">Awaiting telemetry…</p>}
              {logs.map((log) => (
                <div key={log.id} className={`dd-log dd-log--${log.level.toLowerCase()} ${log.highlight && elapsed >= log.at ? 'is-lit' : ''}`}>
                  <span className="dd-log__time">{log.time}</span>
                  <span className="dd-log__lvl">{log.level}</span>
                  <span className="dd-log__msg">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className={`dd-panel dd-panel--invest ${mobileTab === 'investigation' ? 'is-mobile-active' : ''}`}>
          <div className="dd-panel__head">
            <Stethoscope size={14} />
            Dave Doctor investigation
          </div>

          <div className="dd-timeline">
            {stages.map((stage) => {
              const Icon = stageIcon(stage.id)
              const selectable = canSelect(stage)
              return (
                <button
                  key={stage.id}
                  type="button"
                  className={`dd-stage dd-stage--${stage.status} ${selectedStage === stage.id ? 'is-selected' : ''} ${activeStage?.id === stage.id && !selectedStage ? 'is-focus' : ''}`}
                  disabled={!selectable}
                  onClick={() => onSelectStage(stage.id)}
                >
                  <span className="dd-stage__icon">
                    {stage.status === 'completed' ? <Check size={12} /> : stage.status === 'running' ? <Circle size={10} className="dd-pulse" /> : <Icon size={12} />}
                  </span>
                  <span className="dd-stage__body">
                    <span className="dd-stage__title">{stage.title}</span>
                    {(detailMode === 'technical' || stage.status === 'running' || selectedStage === stage.id) && (
                      <span className="dd-stage__desc">{stage.description}</span>
                    )}
                  </span>
                  <StatusPill status={stage.status} />
                </button>
              )
            })}
          </div>

          {reviewed && reviewedStatus !== 'pending' && (
            <div className="dd-focus-card">
              <p className="dd-focus-card__kicker">
                {selectedStage ? 'Stage detail' : 'Active focus'}
                <ChevronRight size={12} />
                {reviewed.title}
              </p>
              <p className="dd-focus-card__text">{reviewed.description}</p>
              {detailMode === 'technical' && phase === 'logs' && (
                <p className="dd-focus-card__note">Evidence: WARN pool 94% preceded ERROR connection timeout by ~1s.</p>
              )}
            </div>
          )}

          {report && (
            <article className="dd-report">
              <header>
                <Sparkles size={14} />
                <h3>{REPORT.title}</h3>
                <span className="dd-panel__tag">{REPORT.confidence}</span>
              </header>
              <p>
                <strong>Service:</strong> {REPORT.service}
              </p>
              <p>
                <strong>Impact:</strong> {REPORT.impact}
              </p>
              {(detailMode === 'technical' || done) && (
                <>
                  <p className="dd-report__label">Evidence</p>
                  <ul>
                    {REPORT.evidence.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </>
              )}
              <p>
                <strong>Probable cause:</strong> {REPORT.probableCause}
              </p>
              <p>
                <strong>Recommended action:</strong> {REPORT.recommendation}
              </p>
              <p className="dd-muted">Generated from simulated evidence — not a live analysis result.</p>
            </article>
          )}

          {done && (
            <div className="dd-summary">
              <p>Incident detected · Root cause investigated · Report prepared · Fix proposed · Validation simulated</p>
              <button type="button" className="dd-btn" onClick={replay}>
                <RotateCcw size={14} />
                Replay demo
              </button>
            </div>
          )}
        </section>

        <aside className={`dd-panel dd-panel--code ${mobileTab === 'code' ? 'is-mobile-active' : ''}`}>
          <div className="dd-panel__head">
            <FileCode2 size={14} />
            Code analysis / fix
            <span className="dd-panel__tag">fictional</span>
          </div>

          <p className="dd-code-path">checkout-service / processCheckout.ts</p>

          <pre className="dd-code">
            <code>
              {(diff ? CODE_DIFF : CODE_BEFORE).slice(0, diff ? CODE_DIFF.length : reveal).map((line) => (
                <span
                  key={`${line.n}-${line.text}`}
                  className={`dd-code__line ${line.kind === 'suspect' && suspect ? 'is-suspect' : ''} ${line.kind === 'add' ? 'is-add' : ''} ${line.kind === 'remove' ? 'is-remove' : ''}`}
                >
                  <span className="dd-code__n">{line.n}</span>
                  <span className="dd-code__t">{line.text || ' '}</span>
                </span>
              ))}
            </code>
          </pre>

          {diagnosis && (
            <div className="dd-diagnosis">
              <p className="dd-diagnosis__title">Probable root cause</p>
              <p>
                A database connection may not be released on the exception path, contributing to connection pool exhaustion.
              </p>
              <p className="dd-muted">Confidence: {REPORT.confidence}</p>
            </div>
          )}

          {diff && (
            <div className="dd-fix-cta">
              <p className="dd-fix-cta__label">Proposed fix — awaiting approval</p>
              <p className="dd-muted">Illustrative `finally` cleanup. No repository is modified.</p>
              <button type="button" className="dd-btn" onClick={() => setFixOpen(true)}>
                Review proposed fix
                <ChevronRight size={14} />
              </button>
              {elapsed >= 19000 && (
                <p className="dd-ok">
                  <Check size={13} /> Simulated validation passed
                </p>
              )}
            </div>
          )}
        </aside>
      </div>

      {fixOpen && (
        <div className="dd-modal" role="dialog" aria-modal="true" aria-labelledby="dd-fix-title">
          <div className="dd-modal__backdrop" onClick={() => setFixOpen(false)} />
          <div className="dd-modal__card">
            <header className="dd-modal__head">
              <h3 id="dd-fix-title">Review proposed fix</h3>
              <button type="button" className="dd-icon-btn" aria-label="Close" onClick={() => setFixOpen(false)}>
                <X size={14} />
              </button>
            </header>
            <p className="dd-muted">Illustrative change only — this demo does not create a GitHub pull request or deploy.</p>
            <pre className="dd-code dd-code--modal">
              <code>
                {CODE_DIFF.map((line) => (
                  <span key={`m-${line.n}-${line.text}`} className={`dd-code__line ${line.kind === 'add' ? 'is-add' : ''}`}>
                    <span className="dd-code__n">{line.n}</span>
                    <span className="dd-code__t">{line.text || ' '}</span>
                  </span>
                ))}
              </code>
            </pre>
            <dl className="dd-modal__dl">
              <dt>Why proposed</dt>
              <dd>{FIX_DETAIL.why}</dd>
              <dt>Expected effect</dt>
              <dd>{FIX_DETAIL.expected}</dd>
              <dt>Tests to run</dt>
              <dd>
                <ul>
                  {FIX_DETAIL.tests.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </dd>
              <dt>Human approval</dt>
              <dd>{FIX_DETAIL.approval}</dd>
            </dl>
            <button type="button" className="dd-btn" onClick={() => setFixOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
