'use client'

import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { pick, searchArticles, type Lang } from '@/lib/docs'
import { docsUi } from '@/lib/docs/ui'

export function DocsSearch({ lang, compact = false }: { lang: Lang; compact?: boolean }) {
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const results = useMemo(() => searchArticles(deferred, lang).slice(0, 8), [deferred, lang])
  const showPanel = open && deferred.trim().length > 0

  useEffect(() => {
    if (query.trim().length > 0) setOpen(true)
  }, [query])

  useEffect(() => {
    function onPointer(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={rootRef} className={`docs-search ${compact ? 'docs-search--compact' : ''}`}>
      <label className="docs-search__field">
        <Search size={16} aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onInput={(e) => {
            setQuery((e.target as HTMLInputElement).value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={pick(docsUi.searchPlaceholder, lang)}
          aria-label={pick(docsUi.searchPlaceholder, lang)}
          aria-controls={listId}
          aria-expanded={showPanel}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            className="docs-search__clear"
            onClick={() => {
              setQuery('')
              setOpen(false)
            }}
            aria-label="Clear"
          >
            <X size={14} />
          </button>
        )}
      </label>

      {showPanel && (
        <div id={listId} className="docs-search__panel" role="listbox" aria-label={pick(docsUi.results, lang)}>
          {results.length === 0 ? (
            <div className="docs-search__empty">
              <p>{pick(docsUi.searchEmpty, lang)}</p>
              <p className="docs-search__hint">{pick(docsUi.searchHint, lang)}</p>
            </div>
          ) : (
            <ul>
              {results.map(({ article, snippet }) => (
                <li key={article.slug}>
                  <Link
                    href={`/docs/${article.slug}`}
                    role="option"
                    onClick={() => {
                      setOpen(false)
                      setQuery('')
                    }}
                  >
                    <span className="docs-search__title">{pick(article.title, lang)}</span>
                    <span className="docs-search__snippet">{snippet}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
