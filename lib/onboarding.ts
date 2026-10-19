export type ProductPath = 'dave_doctor' | 'business'

export type OnboardingProfile = {
  fullName: string
  companyName: string
  phone?: string
  productPath: ProductPath
  completedAt: string
  onboardingComplete: true
}

export type OnboardingDraft = {
  fullName: string
  companyName: string
  phone: string
  productPath: ProductPath | null
}

export const ONBOARDING_STORAGE_KEY = 'agentication_onboarding_v1'

export function isValidProductPath(value: unknown): value is ProductPath {
  return value === 'dave_doctor' || value === 'business'
}

/** Onboarding is complete only when a product path was explicitly chosen. */
export function isOnboardingComplete(metadata: Record<string, unknown> | null | undefined): boolean {
  if (!metadata) return false
  return metadata.onboardingComplete === true && isValidProductPath(metadata.productPath)
}

export function readOnboardingProfile(
  metadata: Record<string, unknown> | null | undefined,
): OnboardingProfile | null {
  if (!metadata || !isOnboardingComplete(metadata)) return null
  const fullName = typeof metadata.fullName === 'string' ? metadata.fullName : ''
  const companyName = typeof metadata.companyName === 'string' ? metadata.companyName : ''
  if (!isValidProductPath(metadata.productPath)) return null
  const productPath = metadata.productPath
  if (!fullName || !companyName) return null
  return {
    fullName,
    companyName,
    phone: typeof metadata.phone === 'string' && metadata.phone.trim() ? metadata.phone : undefined,
    productPath,
    completedAt:
      typeof metadata.completedAt === 'string' ? metadata.completedAt : new Date().toISOString(),
    onboardingComplete: true,
  }
}

export function productPathLabel(path: ProductPath, lang: 'en' | 'ar' = 'en'): string {
  if (path === 'dave_doctor') {
    return lang === 'ar' ? 'ديف دكتور — للمطوّرين' : 'Dave Doctor — Developers'
  }
  return lang === 'ar' ? 'وكلاء الأعمال' : 'Business Agents'
}
