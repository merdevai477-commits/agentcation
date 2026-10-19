import Link from 'next/link'
import { BrandLogo } from '@/components/brand-logo'
import { Code2 } from 'lucide-react'

export function DaveDoctorWorkspace({
  name,
  companyName,
}: {
  name: string
  companyName?: string
}) {
  return (
    <main className="min-h-screen bg-black text-slate-100">
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-40" aria-hidden />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-5 py-6">
        <BrandLogo />
        <Link href="/" className="text-sm text-slate-400 hover:text-white">
          Back to site
        </Link>
      </header>
      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-20 pt-8">
        <p className="eyebrow inline-flex items-center gap-2">
          <Code2 size={12} className="text-sky-400" />
          DAVE DOCTOR
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Welcome, {name}.</h1>
        <p className="mt-4 max-w-xl text-slate-400">
          {companyName ? (
            <>
              Workspace for <span className="text-slate-200">{companyName}</span>. Dave Doctor is a
              separate developer service — the Dev Bizniz operations console is for Business Agents.
            </>
          ) : (
            <>Dave Doctor workspace is separate from the Business Agents (Dev Bizniz) console.</>
          )}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/#developers" className="fx-btn fx-btn--primary">
            Explore Dave Doctor
          </Link>
          <Link href="/docs/meet-dave-doctor" className="fx-btn fx-btn--ghost">
            Read docs
          </Link>
        </div>
      </section>
    </main>
  )
}
