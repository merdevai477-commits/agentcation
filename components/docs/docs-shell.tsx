'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { I18nProvider, LangSwitch, useI18n } from '@/components/i18n'
import {
  getAdjacentArticles,
  getArticle,
  getCategoryLabel,
  getNav,
  getToc,
  pick,
  type DocArticle,
  type FeatureStatus,
} from '@/lib/docs'
import { docsUi } from '@/lib/docs/ui'
import { DocsBlocks } from './docs-blocks'
import { DocsSearch } from './docs-search'

function StatusBadge({ status, lang }: { status: FeatureStatus; lang: 'en' | 'ar' }) {
  return <span className={`docs-badge docs-badge--${status}`}>{pick(docsUi.status[status], lang)}</span>
}

function DocsChrome({ article }: { article: DocArticle }) {
  const { lang, t } = useI18n()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = getNav(lang)
  const toc = getToc(article, lang)
  const { prev, next } = getAdjacentArticles(article.slug)
  const categoryLabel = pick(getCategoryLabel(article.category), lang)
  const rtl = lang === 'ar'
  const PrevIcon = rtl ? ArrowRight : ArrowLeft
  const NextIcon = rtl ? ArrowLeft : ArrowRight

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className="docs-root">
      <header className="docs-topbar">
        <div className="docs-topbar__inner">
          <div className="docs-topbar__brand">
            <button
              type="button"
              className="docs-icon-btn lg:hidden"
              aria-label={pick(menuOpen ? docsUi.closeMenu : docsUi.menu, lang)}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <BrandLogo />
            <span className="docs-topbar__divider" aria-hidden />
            <Link href="/docs" className="docs-topbar__docs">
              {pick(docsUi.eyebrow, lang)}
            </Link>
          </div>

          <div className="docs-topbar__search">
            <DocsSearch lang={lang} />
          </div>

          <div className="docs-topbar__actions">
            <LangSwitch />
            <a href="/" className="docs-link-quiet hidden md:inline">
              {pick(docsUi.backToSite, lang)}
            </a>
            <a href="/sign-up" className="fx-btn fx-btn--primary docs-cta">
              <span>{pick(docsUi.getStarted, lang)}</span>
            </a>
          </div>
        </div>
      </header>

      <div className="docs-layout">
        <aside className={`docs-sidebar ${menuOpen ? 'is-open' : ''}`}>
          <div className="docs-sidebar__mobile-search lg:hidden">
            <DocsSearch lang={lang} compact />
          </div>
          <nav aria-label={pick(docsUi.menu, lang)}>
            {nav.map((cat) => (
              <div key={cat.id} className="docs-nav-group">
                <p className="docs-nav-group__label">{cat.label}</p>
                <ul>
                  {cat.articles.map((item) => {
                    const active = item.slug === article.slug
                    return (
                      <li key={item.slug}>
                        <Link href={`/docs/${item.slug}`} className={active ? 'is-active' : undefined} aria-current={active ? 'page' : undefined}>
                          {item.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {menuOpen && <button type="button" className="docs-backdrop lg:hidden" aria-label={pick(docsUi.closeMenu, lang)} onClick={() => setMenuOpen(false)} />}

        <main className="docs-main">
          <div className="docs-article-wrap">
            <nav className="docs-breadcrumb" aria-label="Breadcrumb">
              <Link href="/docs">{pick(docsUi.breadcrumbDocs, lang)}</Link>
              <ChevronRight size={14} className="docs-breadcrumb__sep" aria-hidden />
              <span>{categoryLabel}</span>
              <ChevronRight size={14} className="docs-breadcrumb__sep" aria-hidden />
              <span aria-current="page">{pick(article.title, lang)}</span>
            </nav>

            <header className="docs-article-hero">
              {article.status && <StatusBadge status={article.status} lang={lang} />}
              <h1>{pick(article.title, lang)}</h1>
              <p>{pick(article.description, lang)}</p>
            </header>

            <DocsBlocks blocks={article.blocks} lang={lang} />

            {article.related && article.related.length > 0 && (
              <section className="docs-related">
                <h2 className="docs-related__title">{pick(docsUi.related, lang)}</h2>
                <div className="docs-related__grid">
                  {article.related.map((slug) => {
                    const related = getArticle(slug)
                    if (!related) return null
                    return (
                      <Link key={slug} href={`/docs/${slug}`} className="docs-related__card">
                        <span>{pick(related.title, lang)}</span>
                        <p>{pick(related.description, lang)}</p>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}

            <nav className="docs-pager" aria-label="Article pagination">
              {prev ? (
                <Link href={`/docs/${prev.slug}`} className="docs-pager__link">
                  <span className="docs-pager__meta">
                    <PrevIcon size={14} />
                    {pick(docsUi.previous, lang)}
                  </span>
                  <strong>{pick(prev.title, lang)}</strong>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/docs/${next.slug}`} className="docs-pager__link docs-pager__link--next">
                  <span className="docs-pager__meta">
                    {pick(docsUi.next, lang)}
                    <NextIcon size={14} />
                  </span>
                  <strong>{pick(next.title, lang)}</strong>
                </Link>
              ) : (
                <span />
              )}
            </nav>
          </div>

          <aside className="docs-toc" aria-label={pick(docsUi.onThisPage, lang)}>
            {toc.length > 0 && (
              <>
                <p className="docs-toc__label">{pick(docsUi.onThisPage, lang)}</p>
                <ul>
                  {toc.map((entry) => (
                    <li key={entry.id} className={entry.level === 3 ? 'is-h3' : undefined}>
                      <a href={`#${entry.id}`}>{entry.text}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="docs-toc__promo">
              <p>{pick(docsUi.tagline, lang)}</p>
              <a href="/#platform">{pick(docsUi.exploreProduct, lang)}</a>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

export function DocsShell({ article }: { article: DocArticle }) {
  return (
    <I18nProvider>
      <DocsChrome article={article} />
    </I18nProvider>
  )
}
