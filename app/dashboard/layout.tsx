import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { BiznizAppShell } from '@/components/bizniz/shell/app-shell'
import { DaveAppShell } from '@/components/dave/shell/app-shell'
import { isOnboardingComplete, readOnboardingProfile } from '@/lib/onboarding'

export const metadata = {
  title: {
    default: 'Dashboard',
    template: '%s — Agentication',
  },
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await currentUser()
  const meta = user?.unsafeMetadata as Record<string, unknown> | undefined
  if (!isOnboardingComplete(meta)) redirect('/onboarding')

  const profile = readOnboardingProfile(meta)
  const name =
    profile?.fullName ||
    user?.firstName ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'there'

  if (profile?.productPath === 'dave_doctor') {
    return (
      <DaveAppShell userName={name} companyName={profile.companyName}>
        {children}
      </DaveAppShell>
    )
  }

  return (
    <BiznizAppShell userName={name} companyName={profile?.companyName}>
      {children}
    </BiznizAppShell>
  )
}
