'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  Code2,
  Phone,
  UserRound,
} from 'lucide-react'
import type { ProductPath } from '@/lib/onboarding'
import { cn } from '@/lib/utils'

type StepId = 'name' | 'company' | 'phone' | 'product'

const STEPS: StepId[] = ['name', 'company', 'phone', 'product']

type Props = {
  initialName?: string
}

export function OnboardingWizard({ initialName = '' }: Props) {
  const router = useRouter()
  const { user, isLoaded } = useUser()
  const [stepIndex, setStepIndex] = useState(0)
  const [fullName, setFullName] = useState(initialName)
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [productPath, setProductPath] = useState<ProductPath | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const step = STEPS[stepIndex]
  const progress = ((stepIndex + 1) / STEPS.length) * 100

  const canContinue = useMemo(() => {
    if (step === 'name') return fullName.trim().length >= 2
    if (step === 'company') return companyName.trim().length >= 2
    if (step === 'phone') return true
    if (step === 'product') return productPath !== null
    return false
  }, [step, fullName, companyName, productPath])

  function next() {
    setError('')
    if (!canContinue) {
      setError(
        step === 'name'
          ? 'Please enter your name.'
          : step === 'company'
            ? 'Please enter your brand or company name.'
            : step === 'product'
              ? 'Required: choose one service — Dave Doctor or Business Agents.'
              : '',
      )
      return
    }
    if (stepIndex < STEPS.length - 1) {
      setStepIndex((i) => i + 1)
      return
    }
    void finish()
  }

  function back() {
    setError('')
    if (stepIndex > 0) setStepIndex((i) => i - 1)
  }

  async function finish() {
    if (!user) return
    if (!productPath) {
      setError('You must choose one service: Dave Doctor or Business Agents.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const nameParts = fullName.trim().split(/\s+/)
      const firstName = nameParts[0] ?? fullName.trim()
      const lastName = nameParts.slice(1).join(' ') || undefined

      await user.update({
        firstName,
        lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          fullName: fullName.trim(),
          companyName: companyName.trim(),
          phone: phone.trim() || undefined,
          productPath,
          onboardingComplete: true,
          completedAt: new Date().toISOString(),
        },
      })

      router.replace('/dashboard')
      router.refresh()
    } catch {
      setError('Could not save your profile. Please try again.')
      setSaving(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-[20rem] items-center justify-center text-sm text-slate-400">
        Loading…
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-[11px] font-medium tracking-wide text-slate-400">
          <span>
            Step {stepIndex + 1} of {STEPS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {step === 'name' && (
        <StepFrame
          icon={<UserRound size={18} />}
          title="What should we call you?"
          body="Your display name across Agentication."
        >
          <label className="ob-field">
            <span>Full name</span>
            <input
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && next()}
              placeholder="e.g. Sara Hassan"
              className="ob-input"
            />
          </label>
        </StepFrame>
      )}

      {step === 'company' && (
        <StepFrame
          icon={<Building2 size={18} />}
          title="Brand or company?"
          body="We’ll use this as your workspace organization name."
        >
          <label className="ob-field">
            <span>Brand / company name</span>
            <input
              autoFocus
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && next()}
              placeholder="e.g. Acme Commerce"
              className="ob-input"
            />
          </label>
        </StepFrame>
      )}

      {step === 'phone' && (
        <StepFrame
          icon={<Phone size={18} />}
          title="Phone number"
          body="Optional — for account recovery and important updates only."
        >
          <label className="ob-field">
            <span>
              Phone <em className="not-italic text-slate-500">(optional)</em>
            </span>
            <input
              autoFocus
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && next()}
              placeholder="+20 1X XXX XXXX"
              className="ob-input"
            />
          </label>
          <button type="button" className="ob-skip" onClick={() => { setPhone(''); next() }}>
            Skip for now
          </button>
        </StepFrame>
      )}

      {step === 'product' && (
        <StepFrame
          icon={<Check size={18} />}
          title="Choose your service"
          body="Required. Dave Doctor and Business Agents are two separate services — pick exactly one to continue."
        >
          <p className="mb-3 rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-100/90">
            This choice is mandatory. Your workspace will be set up for the selected service only.
          </p>
          <div className="grid gap-3" role="radiogroup" aria-label="Service selection" aria-required="true">
            <ProductCard
              selected={productPath === 'dave_doctor'}
              onSelect={() => setProductPath('dave_doctor')}
              icon={<Code2 size={20} />}
              title="Dave Doctor"
              subtitle="Developer service — engineering agents"
              points={['Incidents & logs', 'Code review & PRs', 'Deploy monitoring']}
            />
            <ProductCard
              selected={productPath === 'business'}
              onSelect={() => setProductPath('business')}
              icon={<BriefcaseBusiness size={20} />}
              title="Business Agents"
              subtitle="Business service — customer & ops agents"
              points={['Support chat', 'Knowledge & FAQs', 'Lead qualification']}
            />
          </div>
        </StepFrame>
      )}

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

      <div className="mt-7 flex items-center justify-between gap-3">
        <button
          type="button"
          className="ob-btn ob-btn--ghost"
          onClick={back}
          disabled={stepIndex === 0 || saving}
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <button
          type="button"
          className="ob-btn ob-btn--primary"
          onClick={next}
          disabled={saving || !isLoaded || !canContinue}
        >
          {saving ? 'Saving…' : step === 'product' ? 'Finish setup' : 'Continue'}
          {!saving && <ArrowRight size={15} />}
        </button>
      </div>
    </div>
  )
}

function StepFrame({
  icon,
  title,
  body,
  children,
}: {
  icon: ReactNode
  title: string
  body: string
  children: ReactNode
}) {
  return (
    <div>
      <div className="mb-5 flex items-start gap-3">
        <span className="inline-flex rounded-xl border border-violet-400/25 bg-violet-500/10 p-2.5 text-violet-200">
          {icon}
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h1>
          <p className="mt-1 text-sm leading-relaxed text-slate-400">{body}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function ProductCard({
  selected,
  onSelect,
  icon,
  title,
  subtitle,
  points,
}: {
  selected: boolean
  onSelect: () => void
  icon: ReactNode
  title: string
  subtitle: string
  points: string[]
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'rounded-2xl border p-4 text-start transition',
        selected
          ? 'border-cyan-400/45 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]'
          : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'inline-flex rounded-lg border p-2',
            selected
              ? 'border-cyan-400/30 bg-black/40 text-cyan-300'
              : 'border-white/10 bg-black/30 text-slate-300',
          )}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-white">{title}</p>
            <span
              className={cn(
                'flex size-5 items-center justify-center rounded-full border',
                selected
                  ? 'border-cyan-300 bg-cyan-400 text-black'
                  : 'border-white/20 text-transparent',
              )}
            >
              <Check size={12} strokeWidth={3} />
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {points.map((p) => (
              <li
                key={p}
                className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] text-slate-300"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  )
}
