'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Pause,
  Play,
  RotateCcw,
  Search,
  Stethoscope,
  Wrench,
} from 'lucide-react'
import {
  CODE_DIFF,
  DEMO_DURATION_MS,
  REPORT,
  metricsAt,
  phaseAt,
  phaseLabel,
  showDiff,
  showDiagnosis,
  sparklineAt,
  visibleLogs,
  type DemoPhase,
} from '@/lib/dave-doctor-demo/scenario'
import { useDaveTimeline } from './use-dave-timeline'

const STORY: Array<{
  phase: DemoPhase
  title: string
  body: string
  icon: typeof AlertTriangle
}> = [
  {
    phase: 'healthy',
    title: 'System healthy',
    body: 'checkout-service looks normal. Dave Doctor is watching.',
    icon: Check,
  },
  {
    phase: 'detect',
    title: 'Incident detected',
    body: 'HTTP 500 responses jump after a deploy. Investigation starts.',
    icon: AlertTriangle,
  },
  {
    phase: 'logs',
    title: 'Checking logs',
    body: 'Pool usage hits 94%, then connection timeouts appear.',
    icon: Search,
  },
  {
    phase: 'code',
    title: 'Reading the code',
    body: 'The error path may skip releasing a database connection.',
    icon: FileCode2,
  },
  {
    phase: 'report',
    title: 'Root cause report',
    body: 'Likely pool exhaustion from a missing cleanup on failure.',
    icon: AlertTriangle,
  },
  {
    phase: 'fix',
    title: 'Fix proposed',
    body: 'Add a finally block to release the connection. Needs human approval.',
    icon: Wrench,
  },
  {
    phase: 'verify',
    title: 'Validating',
    body: 'Simulated checks run. Error rate begins to fall.',
    icon: Check,
  },
  {
    phase: 'done',
    title: 'Recovery simulated',
    body: 'Detected → investigated → reported → fix proposed → validated.',
    icon: Check,
  },
]

function storyFor(phase: DemoPhase) {
  return STORY.find((s) => s.phase === phase) ?? STORY[0]
}

function MiniSpark({ values }: { values: number[] }) {
  const w = 140
  const h = 28
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(1, values.length - 1)) * w
      const y = h - 2 - Math.min(1, Math.max(0, v)) * (h - 4)
      return `${x},${y}`
    })
    .join(' ')
  return (
    <svg className="ddm-spark" viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <polyline fill="none" stroke="#f87171" strokeWidth="1.8" points={pts} />
    </svg>
  )
}

const STEP_ORDER: DemoPhase[] = ['detect', 'logs', 'code', 'report', 'fix', 'done']

function stepIndex(phase: DemoPhase) {
  if (phase === 'healthy') return -1
  if (phase === 'verify') return 4
  const i = STEP_ORDER.indexOf(phase)
  return i >= 0 ? i : phase === 'done' ? 5 : 0
}

export function DaveDoctorMobile() {
  const [reduced, setReduced] = useState(false)
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
    loop: true,
  })

  const metrics = useMemo(() => metricsAt(elapsed), [elapsed])
  const phase = useMemo(() => phaseAt(elapsed), [elapsed])
  const story = storyFor(phase)
  const Icon = story.icon
  const logs = useMemo(() => visibleLogs(elapsed), [elapsed])
  const keyLog = [...logs].reverse().find((l) => l.highlight) ?? logs.at(-1)
  const errorSpark = useMemo(() => sparklineAt(elapsed, 'error', 16), [elapsed])
  const diagnosis = showDiagnosis(elapsed)
  const diff = showDiff(elapsed)
  const activeStep = stepIndex(phase)

  useEffect(() => {
    if (!diff) setFixOpen(false)
  }, [diff])

  return (
    <div className="ddm" role="region" aria-label="Dave Doctor mobile simulated demo">
      <header className="ddm-top">
        <div className="ddm-id">
          <span className="ddm-avatar">
            <Stethoscope size={15} />
          </span>
          <div>
            <p className="ddm-name">Dave Doctor</p>
            <p className="ddm-sub">AI engineering agent · sim</p>
          </div>
        </div>
        <div className="ddm-controls">
          <button type="button" className="ddm-icon" onClick={togglePause} aria-label={paused ? 'Resume' : 'Pause'}>
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <button type="button" className="ddm-icon" onClick={replay} aria-label="Replay">
            <RotateCcw size={14} />
          </button>
        </div>
      </header>

      <div className="ddm-progress" aria-hidden>
        <div style={{ width: `${(elapsed / DEMO_DURATION_MS) * 100}%` }} />
      </div>

      <p className={`ddm-badge ddm-badge--${metrics.health}`}>
        <span className="ddm-badge__dot" />
        {phaseLabel(phase, true)}
      </p>

      <div className="ddm-metrics">
        <div>
          <span>Errors</span>
          <strong className={metrics.errorRate > 5 ? 'is-hot' : ''}>{metrics.errorRate.toFixed(1)}%</strong>
        </div>
        <div>
          <span>P95</span>
          <strong className={metrics.p95Ms > 600 ? 'is-hot' : ''}>{Math.round(metrics.p95Ms)}ms</strong>
        </div>
        <div>
          <span>Pool</span>
          <strong className={metrics.poolPct > 85 ? 'is-hot' : ''}>{Math.round(metrics.poolPct)}%</strong>
        </div>
      </div>
      <MiniSpark values={errorSpark} />

      <ol className="ddm-steps" aria-label="Investigation steps">
        {STEP_ORDER.map((id, i) => {
          const labels = ['Detect', 'Logs', 'Code', 'Report', 'Fix', 'Done']
          const state = i < activeStep ? 'done' : i === activeStep ? 'active' : 'todo'
          return (
            <li key={id} className={`ddm-step ddm-step--${state}`}>
              <span>{i < activeStep ? <Check size={10} /> : i + 1}</span>
              <em>{labels[i]}</em>
            </li>
          )
        })}
      </ol>

      <article className="ddm-card">
        <div className="ddm-card__icon">
          <Icon size={18} />
        </div>
        <div>
          <h3>{story.title}</h3>
          <p>{story.body}</p>
        </div>
      </article>

      {keyLog && phase !== 'healthy' && (
        <div className={`ddm-log ddm-log--${keyLog.level.toLowerCase()}`}>
          <span>{keyLog.level}</span>
          <p>{keyLog.message}</p>
        </div>
      )}

      {diagnosis && (
        <div className="ddm-cause">
          <p className="ddm-cause__label">Probable cause · simulated</p>
          <p>{REPORT.probableCause}</p>
        </div>
      )}

      {diff && (
        <div className="ddm-fix">
          <button type="button" className="ddm-fix__toggle" onClick={() => setFixOpen((v) => !v)}>
            <span>Proposed fix</span>
            {fixOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {fixOpen && (
            <div className="ddm-fix__body">
              <p>Release the DB connection in a `finally` block. No real PR is created.</p>
              <pre>
                <code>
                  {CODE_DIFF.filter((l) => l.kind === 'add' || l.n >= 19)
                    .slice(0, 6)
                    .map((l) => (
                      <span key={`${l.n}-${l.text}`} className={l.kind === 'add' ? 'is-add' : ''}>
                        {l.text || ' '}
                        {'\n'}
                      </span>
                    ))}
                </code>
              </pre>
            </div>
          )}
        </div>
      )}

      {done && (
        <button type="button" className="ddm-replay" onClick={replay}>
          <RotateCcw size={14} />
          Replay story
        </button>
      )}

      <p className="ddm-note">Interactive simulation — illustrative data only.</p>
    </div>
  )
}
