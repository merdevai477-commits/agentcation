import type { DaveApproval, DaveIncident, DaveRepo } from './types'

export const DAVE_DEMO_LABEL =
  'DEMO WORKSPACE — Dave Doctor signals & repos are illustrative until live connectors ship.'

export const DEMO_INCIDENTS: DaveIncident[] = [
  {
    id: 'inc_1',
    title: 'Checkout API — elevated 500s after deploy',
    titleAr: 'Checkout API — ارتفاع أخطاء 500 بعد النشر',
    service: 'checkout-service',
    severity: 'critical',
    status: 'awaiting_approval',
    at: '2026-10-21T14:20:00Z',
    summary: 'Error rate jumped to 4.8% after release v2.14.1. Pool saturation suspected.',
    summaryAr: 'معدل الأخطاء ارتفع إلى ٤٫٨٪ بعد إصدار v2.14.1. يُشتبه في تشبّع الـ pool.',
  },
  {
    id: 'inc_2',
    title: 'Auth gateway — intermittent latency spike',
    titleAr: 'بوابة المصادقة — ارتفاع متقطع في زمن الاستجابة',
    service: 'auth-gateway',
    severity: 'high',
    status: 'investigating',
    at: '2026-10-21T12:05:00Z',
    summary: 'p95 crossed 900ms for ~12 minutes. Correlating with Redis timeouts.',
    summaryAr: 'p95 تجاوز ٩٠٠ مللي ثانية لمدة ~١٢ دقيقة. جارٍ الربط مع مهلات Redis.',
  },
  {
    id: 'inc_3',
    title: 'Billing worker — queue backlog growing',
    titleAr: 'عامل الفوترة — تزايد تراكم الطابور',
    service: 'billing-worker',
    severity: 'medium',
    status: 'open',
    at: '2026-10-20T22:40:00Z',
    summary: 'Jobs lagging 18 minutes behind. No customer-facing errors yet.',
    summaryAr: 'المهام متأخرة ١٨ دقيقة. لا أخطاء ظاهرة للعملاء بعد.',
  },
  {
    id: 'inc_4',
    title: 'CDN cache miss storm — resolved',
    titleAr: 'عاصفة فقدان كاش CDN — تم الحل',
    service: 'edge-cache',
    severity: 'low',
    status: 'resolved',
    at: '2026-10-19T09:15:00Z',
    summary: 'TTL misconfig rolled back. Origin load returned to baseline.',
    summaryAr: 'تم التراجع عن إعداد TTL الخاطئ. عاد حمل الـ origin للمستوى الطبيعي.',
  },
]

export const DEMO_REPOS: DaveRepo[] = [
  {
    id: 'repo_1',
    name: 'acme/checkout-service',
    provider: 'github',
    branch: 'main',
    connected: true,
    lastScanAt: '2026-10-21T14:00:00Z',
  },
  {
    id: 'repo_2',
    name: 'acme/auth-gateway',
    provider: 'github',
    branch: 'main',
    connected: true,
    lastScanAt: '2026-10-21T11:30:00Z',
  },
  {
    id: 'repo_3',
    name: 'acme/billing-worker',
    provider: 'gitlab',
    branch: 'develop',
    connected: true,
    lastScanAt: '2026-10-20T18:00:00Z',
  },
  {
    id: 'repo_4',
    name: 'acme/mobile-api',
    provider: 'github',
    branch: 'main',
    connected: false,
  },
]

export const DEMO_APPROVALS: DaveApproval[] = [
  {
    id: 'ap_1',
    incidentId: 'inc_1',
    title: 'Raise DB pool max from 20 → 40 + circuit breaker',
    titleAr: 'رفع حد الـ DB pool من ٢٠ → ٤٠ مع قاطع دائرة',
    risk: 'medium',
    at: '2026-10-21T14:35:00Z',
    detail:
      'Dave proposes a bounded config change and a pull-request patch. Production apply requires your approval.',
    detailAr:
      'ديف يقترح تغييراً محدوداً في الإعدادات وباتش عبر PR. التطبيق على الإنتاج يحتاج موافقتك.',
  },
]

export function relativeDaveTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.max(1, Math.round(diff / 60000))
  if (m < 60) return `${m}m`
  const h = Math.round(m / 60)
  if (h < 48) return `${h}h`
  return `${Math.round(h / 24)}d`
}
