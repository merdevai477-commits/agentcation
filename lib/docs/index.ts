import { ALL_ARTICLES } from './articles'
import { CATEGORY_ORDER, DOC_NAV, getCategoryLabel } from './nav'
import type { CategoryId, DocArticle, DocBlock, Lang, L } from './types'

export type { Lang, L, CategoryId, DocArticle, DocBlock, FeatureStatus } from './types'
export { CATEGORY_ORDER, DOC_NAV, getCategoryLabel }

export function pick(l: L, lang: Lang): string {
  return l[lang]
}

export function getAllArticles(): DocArticle[] {
  return ALL_ARTICLES
}

export function getArticle(slug: string): DocArticle | undefined {
  return ALL_ARTICLES.find((a) => a.slug === slug)
}

export type DocNavItem = {
  slug: string
  title: string
  category: CategoryId
}

export type DocNavCategoryView = {
  id: CategoryId
  label: string
  articles: DocNavItem[]
}

export function getNav(lang: Lang): DocNavCategoryView[] {
  return DOC_NAV.map((cat) => ({
    id: cat.id,
    label: pick(cat.label, lang),
    articles: cat.slugs.map((slug) => {
      const article = getArticle(slug)
      return {
        slug,
        title: article ? pick(article.title, lang) : slug,
        category: cat.id,
      }
    }),
  }))
}

function normalizeQuery(q: string): string[] {
  return q
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

function blockToPlainText(block: DocBlock, lang: Lang): string {
  switch (block.type) {
    case 'p':
    case 'callout':
      return pick(block.text, lang)
    case 'h2':
    case 'h3':
      return pick(block.text, lang)
    case 'ul':
    case 'ol':
      return block.items.map((i) => pick(i, lang)).join(' ')
    case 'steps':
      return block.items.map((s) => `${pick(s.title, lang)} ${pick(s.body, lang)}`).join(' ')
    case 'cards':
      return block.items.map((c) => `${pick(c.title, lang)} ${pick(c.body, lang)}`).join(' ')
    default:
      return ''
  }
}

export function articleSearchText(article: DocArticle, lang: Lang): string {
  const parts = [
    pick(article.title, lang),
    pick(article.description, lang),
    article.status ?? '',
    ...article.blocks.map((b) => blockToPlainText(b, lang)),
  ]
  return parts.join('\n').toLowerCase()
}

export type SearchResult = {
  article: DocArticle
  score: number
  snippet: string
}

function snippetAround(haystack: string, term: string, lang: Lang, article: DocArticle): string {
  const idx = haystack.indexOf(term.toLowerCase())
  if (idx === -1) {
    return pick(article.description, lang)
  }
  const start = Math.max(0, idx - 40)
  const end = Math.min(haystack.length, idx + term.length + 80)
  const slice = haystack.slice(start, end).replace(/\s+/g, ' ').trim()
  return (start > 0 ? '…' : '') + slice + (end < haystack.length ? '…' : '')
}

export function searchArticles(query: string, lang: Lang): SearchResult[] {
  const terms = normalizeQuery(query)
  if (terms.length === 0) return []

  const results: SearchResult[] = []

  for (const article of ALL_ARTICLES) {
    const text = articleSearchText(article, lang)
    let score = 0
    for (const term of terms) {
      if (pick(article.title, lang).toLowerCase().includes(term)) score += 4
      if (pick(article.description, lang).toLowerCase().includes(term)) score += 2
      const count = text.split(term).length - 1
      score += count
    }
    if (score > 0) {
      const primary = terms[0]
      results.push({
        article,
        score,
        snippet: snippetAround(text, primary, lang, article),
      })
    }
  }

  return results.sort((a, b) => b.score - a.score)
}

export type AdjacentArticles = {
  prev?: DocArticle
  next?: DocArticle
}

export function getAdjacentArticles(slug: string): AdjacentArticles {
  const ordered: DocArticle[] = []
  for (const cat of DOC_NAV) {
    for (const s of cat.slugs) {
      const article = getArticle(s)
      if (article) ordered.push(article)
    }
  }
  const idx = ordered.findIndex((a) => a.slug === slug)
  if (idx === -1) return {}
  return {
    prev: idx > 0 ? ordered[idx - 1] : undefined,
    next: idx < ordered.length - 1 ? ordered[idx + 1] : undefined,
  }
}

/** @deprecated alias */
export const getAdjacent = getAdjacentArticles

export type TocEntry = { id: string; text: string; level: 2 | 3 }

export function getToc(article: DocArticle, lang: Lang): TocEntry[] {
  return article.blocks
    .filter((b): b is Extract<DocBlock, { type: 'h2' } | { type: 'h3' }> => b.type === 'h2' || b.type === 'h3')
    .map((b) => ({ id: b.id, text: pick(b.text, lang), level: b.type === 'h3' ? 3 : 2 }))
}
