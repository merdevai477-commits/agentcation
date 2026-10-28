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
    'Train your WhatsApp agent here. Devi Clerk extracts business facts and saves them into your Business Story for live replies.',
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
  deviRole: 'Model trainer for your WhatsApp agent',
  deviOpen: 'Open trainer',
  deviClose: 'Close',
  deviPlaceholder: 'Tell me your business — name, services, tone, prices, FAQs…',
  deviSend: 'Send',
  deviWelcome:
    'Hi — I’m Devi. Talk to me like you talk to customers. I’ll learn your business name, tone, services, hours, prices, and FAQs, then save them so WhatsApp replies in your style.',
  deviAck:
    'Saved into your Business Story. Keep chatting to refine tone and answers.',
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
    'درّب وكيل واتساب من هنا. ديفي بيستخرج بيانات البيزنز ويحفظها في قصة البيزنز للردود الحية.',
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
  deviRole: 'مدرب الموديل لوكيل واتساب',
  deviOpen: 'فتح المدرب',
  deviClose: 'إغلاق',
  deviPlaceholder: 'قولي عن البيزنز — الاسم، الخدمات، النبرة، الأسعار، الأسئلة الشائعة…',
  deviSend: 'إرسال',
  deviWelcome:
    'أهلاً — أنا ديفي. كلّمني بنفس أسلوبك مع العملاء. هتعلّم اسم النشاط والنبرة والخدمات والساعات والأسعار والـ FAQ، وأحفظها عشان واتساب يرد بطريقتك.',
  deviAck:
    'اتحفظ في قصة البيزنز. كمّل الشات عشان نظبط الأسلوب أكتر.',
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
