'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import type { Key } from 'react-aria-components'
import { Chip, Label, ListBox, SearchField as HeroSearchField, Select } from '@heroui/react'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import type { ConnectionExample, EvidenceKind, FixStage } from '@/lib/dave/fixtures'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { cn } from '@/lib/utils'

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'ok' | 'warn' | 'bad' | 'info' | 'violet'
}) {
  const color =
    tone === 'ok'
      ? 'success'
      : tone === 'warn'
        ? 'warning'
        : tone === 'bad'
          ? 'danger'
          : tone === 'info' || tone === 'violet'
            ? 'accent'
            : 'default'
  return (
    <Chip color={color} size="sm" variant="soft">
      {children}
    </Chip>
  )
}

export function SampleTag() {
  const { lang } = useBiznizLang()
  return (
    <Chip color="accent" size="sm" variant="soft">
      {doctorCopy(lang).sample}
    </Chip>
  )
}

export function EvidenceTag({ kind }: { kind: EvidenceKind }) {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  return <Badge tone={kind === 'confirmed' ? 'ok' : 'violet'}>{kind === 'confirmed' ? copy.confirmed : copy.hypothesis}</Badge>
}

export function connectionLabel(connection: ConnectionExample) {
  if (connection === 'sample-connected') return 'Example: connected'
  if (connection === 'sample-degraded') return 'Example: degraded'
  return 'Example: disconnected'
}

export function severityTone(severity: 'critical' | 'high' | 'medium' | 'low') {
  if (severity === 'critical') return 'bad' as const
  if (severity === 'high') return 'warn' as const
  if (severity === 'medium') return 'info' as const
  return 'ok' as const
}

export function healthTone(health: string) {
  if (health === 'healthy' || health === 'operational' || health === 'succeeded' || health === 'passed') return 'ok' as const
  if (health === 'degraded' || health === 'pending' || health === 'running') return 'warn' as const
  if (health === 'down' || health === 'failed' || health === 'outage') return 'bad' as const
  return 'neutral' as const
}

export function connectionTone(connection: ConnectionExample): 'ok' | 'warn' | 'bad' {
  if (connection === 'sample-connected') return 'ok'
  if (connection === 'sample-degraded') return 'warn'
  return 'bad'
}

const FIX_ORDER: FixStage[] = ['proposed', 'approved', 'applied', 'verified']

export function FixStepper({ stage }: { stage: FixStage }) {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  const current = FIX_ORDER.indexOf(stage)
  return (
    <ol className="dv-stepper">
      {FIX_ORDER.map((item, index) => {
        const state = stage === 'none' ? 'wait' : index < current ? 'done' : index === current ? 'now' : 'wait'
        return (
          <li key={item} className={cn('dv-stepper__item', `is-${state}`)}>
            <span>{index + 1}</span>
            {copy.fix[item]}
          </li>
        )
      })}
    </ol>
  )
}

export function TabBar<T extends string>({
  label,
  value,
  onChange,
  tabs,
}: {
  label: string
  value: T
  onChange: (next: T) => void
  tabs: { id: T; label: string }[]
}) {
  return (
    <div className="dv-tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => {
        const selected = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={cn('dv-tab', selected && 'is-active')}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export function DoctorSelect({
  label,
  value,
  onChange,
  options,
  className,
  fullWidth,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  options: { value: string; label: string }[]
  className?: string
  fullWidth?: boolean
}) {
  return (
    <Select
      aria-label={label}
      className={cn('dv-hu-select', className)}
      fullWidth={fullWidth}
      value={value}
      variant="secondary"
      onChange={(key: Key | null) => {
        if (key != null) onChange(String(key))
      }}
    >
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (next: string) => void
  placeholder?: string
}) {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  return (
    <HeroSearchField className="dv-hu-search" name="search" value={value} onChange={onChange}>
      <Label>{copy.search}</Label>
      <HeroSearchField.Group>
        <HeroSearchField.SearchIcon />
        <HeroSearchField.Input placeholder={placeholder} />
        <HeroSearchField.ClearButton />
      </HeroSearchField.Group>
    </HeroSearchField>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  options: { value: string; label: string }[]
}) {
  return <DoctorSelect label={label} value={value} onChange={onChange} options={options} className="dv-hu-select--filter" />
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const { lang } = useBiznizLang()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  const copy = doctorCopy(lang)
  return (
    <div className="dv-modal-root">
      <button type="button" className="dv-modal-backdrop" aria-label={copy.close} onClick={onClose} />
      <div ref={ref} className="dv-modal" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1}>
        <header className="dv-modal__head">
          <h2>{title}</h2>
          <button type="button" className="dv-btn dv-btn--ghost" onClick={onClose}>
            {copy.close}
          </button>
        </header>
        {children}
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
}) {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="dv-prose">{body}</p>
      <div className="dv-modal__actions">
        <button type="button" className="dv-btn dv-btn--ghost" onClick={onClose}>
          {copy.cancel}
        </button>
        <button type="button" className="dv-btn dv-btn--primary" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export function StateBlock({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="dv-state">
      <h2>{title}</h2>
      <p>{body}</p>
      {action}
    </div>
  )
}

export function LoadingState() {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang).states
  return (
    <div className="dv-state" role="status" aria-busy="true">
      <h2>{copy.loading}</h2>
      <p>{copy.loadingBody}</p>
      <div className="dv-skel-grid" aria-hidden>
        <span className="dv-skel" />
        <span className="dv-skel" />
        <span className="dv-skel" />
      </div>
    </div>
  )
}

export function SeriesChart({
  title,
  unit,
  points,
}: {
  title: string
  unit: string
  points: number[]
}) {
  if (points.length === 0) return null
  const width = 360
  const height = 96
  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const coords = points.map((point, index) => {
    const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width
    const y = height - 8 - ((point - min) / span) * (height - 16)
    return [x, y] as const
  })
  const pointsAttr = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const last = points[points.length - 1] ?? 0
  const peak = max
  return (
    <figure className="dv-chart dv-card dv-glass">
      <figcaption>
        <span>{title}</span>
        <strong>
          {last}
          {unit}
        </strong>
      </figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${title}. Latest ${last}${unit}. Peak ${peak}${unit}.`}>
        <polyline points={pointsAttr} fill="none" />
      </svg>
      <p>Sample series · peak {peak}{unit}</p>
    </figure>
  )
}

export function Meter({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className="dv-meter">
      <div>
        <span>{label}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="dv-meter__track" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function Panel({
  id,
  title,
  action,
  children,
  className,
}: {
  id?: string
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('dv-card dv-glass dv-anchor', className)}>
      <div className="dv-card__head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

export function MissingRecord({ href, label }: { href: string; label: string }) {
  const { lang } = useBiznizLang()
  const copy = doctorCopy(lang)
  return (
    <StateBlock
      title={copy.missing}
      body={copy.technical}
      action={
        <Link href={href} className="dv-btn dv-btn--ghost">
          {label}
        </Link>
      }
    />
  )
}
