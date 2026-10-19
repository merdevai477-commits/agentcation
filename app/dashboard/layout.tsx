import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { BiznizAppShell } from '@/components/bizniz/shell/app-shell'
import { isOnboardingComplete, readOnboardingProfile } from '@/lib/onboarding'
import { DaveDoctorWorkspace } from '@/components/bizniz/dave-placeholder'

export const metadata = {
  title: {
    default: 'Dev Bizniz',
    template: '%s — Dev Bizniz',
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

  // Dave Doctor is a separate service — keep a dedicated simple workspace for now.
  if (profile?.productPath === 'dave_doctor') {
    return <DaveDoctorWorkspace name={name} companyName={profile.companyName} />
  }

  return (
    <BiznizAppShell userName={name} companyName={profile?.companyName}>
      {children}
    </BiznizAppShell>
  )
}
