import Link from 'next/link'

export default function DocsNotFound() {
  return (
    <div className="docs-root grid min-h-screen place-items-center px-5">
      <div className="max-w-md text-center">
        <p className="eyebrow">Documentation</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Article not found</h1>
        <p className="mt-4 text-slate-400">That documentation page does not exist or may have moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/docs/welcome" className="fx-btn fx-btn--primary">
            <span>Browse docs</span>
          </Link>
          <Link href="/" className="fx-btn fx-btn--ghost">
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
