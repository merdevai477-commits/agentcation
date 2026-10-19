import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth-shell'
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard'
import { isOnboardingComplete } from '@/lib/onboarding'

export const metadata = {
  title: 'Welcome — Agentication',
  description: 'Set up your Agentication workspace.',
}

export default async function OnboardingPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-up')

  const user = await currentUser()
  if (isOnboardingComplete(user?.unsafeMetadata as Record<string, unknown>)) {
    redirect('/dashboard')
  }

  const initialName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.fullName ||
    ''

  return (
    <AuthShell
      eyebrow="ONBOARDING · WORKSPACE SETUP"
      description="Complete setup and choose one service — Dave Doctor or Business Agents."
      wide
    >
      <OnboardingWizard initialName={initialName} />
    </AuthShell>
  )
}
