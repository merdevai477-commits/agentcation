export type Lang = 'en' | 'ar'
export type L = { en: string; ar: string }
export type CategoryId =
  | 'getting-started'
  | 'developers'
  | 'businesses'
  | 'plans'
  | 'integrations'
  | 'trust'
export type FeatureStatus = 'available' | 'prototype' | 'planned'

export type DocBlock =
  | { type: 'p'; text: L }
  | { type: 'h2'; id: string; text: L }
  | { type: 'h3'; id: string; text: L }
  | { type: 'ul'; items: L[] }
  | { type: 'ol'; items: L[] }
  | { type: 'callout'; variant: 'info' | 'warning' | 'planned' | 'tip'; title?: L; text: L }
  | { type: 'steps'; items: { title: L; body: L }[] }
  | { type: 'cards'; items: { title: L; body: L; href: string }[] }

export type DocArticle = {
  slug: string
  category: CategoryId
  title: L
  description: L
  status?: FeatureStatus
  blocks: DocBlock[]
  related?: string[]
}
