import { SignUp } from '@clerk/nextjs'
import { AuthShell } from '@/components/auth-shell'
import { clerkAppearance } from '@/lib/clerk-appearance'

export default function SignUpPage() {
  return (
    <AuthShell eyebrow="CREATE ACCESS · AGENT WORKSPACE">
      <SignUp
        appearance={{
          ...clerkAppearance,
          elements: {
            ...clerkAppearance.elements,
            logoBox: 'hidden',
            logoImage: 'hidden',
          },
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/onboarding"
      />
    </AuthShell>
  )
}
