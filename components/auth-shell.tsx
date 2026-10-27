import Image from 'next/image'
import Link from 'next/link'

type AuthShellProps = {
  children: React.ReactNode
  eyebrow?: string
  description?: string
  wide?: boolean
}

export function AuthShell({
  children,
  eyebrow = 'AGENTIC ACCESS LAYER',
  description = 'Secure entry into your agent workspace — automation with identity.',
  wide = false,
}: AuthShellProps) {
  return (
    <main className="auth-shell relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="auth-shell__grid" aria-hidden />
      <div className="auth-shell__orb auth-shell__orb--violet" aria-hidden />
      <div className="auth-shell__orb auth-shell__orb--cyan" aria-hidden />
      <div className="auth-shell__orb auth-shell__orb--fuchsia" aria-hidden />
      <div className="auth-shell__beam" aria-hidden />

      <div className={`relative z-10 w-full ${wide ? 'max-w-[520px]' : 'max-w-[440px]'}`}>
        <div className="auth-glass relative overflow-hidden rounded-[1.75rem] p-[1px]">
          <div className="auth-glass__shine" aria-hidden />
          <div className="auth-glass__inner relative rounded-[1.7rem] px-5 pb-7 pt-8 sm:px-8">
            <div className="mb-6 flex flex-col items-center text-center">
              <Link href="/" className="group relative inline-flex flex-col items-center">
                <span className="auth-logo-glow absolute inset-0 -z-10 rounded-full blur-2xl" />
                <Image
                  src="/logo.png"
                  alt="Agentication"
                  width={200}
                  height={200}
                  priority
                  className="h-[5.75rem] w-auto object-contain mix-blend-lighten transition duration-500 group-hover:scale-[1.03]"
                />
              </Link>
              <p className="mt-3 text-[10px] font-semibold tracking-[0.28em] text-violet-200/85">
                {eyebrow}
              </p>
              <p className="mt-2 max-w-[20rem] text-[13px] leading-5 text-slate-400">
                {description}
              </p>
            </div>

            <div className="auth-clerk">{children}</div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] tracking-wide text-slate-500">
          Protected identity · Agentic trust boundary
        </p>
      </div>
    </main>
  )
}
