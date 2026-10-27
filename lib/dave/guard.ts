import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { readOnboardingProfile, type ProductPath } from '@/lib/onboarding'

export async function requireProductPath(expected: ProductPath) {
  const user = await currentUser()
  const profile = readOnboardingProfile(user?.unsafeMetadata as Record<string, unknown>)
  if (!profile) redirect('/onboarding')
  if (profile.productPath !== expected) {
    redirect('/dashboard')
  }
  return {
    user,
    profile,
    name:
      profile.fullName ||
      user?.firstName ||
      user?.fullName ||
      user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
      'there',
  }
}
