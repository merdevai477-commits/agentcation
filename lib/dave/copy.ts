import type { Lang } from '@/lib/copy'
import type { IncidentSeverity, IncidentStatus } from './types'

type Dict = Record<string, string>

const en = {
  brandTitle: 'Dave Doctor',
  brandSub: 'Engineering operations',
  demoBar: 'SAMPLE WORKSPACE — incidents, metrics, and connections on these screens are mock data. No live agent, collector, or deploy is running.',
  backSite: '← Back to site',
  owner: 'Developer',
  navHome: 'Overview',
  navIncidents: 'Incidents',
  navRepos: 'Repositories',
  navApprovals: 'Approvals',
  navInvestigate: 'Live investigate',
  navDocs: 'Docs',
  homeTitle: 'Command center',
  homeSub: 'Monitor services, review incidents, and approve safe fixes — never without you.',
  eyebrow: 'Dave Doctor · Developer workspace',
  statOpen: 'Open incidents',
  statInvestigate: 'Investigating',
  statApprove: 'Awaiting approval',
  statRepos: 'Connected repos',
  recentIncidents: 'Recent incidents',
  pendingApprovals: 'Pending approvals',
  viewAll: 'View all',
  severity: 'Severity',
  status: 'Status',
  service: 'Service',
  when: 'When',
  emptyIncidents: 'No incidents in this filter.',
  emptyApprovals: 'No pending approvals.',
  emptyRepos: 'No repositories yet.',
  connectRepo: 'Connect repository',
  connected: 'Connected',
  notConnected: 'Not connected',
  lastScan: 'Last scan',
  approve: 'Approve fix',
  reject: 'Reject',
  investigate: 'Investigate',
  langToggle: 'العربية',
  incidentsTitle: 'Incidents',
  incidentsSub: 'Anomalies Dave detected across your watched services.',
  reposTitle: 'Repositories',
  reposSub: 'Codebases Dave may inspect when investigating.',
  approvalsTitle: 'Approvals',
  approvalsSub: 'Proposed fixes waiting for human confirmation.',
  investigateTitle: 'Live investigate',
  investigateSub: 'Replay a simulated incident end-to-end — detect, diagnose, propose, verify.',
  filterAll: 'All',
  filterOpen: 'Open',
  filterActive: 'Active',
  filterResolved: 'Resolved',
  risk: 'Risk',
  demoHint:
    'Demo only — GitHub/monitoring connectors and production apply are not wired in this repository yet.',
  sevCritical: 'Critical',
  sevHigh: 'High',
  sevMedium: 'Medium',
  sevLow: 'Low',
  stOpen: 'Open',
  stInvestigating: 'Investigating',
  stApproval: 'Awaiting approval',
  stResolved: 'Resolved',
} satisfies Dict

const ar: Dict = {
  brandTitle: 'ديف دكتور',
  brandSub: 'عمليات هندسية',
  demoBar: 'مساحة عينة — الحوادث والمقاييس والاتصالات هنا بيانات تجريبية. لا يعمل وكيل أو جامع أو نشر حقيقي.',
  backSite: '← الرجوع للموقع',
  owner: 'مطوّر',
  navHome: 'نظرة عامة',
  navIncidents: 'الحوادث',
  navRepos: 'المستودعات',
  navApprovals: 'الموافقات',
  navInvestigate: 'تحقيق مباشر',
  navDocs: 'التوثيق',
  homeTitle: 'مركز القيادة',
  homeSub: 'راقب الخدمات، راجع الحوادث، ووافق على إصلاحات آمنة — بدون تجاوز موافقتك.',
  eyebrow: 'ديف دكتور · مساحة المطوّر',
  statOpen: 'حوادث مفتوحة',
  statInvestigate: 'قيد التحقيق',
  statApprove: 'بانتظار الموافقة',
  statRepos: 'مستودعات مربوطة',
  recentIncidents: 'أحدث الحوادث',
  pendingApprovals: 'موافقات معلّقة',
  viewAll: 'عرض الكل',
  severity: 'الخطورة',
  status: 'الحالة',
  service: 'الخدمة',
  when: 'متى',
  emptyIncidents: 'لا حوادث في هذا الفلتر.',
  emptyApprovals: 'لا موافقات معلّقة.',
  emptyRepos: 'لا مستودعات بعد.',
  connectRepo: 'ربط مستودع',
  connected: 'مربوط',
  notConnected: 'غير مربوط',
  lastScan: 'آخر فحص',
  approve: 'الموافقة على الإصلاح',
  reject: 'رفض',
  investigate: 'تحقيق',
  langToggle: 'English',
  incidentsTitle: 'الحوادث',
  incidentsSub: 'شذوذات رصدها ديف عبر خدماتك المراقَبة.',
  reposTitle: 'المستودعات',
  reposSub: 'أكواد يمكن لديف فحصها أثناء التحقيق.',
  approvalsTitle: 'الموافقات',
  approvalsSub: 'إصلاحات مقترحة بانتظار تأكيد بشري.',
  investigateTitle: 'تحقيق مباشر',
  investigateSub: 'أعد تشغيل حادث محاكى من البداية للنهاية — رصد، تشخيص، اقتراح، تحقق.',
  filterAll: 'الكل',
  filterOpen: 'مفتوح',
  filterActive: 'نشط',
  filterResolved: 'مكتمل',
  risk: 'المخاطر',
  demoHint:
    'عرض تجريبي فقط — موصلات GitHub/المراقبة وتطبيق الإنتاج غير مربوطة في هذا المستودع بعد.',
  sevCritical: 'حرج',
  sevHigh: 'مرتفع',
  sevMedium: 'متوسط',
  sevLow: 'منخفض',
  stOpen: 'مفتوح',
  stInvestigating: 'قيد التحقيق',
  stApproval: 'بانتظار الموافقة',
  stResolved: 'مكتمل',
}

export function daveCopy(lang: Lang) {
  return lang === 'ar' ? ar : en
}

export function severityLabel(lang: Lang, s: IncidentSeverity) {
  const t = daveCopy(lang)
  return s === 'critical'
    ? t.sevCritical
    : s === 'high'
      ? t.sevHigh
      : s === 'medium'
        ? t.sevMedium
        : t.sevLow
}

export function statusLabel(lang: Lang, s: IncidentStatus) {
  const t = daveCopy(lang)
  return s === 'open'
    ? t.stOpen
    : s === 'investigating'
      ? t.stInvestigating
      : s === 'awaiting_approval'
        ? t.stApproval
        : t.stResolved
}

export const DAVE_NAV = {
  en,
  ar,
} as const
