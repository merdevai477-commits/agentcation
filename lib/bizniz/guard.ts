import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { readOnboardingProfile } from '@/lib/onboarding'

/** Business Agents pages — Dave Doctor users are sent back to their home. */
export async function requireBusinessPath() {
  const user = await currentUser()
  const profile = readOnboardingProfile(user?.unsafeMetadata as Record<string, unknown>)
  if (!profile) redirect('/onboarding')
  if (profile.productPath === 'dave_doctor') redirect('/dashboard')
  return profile
}
