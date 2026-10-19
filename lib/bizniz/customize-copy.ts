import type { Lang } from '@/lib/copy'
import type { CustomizeKind } from './customize-types'

type Dict = Record<string, string>

const en = {
  navCustomize: 'Customize',
  title: 'Customize',
  subtitle:
    'Enterprise agent refinement — gaps, off-topic chats, moderation, and knowledge or pricing updates.',
  eyebrow: 'Agent operations',
  demoHint:
    'Demo workspace — refinement items are illustrative. Devi Clerk files updates locally until live training APIs are connected.',
  queueTitle: 'Refinement queue',
  queueMeta: 'Review and teach your Business Agent',
  tabAll: 'All workstreams',
  tabUnanswered: 'Unanswered',
  tabOutOfContext: 'Out of context',
  tabProfanity: 'Moderation',
  tabKnowledge: 'Knowledge',
  tabPricing: 'Pricing & data',
  statusOpen: 'Open',
  statusReview: 'In review',
  statusResolved: 'Resolved',
  actionTeach: 'Apply to agent',
  actionResolve: 'Resolve',
  actionReview: 'Send to review',
  empty: 'No items in this workstream.',
  kindUnanswered: 'Unanswered',
  kindOutOfContext: 'Out of context',
  kindProfanity: 'Moderation',
  kindKnowledge: 'Knowledge',
  kindPricing: 'Pricing & data',
  statsOpen: 'Open items',
  statsFlagged: 'Moderation',
  statsKnowledge: 'Knowledge drafts',
  suggested: 'Recommended action',
  channel: 'Channel',
  client: 'Contact',
  langToggle: 'العربية',
  deviName: 'Devi Clerk',
  deviRole: 'Refinement assistant',
  deviOpen: 'Open Devi',
  deviClose: 'Close',
  deviPlaceholder: 'Describe an update — pricing, policy, FAQ…',
  deviSend: 'Send',
  deviWelcome:
    'Hello — I’m Devi Clerk. Share what you need updated (prices, answers, policies) and I’ll file it into Customize for your team.',
  deviAck:
    'Received. I’ve added this to the Customize queue as a knowledge / data update. Review and resolve when ready.',
  backSite: '← Back to site',
  wsUnansweredDesc: 'Questions the agent could not answer',
  wsContextDesc: 'Conversations outside business scope',
  wsModDesc: 'Flagged or inappropriate language',
  wsTrainDesc: 'New facts, prices, and training inputs',
} satisfies Dict

const ar: Dict = {
  navCustomize: 'تخصيص',
  title: 'تخصيص',
  subtitle:
    'تحسين وكيل الأعمال على مستوى المؤسسة — فجوات الرد، خارج السياق، الإشراف، وتحديث المعرفة أو الأسعار.',
  eyebrow: 'تشغيل الوكيل',
  demoHint:
    'مساحة تجريبية — عناصر التحسين للعرض فقط. «ديفي الموظف» يسجّل التحديثات محلياً إلى حين ربط واجهات التدريب.',
  queueTitle: 'طابور التحسين',
  queueMeta: 'راجع ودرّب وكيل الأعمال',
  tabAll: 'كل المسارات',
  tabUnanswered: 'بدون إجابة',
  tabOutOfContext: 'خارج السياق',
  tabProfanity: 'إشراف',
  tabKnowledge: 'المعرفة',
  tabPricing: 'الأسعار والبيانات',
  statusOpen: 'مفتوح',
  statusReview: 'قيد المراجعة',
  statusResolved: 'مكتمل',
  actionTeach: 'تطبيق على الوكيل',
  actionResolve: 'إكمال',
  actionReview: 'إحالة للمراجعة',
  empty: 'لا توجد عناصر في هذا المسار حالياً.',
  kindUnanswered: 'بدون إجابة',
  kindOutOfContext: 'خارج السياق',
  kindProfanity: 'إشراف',
  kindKnowledge: 'معرفة',
  kindPricing: 'أسعار وبيانات',
  statsOpen: 'عناصر مفتوحة',
  statsFlagged: 'إشراف',
  statsKnowledge: 'مسودات معرفة',
  suggested: 'الإجراء المقترح',
  channel: 'القناة',
  client: 'جهة الاتصال',
  langToggle: 'English',
  deviName: 'ديفي الموظف',
  deviRole: 'مساعد التخصيص',
  deviOpen: 'فتح ديفي',
  deviClose: 'إغلاق',
  deviPlaceholder: 'صف التحديث المطلوب — أسعار، سياسة، أسئلة شائعة…',
  deviSend: 'إرسال',
  deviWelcome:
    'مرحباً — أنا ديفي الموظف. أخبرني بما تريد تحديثه (أسعار، إجابات، سياسات) وسأسجّله في التخصيص لفريقك.',
  deviAck:
    'تم الاستلام. أضفت هذا إلى طابور التخصيص كتحديث معرفة / بيانات. راجعه وأكمله عند الجاهزية.',
  backSite: '← الرجوع للموقع',
  wsUnansweredDesc: 'أسئلة لم يتمكن الوكيل من الإجابة عليها',
  wsContextDesc: 'محادثات خارج نطاق العمل',
  wsModDesc: 'لغة مُعلَّمة أو غير لائقة',
  wsTrainDesc: 'حقائق وأسعار ومدخلات تدريب جديدة',
}

export function customizeCopy(lang: Lang) {
  return lang === 'ar' ? ar : en
}

export function kindLabel(lang: Lang, kind: CustomizeKind) {
  const t = customizeCopy(lang)
  switch (kind) {
    case 'unanswered':
      return t.kindUnanswered
    case 'out_of_context':
      return t.kindOutOfContext
    case 'profanity':
      return t.kindProfanity
    case 'knowledge':
      return t.kindKnowledge
    case 'pricing':
      return t.kindPricing
  }
}

export const BIZNIZ_NAV = {
  en: {
    brandTitle: 'Dev Bizniz',
    brandSub: 'Bizniz · Business',
    home: 'Home',
    clients: 'Clients',
    customize: 'Customize',
    automations: 'AI Automations',
    messages: 'Messages',
    authenticate: 'Authenticate',
    settings: 'Settings',
    owner: 'Owner',
    backSite: '← Back to site',
  },
  ar: {
    brandTitle: 'Dev Bizniz',
    brandSub: 'Bizniz · الأعمال',
    home: 'الرئيسية',
    clients: 'العملاء',
    customize: 'تخصيص',
    automations: 'أتمتة الذكاء',
    messages: 'الرسائل',
    authenticate: 'الربط',
    settings: 'الإعدادات',
    owner: 'المالك',
    backSite: '← الرجوع للموقع',
  },
} as const
