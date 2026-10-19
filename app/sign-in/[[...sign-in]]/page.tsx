import { SignIn } from '@clerk/nextjs'
import { AuthShell } from '@/components/auth-shell'
import { clerkAppearance } from '@/lib/clerk-appearance'

export default function SignInPage() {
  return (
    <AuthShell eyebrow="SIGN IN · AGENT WORKSPACE">
      <SignIn
        appearance={{
          ...clerkAppearance,
          elements: {
            ...clerkAppearance.elements,
            // Logo already shown in AuthShell — avoid duplicate mark inside Clerk header
            logoBox: 'hidden',
            logoImage: 'hidden',
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/onboarding"
      />
    </AuthShell>
  )
}
