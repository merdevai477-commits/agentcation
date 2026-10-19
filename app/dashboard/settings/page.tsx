'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { BiznizTopbar } from '@/components/bizniz/shell/topbar'
import { MotionIn } from '@/components/bizniz/motion-in'
import { readOnboardingProfile } from '@/lib/onboarding'

const THEME_KEY = 'agentication_bizniz_theme'

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const profile = readOnboardingProfile(user?.unsafeMetadata as Record<string, unknown>)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [notify, setNotify] = useState(true)
  const [saved, setSaved] = useState('')

  useEffect(() => {
    const t = localStorage.getItem(THEME_KEY)
    if (t === 'light' || t === 'dark') setTheme(t)
  }, [])

  function saveTheme(next: 'dark' | 'light') {
    setTheme(next)
    localStorage.setItem(THEME_KEY, next)
    document.documentElement.dataset.bzTheme = next
    setSaved('Appearance preference saved on this device.')
  }

  return (
    <>
      <MotionIn>
        <BiznizTopbar title="Settings" subtitle="Profile and workspace preferences." showNewAutomation={false} />
      </MotionIn>

      <div className="grid gap-4 lg:grid-cols-2">
        <MotionIn as="section" className="bz-card bz-glass space-y-3" delay={50}>
          <h2 className="text-sm font-semibold text-white">Profile</h2>
          {!isLoaded ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : (
            <>
              <Field label="Name" value={profile?.fullName || user?.fullName || '—'} />
              <Field
                label="Email"
                value={user?.primaryEmailAddress?.emailAddress || '—'}
              />
              <Field label="Company" value={profile?.companyName || '—'} />
              <Field label="Phone" value={profile?.phone || 'Not provided'} />
              <Field label="Service" value="Business Agents · Dev Bizniz" />
            </>
          )}
        </MotionIn>

        <MotionIn as="section" className="bz-card bz-glass space-y-4" delay={90}>
          <h2 className="text-sm font-semibold text-white">Appearance</h2>
          <p className="text-xs text-slate-500">Dark mode is the default for Dev Bizniz.</p>
          <div className="flex gap-2">
            <button
              type="button"
              className={`bz-btn ${theme === 'dark' ? 'bz-btn--primary' : 'bz-btn--ghost'}`}
              onClick={() => saveTheme('dark')}
            >
              Dark
            </button>
            <button
              type="button"
              className={`bz-btn ${theme === 'light' ? 'bz-btn--primary' : 'bz-btn--ghost'}`}
              onClick={() => saveTheme('light')}
            >
              Light
            </button>
          </div>
          {saved ? <p className="text-xs text-emerald-400">{saved}</p> : null}
        </MotionIn>

        <MotionIn as="section" className="bz-card bz-glass space-y-3" delay={130}>
          <h2 className="text-sm font-semibold text-white">Notifications</h2>
          <label className="flex items-center justify-between gap-3 text-sm text-slate-300">
            <span>Email me about important automation events</span>
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => {
                setNotify(e.target.checked)
                setSaved('Notification preference saved locally (demo).')
              }}
            />
          </label>
        </MotionIn>

        <MotionIn as="section" className="bz-card bz-glass space-y-2" delay={170}>
          <h2 className="text-sm font-semibold text-white">Connected account preferences</h2>
          <p className="text-xs leading-relaxed text-slate-500">
            Manage channel connections from Authenticate. Disconnect always asks for confirmation.
            Real provider tokens are not stored yet because connectors are not wired.
          </p>
        </MotionIn>
      </div>
    </>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 py-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  )
}
