import { currentUser } from '@clerk/nextjs/server'
import { HomeDashboard } from '@/components/bizniz/home-dashboard'
import { readOnboardingProfile } from '@/lib/onboarding'

export const metadata = {
  title: 'Home',
}

export default async function DashboardHomePage() {
  const user = await currentUser()
  const profile = readOnboardingProfile(user?.unsafeMetadata as Record<string, unknown>)
  const name =
    profile?.fullName ||
    user?.firstName ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'there'

  return <HomeDashboard userName={name} />
}
