import type { DocArticle } from '../types'
import { gettingStartedArticles } from './getting-started'
import { developerArticles } from './developers'
import { businessArticles } from './businesses'
import { planArticles } from './plans'
import { integrationArticles } from './integrations'
import { trustArticles } from './trust'

export const ALL_ARTICLES: DocArticle[] = [
  ...gettingStartedArticles,
  ...developerArticles,
  ...businessArticles,
  ...planArticles,
  ...integrationArticles,
  ...trustArticles,
]

export {
  gettingStartedArticles,
  developerArticles,
  businessArticles,
  planArticles,
  integrationArticles,
  trustArticles,
}
