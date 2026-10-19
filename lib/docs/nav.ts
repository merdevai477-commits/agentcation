import type { CategoryId, L } from './types'

export type DocNavCategory = {
  id: CategoryId
  label: L
  slugs: string[]
}

export const CATEGORY_ORDER: CategoryId[] = [
  'getting-started',
  'developers',
  'businesses',
  'plans',
  'integrations',
  'trust',
]

export const DOC_NAV: DocNavCategory[] = [
  {
    id: 'getting-started',
    label: { en: 'Getting started', ar: 'البدء' },
    slugs: [
      'welcome',
      'what-is-agentication',
      'how-agentication-works',
      'choose-the-right-agent',
      'create-your-first-agent',
    ],
  },
  {
    id: 'developers',
    label: { en: 'Developers', ar: 'المطوّرون' },
    slugs: [
      'meet-dave-doctor',
      'what-dave-doctor-can-do',
      'connect-development-environment',
      'github-integration',
      'monitoring-and-incident-analysis',
      'code-fixes-and-pull-requests',
      'deployment-verification',
      'monitoring-coverage-and-operating-hours',
    ],
  },
  {
    id: 'businesses',
    label: { en: 'Businesses', ar: 'الأعمال' },
    slugs: [
      'meet-business-agents',
      'customer-support-automation',
      'messaging-channel-integrations',
      'website-integration',
      'business-knowledge-and-faqs',
      'customer-journeys-and-memory',
      'workflow-automation',
      'business-reports',
    ],
  },
  {
    id: 'plans',
    label: { en: 'Plans', ar: 'الخطط' },
    slugs: [
      'understanding-our-plans',
      'business-agent-plans',
      'developer-agent-plans',
      'coverage-hours-and-usage-limits',
      'choosing-the-right-plan',
      'pricing-and-billing-faqs',
    ],
  },
  {
    id: 'integrations',
    label: { en: 'Integrations', ar: 'الربط' },
    slugs: [
      'available-integrations',
      'connecting-an-integration',
      'permissions-and-access',
      'troubleshooting-integrations',
    ],
  },
  {
    id: 'trust',
    label: { en: 'Trust & support', ar: 'الثقة والدعم' },
    slugs: [
      'data-privacy',
      'security-and-permissions',
      'understanding-ai-limitations',
      'faq',
      'troubleshooting-common-problems',
      'contact-and-support',
    ],
  },
]

export function getCategoryLabel(categoryId: CategoryId): L {
  const cat = DOC_NAV.find((c) => c.id === categoryId)
  return cat?.label ?? { en: categoryId, ar: categoryId }
}
