export type Currency = 'USD' | 'EGP'
export type ProductLine = 'business' | 'developer'
export type PlanId = 'free' | 'pro' | 'plus' | 'enterprise'
export type FeatureStatus = 'available' | 'prototype' | 'planned' | 'custom'

export type Localized = { en: string; ar: string }

export type PriceDisplay = {
  USD: number | null
  EGP: number | null
}

export type QuotaValue = number | 'custom' | 'unlimited'

export type PlanQuotas = {
  /** Distinct countable units for this product line */
  activeAgents?: QuotaValue
  connectedChannels?: QuotaValue
  monthlyConversations?: QuotaValue
  teamMembers: QuotaValue
  connectedProjects?: QuotaValue
  githubRepositories?: QuotaValue
  /** Proposed monitoring window in hours per day; null = not offered on plan */
  coverageHoursPerDay?: QuotaValue | null
}

export type IntegrationEntitlement = {
  id: string
  name: Localized
  status: FeatureStatus
  /** Which plans include a connection slot for this integration */
  plans: PlanId[]
  consumesConnectionSlot: boolean
  access: 'read' | 'write' | 'read_write' | 'n_a'
  requiresThirdPartySubscription: boolean
  requiresUserAuthorization: boolean
  notes?: Localized
}

export type PlanFeatureRow = {
  id: string
  label: Localized
  tooltip?: Localized
  /** Display value per plan */
  values: Record<PlanId, Localized | boolean | string>
  status?: FeatureStatus
}

export type PlanDefinition = {
  id: PlanId
  name: Localized
  idealFor: Localized
  price: PriceDisplay
  billingPeriod: 'monthly'
  recommended?: boolean
  quotas: PlanQuotas
  /** 5–7 decision features shown on the card */
  highlights: Array<{
    label: Localized
    status?: FeatureStatus
  }>
  cta: {
    label: Localized
    href: string
  }
}

export type PricingFaq = {
  id: string
  question: Localized
  answer: Localized
}

export type ProductPricing = {
  id: ProductLine
  title: Localized
  subtitle: Localized
  recommendedPlan: PlanId
  conversationDefinition?: Localized
  coverageDefinition?: Localized
  plans: PlanDefinition[]
  comparison: PlanFeatureRow[]
  integrations: IntegrationEntitlement[]
  faqs: PricingFaq[]
  enforcementNote: Localized
}

export type PricingConfig = {
  version: string
  disclaimer: Localized
  currencyNote: Localized
  billingNote: Localized
  products: Record<ProductLine, ProductPricing>
}
