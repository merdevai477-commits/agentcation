import type { PricingConfig } from './types'

/**
 * Launch defaults for Agentication marketing + future entitlement mapping.
 * Prices/quotas are proposed — not enforced by backend today.
 * Integrations marked `planned` until product marks them live.
 */
export const pricingConfig: PricingConfig = {
  version: '2026.04.launch-proposal',
  disclaimer: {
    en: 'Proposed launch packaging. Quotas and prices are configurable defaults — not yet billed or enforced in the product backend.',
    ar: 'باقات إطلاق مقترحة. الحصص والأسعار افتراضات قابلة للتعديل — غير مفوترة وغير مُنفَّذة في الباك اند بعد.',
  },
  currencyNote: {
    en: 'EGP amounts are fixed illustrative display values, not live FX rates.',
    ar: 'مبالغ الجنيه قيم عرض ثابتة توضيحية، وليست أسعار صرف حية.',
  },
  billingNote: {
    en: 'Self-serve checkout and subscription enforcement are not implemented yet. CTAs open sign-up or documentation.',
    ar: 'الدفع الذاتي وإنفاذ الاشتراك غير مطبّقين بعد. الأزرار تفتح التسجيل أو التوثيق.',
  },
  products: {
    business: {
      id: 'business',
      title: { en: 'Business Agents', ar: 'وكلاء الأعمال' },
      subtitle: {
        en: 'Customer conversations, knowledge, and workflow automation for startups and teams.',
        ar: 'محادثات العملاء والمعرفة وأتمتة المسارات للشركات والفرق.',
      },
      recommendedPlan: 'plus',
      conversationDefinition: {
        en: 'A conversation is one continuous customer thread (not each message or token). Monthly allowance resets with the billing period when billing launches.',
        ar: 'المحادثة = خيط عميل متصل واحد (وليست كل رسالة أو توكن). الحصة الشهرية تُعاد مع دورة الفوترة عند الإطلاق.',
      },
      enforcementNote: {
        en: 'Limits shown for packaging clarity. No in-app quota enforcement exists yet.',
        ar: 'الحدود للتوضيح التسويقي. لا يوجد إنفاذ حصص داخل المنتج بعد.',
      },
      plans: [
        {
          id: 'free',
          name: { en: 'Free', ar: 'مجاني' },
          idealFor: {
            en: 'Evaluate Business Agents with one channel and light usage.',
            ar: 'جرّب وكلاء الأعمال بقناة واحدة واستخدام خفيف.',
          },
          price: { USD: 0, EGP: 0 },
          billingPeriod: 'monthly',
          quotas: {
            activeAgents: 1,
            connectedChannels: 1,
            monthlyConversations: 100,
            teamMembers: 1,
          },
          highlights: [
            { label: { en: '1 active agent', ar: 'وكيل نشط واحد' } },
            { label: { en: '1 connected channel', ar: 'قناة متصلة واحدة' } },
            { label: { en: '100 conversations / month', ar: '100 محادثة / شهر' } },
            { label: { en: 'Basic knowledge base', ar: 'قاعدة معرفة أساسية' } },
            { label: { en: 'Self-service support', ar: 'دعم ذاتي' } },
          ],
          cta: { label: { en: 'Start free', ar: 'ابدأ مجانًا' }, href: '/sign-up' },
        },
        {
          id: 'pro',
          name: { en: 'Pro', ar: 'Pro' },
          idealFor: {
            en: 'Small businesses starting to automate customer conversations.',
            ar: 'أعمال صغيرة تبدأ أتمتة محادثات العملاء.',
          },
          price: { USD: 19, EGP: 950 },
          billingPeriod: 'monthly',
          quotas: {
            activeAgents: 2,
            connectedChannels: 2,
            monthlyConversations: 1000,
            teamMembers: 2,
          },
          highlights: [
            { label: { en: '2 active agents', ar: 'وكيلان نشطان' } },
            { label: { en: '2 connected channels', ar: 'قناتان متصلتان' } },
            { label: { en: '1,000 conversations / month', ar: '1,000 محادثة / شهر' } },
            { label: { en: 'Expanded knowledge & memory', ar: 'معرفة وذاكرة موسّعة' } },
            {
              label: { en: 'Messaging connectors when available', ar: 'موصلات مراسلة عند التوفر' },
              status: 'planned',
            },
          ],
          cta: { label: { en: 'Choose Pro', ar: 'اختر Pro' }, href: '/sign-up' },
        },
        {
          id: 'plus',
          name: { en: 'Plus', ar: 'Plus' },
          idealFor: {
            en: 'Growing teams with multiple agents, channels, and workflows.',
            ar: 'فرق نامية بعدة وكلاء وقنوات ومسارات.',
          },
          price: { USD: 49, EGP: 2450 },
          billingPeriod: 'monthly',
          recommended: true,
          quotas: {
            activeAgents: 5,
            connectedChannels: 5,
            monthlyConversations: 5000,
            teamMembers: 5,
          },
          highlights: [
            { label: { en: '5 active agents', ar: '5 وكلاء نشطين' } },
            { label: { en: '5 connected channels', ar: '5 قنوات متصلة' } },
            { label: { en: '5,000 conversations / month', ar: '5,000 محادثة / شهر' } },
            {
              label: { en: 'Advanced workflows & handoff (planned)', ar: 'مسارات وتسليم متقدم (مخطط)' },
              status: 'planned',
            },
            { label: { en: 'Priority support', ar: 'دعم ذو أولوية' } },
          ],
          cta: { label: { en: 'Choose Plus', ar: 'اختر Plus' }, href: '/sign-up' },
        },
        {
          id: 'enterprise',
          name: { en: 'Enterprise', ar: 'Enterprise' },
          idealFor: {
            en: 'Custom limits, security, support, and deployment conversations.',
            ar: 'حدود وأمان ودعم ونشر حسب الاتفاق.',
          },
          price: { USD: null, EGP: null },
          billingPeriod: 'monthly',
          quotas: {
            activeAgents: 'custom',
            connectedChannels: 'custom',
            monthlyConversations: 'custom',
            teamMembers: 'custom',
          },
          highlights: [
            { label: { en: 'Custom agents & channels', ar: 'وكلاء وقنوات مخصصة' } },
            { label: { en: 'Custom conversation allowance', ar: 'حصة محادثات مخصصة' } },
            { label: { en: 'Custom security & permissions', ar: 'أمان وصلاحيات مخصصة' } },
            { label: { en: 'Custom SLA support', ar: 'دعم باتفاقية مستوى خدمة' } },
            { label: { en: 'Deployment conversations', ar: 'محادثات نشر مخصصة' } },
          ],
          cta: {
            label: { en: 'Talk to sales', ar: 'تواصل مع المبيعات' },
            href: '/docs/contact-and-support',
          },
        },
      ],
      comparison: [
        {
          id: 'agents',
          label: { en: 'Active agents', ar: 'الوكلاء النشطون' },
          tooltip: {
            en: 'An active agent is a configured Business Agent that can receive conversations.',
            ar: 'الوكيل النشط هو وكيل أعمال مُعدّ ويمكنه استقبال المحادثات.',
          },
          values: {
            free: { en: '1', ar: '1' },
            pro: { en: '2', ar: '2' },
            plus: { en: '5', ar: '5' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
        },
        {
          id: 'channels',
          label: { en: 'Connected channels', ar: 'القنوات المتصلة' },
          tooltip: {
            en: 'A channel is one connected account or surface (e.g. one WhatsApp number). Separate from agents.',
            ar: 'القناة = حساب أو سطح متصل واحد (مثل رقم واتساب). منفصلة عن الوكلاء.',
          },
          values: {
            free: { en: '1', ar: '1' },
            pro: { en: '2', ar: '2' },
            plus: { en: '5', ar: '5' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
        },
        {
          id: 'conversations',
          label: { en: 'Monthly AI conversations', ar: 'محادثات الذكاء الشهرية' },
          values: {
            free: { en: '100', ar: '100' },
            pro: { en: '1,000', ar: '1,000' },
            plus: { en: '5,000', ar: '5,000' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
        },
        {
          id: 'knowledge',
          label: { en: 'Knowledge base', ar: 'قاعدة المعرفة' },
          values: {
            free: { en: 'Basic', ar: 'أساسية' },
            pro: { en: 'Expanded', ar: 'موسّعة' },
            plus: { en: 'Advanced', ar: 'متقدمة' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
          status: 'planned',
        },
        {
          id: 'memory',
          label: { en: 'Customer context & memory', ar: 'سياق العميل والذاكرة' },
          values: {
            free: { en: 'Basic', ar: 'أساسية' },
            pro: { en: 'Expanded', ar: 'موسّعة' },
            plus: { en: 'Advanced', ar: 'متقدمة' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
          status: 'planned',
        },
        {
          id: 'workflows',
          label: { en: 'Workflow automation', ar: 'أتمتة المسارات' },
          values: {
            free: { en: 'Unavailable', ar: 'غير متاح' },
            pro: { en: 'Limited (planned)', ar: 'محدود (مخطط)' },
            plus: { en: 'Expanded (planned)', ar: 'موسّع (مخطط)' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
          status: 'planned',
        },
        {
          id: 'leads',
          label: { en: 'Lead qualification', ar: 'تأهيل العملاء المحتملين' },
          values: {
            free: { en: 'Basic (planned)', ar: 'أساسي (مخطط)' },
            pro: { en: 'Included when available', ar: 'مدرج عند التوفر' },
            plus: { en: 'Advanced when available', ar: 'متقدم عند التوفر' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
          status: 'planned',
        },
        {
          id: 'handoff',
          label: { en: 'Human handoff', ar: 'التسليم للبشر' },
          values: {
            free: { en: 'Coming soon', ar: 'قريبًا' },
            pro: { en: 'Coming soon', ar: 'قريبًا' },
            plus: { en: 'Coming soon', ar: 'قريبًا' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
          status: 'planned',
        },
        {
          id: 'team',
          label: { en: 'Team members', ar: 'أعضاء الفريق' },
          values: {
            free: { en: '1', ar: '1' },
            pro: { en: '2', ar: '2' },
            plus: { en: '5', ar: '5' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
        },
        {
          id: 'support',
          label: { en: 'Support', ar: 'الدعم' },
          values: {
            free: { en: 'Self-service / docs', ar: 'ذاتي / توثيق' },
            pro: { en: 'Standard', ar: 'قياسي' },
            plus: { en: 'Priority', ar: 'أولوية' },
            enterprise: { en: 'Custom SLA', ar: 'اتفاقية مخصصة' },
          },
        },
      ],
      integrations: [
        {
          id: 'website-chat',
          name: { en: 'Website chat widget', ar: 'عنصر دردشة الموقع' },
          status: 'planned',
          plans: ['free', 'pro', 'plus', 'enterprise'],
          consumesConnectionSlot: true,
          access: 'read_write',
          requiresThirdPartySubscription: false,
          requiresUserAuthorization: true,
          notes: {
            en: 'Planned. Counts as one connected channel when live.',
            ar: 'مخطط. يُحسب كقناة واحدة عند الإطلاق.',
          },
        },
        {
          id: 'whatsapp',
          name: { en: 'WhatsApp', ar: 'واتساب' },
          status: 'planned',
          plans: ['pro', 'plus', 'enterprise'],
          consumesConnectionSlot: true,
          access: 'read_write',
          requiresThirdPartySubscription: true,
          requiresUserAuthorization: true,
          notes: {
            en: 'Planned. Requires Meta/WhatsApp Business eligibility. One account = one channel.',
            ar: 'مخطط. يتطلب أهلية واتساب للأعمال. حساب واحد = قناة واحدة.',
          },
        },
        {
          id: 'instagram',
          name: { en: 'Instagram', ar: 'إنستغرام' },
          status: 'planned',
          plans: ['pro', 'plus', 'enterprise'],
          consumesConnectionSlot: true,
          access: 'read_write',
          requiresThirdPartySubscription: true,
          requiresUserAuthorization: true,
        },
        {
          id: 'messenger',
          name: { en: 'Facebook Messenger', ar: 'ماسنجر فيسبوك' },
          status: 'planned',
          plans: ['pro', 'plus', 'enterprise'],
          consumesConnectionSlot: true,
          access: 'read_write',
          requiresThirdPartySubscription: true,
          requiresUserAuthorization: true,
        },
        {
          id: 'crm',
          name: { en: 'CRM connectors', ar: 'موصلات CRM' },
          status: 'planned',
          plans: ['plus', 'enterprise'],
          consumesConnectionSlot: true,
          access: 'read_write',
          requiresThirdPartySubscription: true,
          requiresUserAuthorization: true,
        },
      ],
      faqs: [
        {
          id: 'b-agents',
          question: { en: 'How many agents can I create?', ar: 'كم وكيلًا يمكنني إنشاؤه؟' },
          answer: {
            en: 'Free 1, Pro 2, Plus 5, Enterprise custom. These are proposed packaging limits — not yet enforced in-product.',
            ar: 'مجاني 1، Pro 2، Plus 5، Enterprise مخصص. حدود باقات مقترحة — غير مُنفَّذة داخل المنتج بعد.',
          },
        },
        {
          id: 'b-conversation',
          question: { en: 'What counts as a conversation?', ar: 'ما الذي يُحسب كمحادثة؟' },
          answer: {
            en: 'One continuous customer thread, not each message or AI token. Exact metering will follow billing launch.',
            ar: 'خيط عميل متصل واحد، وليست كل رسالة أو توكن. القياس النهائي يتبع إطلاق الفوترة.',
          },
        },
        {
          id: 'b-channels',
          question: { en: 'Which messaging channels can I connect?', ar: 'أي قنوات مراسلة يمكن ربطها؟' },
          answer: {
            en: 'Website chat, WhatsApp, Instagram, and Messenger are planned. None are confirmed live for every account today — see Available integrations in docs.',
            ar: 'دردشة الموقع وواتساب وإنستغرام وماسنجر مخططة. لا شيء مؤكد حيًا لكل الحسابات اليوم — راجع «التكاملات المتاحة».',
          },
        },
        {
          id: 'b-multi',
          question: { en: 'Can one agent work across multiple channels?', ar: 'هل يمكن لوكيل واحد العمل عبر قنوات متعددة؟' },
          answer: {
            en: 'Product direction allows it when connectors ship. Channel slots remain separate from agent slots.',
            ar: 'اتجاه المنتج يسمح بذلك عند إطلاق الموصلات. خانات القنوات منفصلة عن خانات الوكلاء.',
          },
        },
        {
          id: 'b-limit',
          question: { en: 'What happens when I reach my monthly limit?', ar: 'ماذا يحدث عند بلوغ الحد الشهري؟' },
          answer: {
            en: 'Proposed behavior: soft notice + upgrade path. Hard stop vs overage billing is not implemented yet and needs product approval.',
            ar: 'السلوك المقترح: تنبيه + مسار ترقية. الإيقاف الصارم أو الرسوم الزائدة غير مطبّق ويحتاج موافقة.',
          },
        },
        {
          id: 'b-third',
          question: { en: 'Do I pay WhatsApp or other vendors separately?', ar: 'هل أدفع لواتساب أو مزودين آخرين بشكل منفصل؟' },
          answer: {
            en: 'Yes when those connectors go live. Agentication packaging is separate from Meta/WhatsApp or CRM vendor fees.',
            ar: 'نعم عند إطلاق الموصلات. باقة Agentication منفصلة عن رسوم Meta/واتساب أو CRM.',
          },
        },
        {
          id: 'b-handoff',
          question: { en: 'Can I transfer a conversation to a human?', ar: 'هل يمكن تحويل المحادثة لإنسان؟' },
          answer: {
            en: 'Human handoff is planned for Business Agents. Not available as a live product feature today.',
            ar: 'التسليم للبشر مخطط لوكلاء الأعمال. غير متاح كميزة حية اليوم.',
          },
        },
        {
          id: 'b-upgrade',
          question: { en: 'Can I upgrade later?', ar: 'هل يمكنني الترقية لاحقًا؟' },
          answer: {
            en: 'Yes — plans are designed as an upgrade path. Self-serve billing checkout is still forthcoming.',
            ar: 'نعم — الخطط مسار ترقية. دفع الاشتراك الذاتي ما زال قادمًا.',
          },
        },
      ],
    },
    developer: {
      id: 'developer',
      title: { en: 'Developer Agents — Dave Doctor', ar: 'وكلاء المطوّرين — ديف دكتور' },
      subtitle: {
        en: 'Incident investigation, code context, and approval-aware engineering workflows.',
        ar: 'تحقيق الحوادث وسياق الكود ومسارات هندسية بموافقة.',
      },
      recommendedPlan: 'pro',
      coverageDefinition: {
        en: 'Monitoring coverage is a scheduled window when Dave Doctor is configured to watch signals — not a 24/7 uptime SLA or guaranteed detection of every incident.',
        ar: 'تغطية المراقبة نافذة مجدولة لمراقبة الإشارات — وليست اتفاقية توفر 24/7 ولا ضمان رصد كل حادث.',
      },
      enforcementNote: {
        en: 'Dave Doctor homepage demo is simulated. Live GitHub/monitoring connectors and quota enforcement are not in the backend yet.',
        ar: 'ديمو ديف دكتور على الصفحة محاكى. موصلات GitHub/المراقبة وإنفاذ الحصص غير موجودة في الباك اند بعد.',
      },
      plans: [
        {
          id: 'free',
          name: { en: 'Free', ar: 'مجاني' },
          idealFor: {
            en: 'Evaluate Dave Doctor on a small project with limited coverage.',
            ar: 'جرّب ديف دكتور على مشروع صغير بتغطية محدودة.',
          },
          price: { USD: 0, EGP: 0 },
          billingPeriod: 'monthly',
          quotas: {
            connectedProjects: 1,
            githubRepositories: 1,
            coverageHoursPerDay: null,
            teamMembers: 1,
          },
          highlights: [
            { label: { en: '1 connected project', ar: 'مشروع متصل واحد' } },
            { label: { en: '1 GitHub repository (when live)', ar: 'مستودع GitHub واحد (عند الإطلاق)' }, status: 'planned' },
            { label: { en: 'Basic / manual monitoring', ar: 'مراقبة أساسية / يدوية' }, status: 'prototype' },
            { label: { en: 'Simulated incident demo', ar: 'ديمو حادث محاكى' }, status: 'available' },
            { label: { en: 'Observe mode (prototype)', ar: 'وضع المراقبة (نموذج)' }, status: 'prototype' },
          ],
          cta: { label: { en: 'Start free', ar: 'ابدأ مجانًا' }, href: '/sign-up' },
        },
        {
          id: 'pro',
          name: { en: 'Pro', ar: 'Pro' },
          idealFor: {
            en: 'Individual developers or small projects needing limited daily coverage.',
            ar: 'مطوّرون أفراد أو مشاريع صغيرة تحتاج تغطية يومية محدودة.',
          },
          price: { USD: 29, EGP: 1450 },
          billingPeriod: 'monthly',
          recommended: true,
          quotas: {
            connectedProjects: 2,
            githubRepositories: 2,
            coverageHoursPerDay: 4,
            teamMembers: 2,
          },
          highlights: [
            { label: { en: '2 projects · 2 repositories', ar: 'مشروعان · مستودعان' } },
            { label: { en: 'Up to 4 hours/day coverage', ar: 'حتى 4 ساعات تغطية / يوم' } },
            { label: { en: 'Observe + Assist modes (prototype)', ar: 'مراقبة + مساعدة (نموذج)' }, status: 'prototype' },
            { label: { en: 'GitHub & monitoring when available', ar: 'GitHub والمراقبة عند التوفر' }, status: 'planned' },
            { label: { en: 'Fix suggestions for approval', ar: 'اقتراحات إصلاح للموافقة' }, status: 'prototype' },
          ],
          cta: { label: { en: 'Choose Pro', ar: 'اختر Pro' }, href: '/sign-up' },
        },
        {
          id: 'plus',
          name: { en: 'Plus', ar: 'Plus' },
          idealFor: {
            en: 'Growing engineering teams with several repos and longer coverage.',
            ar: 'فرق هندسية نامية بعدة مستودعات وتغطية أطول.',
          },
          price: { USD: 79, EGP: 3950 },
          billingPeriod: 'monthly',
          quotas: {
            connectedProjects: 5,
            githubRepositories: 10,
            coverageHoursPerDay: 8,
            teamMembers: 5,
          },
          highlights: [
            { label: { en: '5 projects · 10 repositories', ar: '5 مشاريع · 10 مستودعات' } },
            { label: { en: 'Up to 8 hours/day coverage', ar: 'حتى 8 ساعات تغطية / يوم' } },
            { label: { en: 'Expanded investigation depth', ar: 'عمق تحقيق موسّع' }, status: 'planned' },
            { label: { en: 'PR creation when supported', ar: 'إنشاء PR عند الدعم' }, status: 'planned' },
            { label: { en: 'Priority support', ar: 'دعم ذو أولوية' } },
          ],
          cta: { label: { en: 'Choose Plus', ar: 'اختر Plus' }, href: '/sign-up' },
        },
        {
          id: 'enterprise',
          name: { en: 'Enterprise', ar: 'Enterprise' },
          idealFor: {
            en: 'Custom coverage (up to 12h/day if supported), security, and support.',
            ar: 'تغطية مخصصة (حتى 12 ساعة/يوم إن أمكن)، وأمان ودعم.',
          },
          price: { USD: null, EGP: null },
          billingPeriod: 'monthly',
          quotas: {
            connectedProjects: 'custom',
            githubRepositories: 'custom',
            coverageHoursPerDay: 12,
            teamMembers: 'custom',
          },
          highlights: [
            { label: { en: 'Negotiated projects & repos', ar: 'مشاريع ومستودعات بالاتفاق' } },
            { label: { en: 'Coverage up to 12h/day if operationally supported', ar: 'تغطية حتى 12 ساعة/يوم إن سمحت العمليات' } },
            { label: { en: 'Custom connectors & permissions', ar: 'موصلات وصلاحيات مخصصة' } },
            { label: { en: 'Autonomous only where authorized', ar: 'ذاتي فقط حيث يُصرَّح' }, status: 'planned' },
            { label: { en: 'Custom SLA', ar: 'اتفاقية مستوى خدمة' } },
          ],
          cta: {
            label: { en: 'Talk to sales', ar: 'تواصل مع المبيعات' },
            href: '/docs/contact-and-support',
          },
        },
      ],
      comparison: [
        {
          id: 'projects',
          label: { en: 'Connected projects', ar: 'المشاريع المتصلة' },
          values: {
            free: { en: '1', ar: '1' },
            pro: { en: '2', ar: '2' },
            plus: { en: '5', ar: '5' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
        },
        {
          id: 'repos',
          label: { en: 'GitHub repositories', ar: 'مستودعات GitHub' },
          tooltip: {
            en: 'Repos under one GitHub connection. Connection ≠ repository count.',
            ar: 'مستودعات تحت اتصال GitHub واحد. الاتصال ≠ عدد المستودعات.',
          },
          values: {
            free: { en: '1 (planned)', ar: '1 (مخطط)' },
            pro: { en: '2 (planned)', ar: '2 (مخطط)' },
            plus: { en: '10 (planned)', ar: '10 (مخطط)' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
          status: 'planned',
        },
        {
          id: 'coverage',
          label: { en: 'Monitoring coverage', ar: 'تغطية المراقبة' },
          values: {
            free: { en: 'Basic / manual', ar: 'أساسية / يدوية' },
            pro: { en: 'Up to 4h / day', ar: 'حتى 4 ساعات / يوم' },
            plus: { en: 'Up to 8h / day', ar: 'حتى 8 ساعات / يوم' },
            enterprise: { en: 'Up to 12h / day if supported', ar: 'حتى 12 ساعة / يوم إن أمكن' },
          },
        },
        {
          id: 'logs',
          label: { en: 'Log investigation', ar: 'تحقيق السجلات' },
          values: {
            free: { en: 'Limited / demo', ar: 'محدود / ديمو' },
            pro: { en: 'When connectors live', ar: 'عند توفر الموصلات' },
            plus: { en: 'Expanded when live', ar: 'موسّع عند الإطلاق' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
          status: 'planned',
        },
        {
          id: 'rca',
          label: { en: 'Root-cause investigation', ar: 'تحليل السبب الجذري' },
          values: {
            free: { en: 'Limited / demo', ar: 'محدود / ديمو' },
            pro: { en: 'Standard (prototype)', ar: 'قياسي (نموذج)' },
            plus: { en: 'Advanced (planned)', ar: 'متقدم (مخطط)' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
          status: 'prototype',
        },
        {
          id: 'prs',
          label: { en: 'Pull request creation', ar: 'إنشاء طلبات السحب' },
          values: {
            free: { en: 'Not available', ar: 'غير متاح' },
            pro: { en: 'If supported', ar: 'إن وُجد الدعم' },
            plus: { en: 'If supported', ar: 'إن وُجد الدعم' },
            enterprise: { en: 'If supported', ar: 'إن وُجد الدعم' },
          },
          status: 'planned',
        },
        {
          id: 'modes',
          label: { en: 'Operating modes', ar: 'أوضاع التشغيل' },
          tooltip: {
            en: 'Observe / Assist / Autonomous are prototype concepts on the site — not fully production-operational for all customers.',
            ar: 'المراقبة / المساعدة / الذاتي مفاهيم نموذجية على الموقع — ليست إنتاجًا كاملًا لكل العملاء.',
          },
          values: {
            free: { en: 'Observe (prototype)', ar: 'مراقبة (نموذج)' },
            pro: { en: 'Observe + Assist', ar: 'مراقبة + مساعدة' },
            plus: { en: 'All three (gated)', ar: 'الثلاثة (بموافقة)' },
            enterprise: { en: 'Policy-bound custom', ar: 'مخصص بالسياسة' },
          },
          status: 'prototype',
        },
        {
          id: 'team',
          label: { en: 'Team members', ar: 'أعضاء الفريق' },
          values: {
            free: { en: '1', ar: '1' },
            pro: { en: '2', ar: '2' },
            plus: { en: '5', ar: '5' },
            enterprise: { en: 'Custom', ar: 'مخصص' },
          },
        },
        {
          id: 'support',
          label: { en: 'Support', ar: 'الدعم' },
          values: {
            free: { en: 'Self-service', ar: 'ذاتي' },
            pro: { en: 'Standard', ar: 'قياسي' },
            plus: { en: 'Priority', ar: 'أولوية' },
            enterprise: { en: 'Custom SLA', ar: 'اتفاقية مخصصة' },
          },
        },
      ],
      integrations: [
        {
          id: 'github',
          name: { en: 'GitHub', ar: 'GitHub' },
          status: 'planned',
          plans: ['free', 'pro', 'plus', 'enterprise'],
          consumesConnectionSlot: true,
          access: 'read_write',
          requiresThirdPartySubscription: false,
          requiresUserAuthorization: true,
          notes: {
            en: 'One GitHub connection may expose multiple repos up to plan repository quota.',
            ar: 'اتصال GitHub واحد قد يفتح عدة مستودعات حتى حصة الخطة.',
          },
        },
        {
          id: 'logging',
          name: { en: 'Logging provider', ar: 'مزوّد السجلات' },
          status: 'planned',
          plans: ['pro', 'plus', 'enterprise'],
          consumesConnectionSlot: true,
          access: 'read',
          requiresThirdPartySubscription: true,
          requiresUserAuthorization: true,
        },
        {
          id: 'metrics',
          name: { en: 'Metrics / observability', ar: 'مقاييس / مراقبة' },
          status: 'planned',
          plans: ['pro', 'plus', 'enterprise'],
          consumesConnectionSlot: true,
          access: 'read',
          requiresThirdPartySubscription: true,
          requiresUserAuthorization: true,
        },
        {
          id: 'errors',
          name: { en: 'Error monitoring', ar: 'مراقبة الأخطاء' },
          status: 'planned',
          plans: ['pro', 'plus', 'enterprise'],
          consumesConnectionSlot: true,
          access: 'read',
          requiresThirdPartySubscription: true,
          requiresUserAuthorization: true,
        },
        {
          id: 'deploy',
          name: { en: 'Deployment / hosting', ar: 'النشر / الاستضافة' },
          status: 'planned',
          plans: ['plus', 'enterprise'],
          consumesConnectionSlot: true,
          access: 'read',
          requiresThirdPartySubscription: true,
          requiresUserAuthorization: true,
          notes: {
            en: 'Write/deploy actions remain approval-aware; never claimed without human approval.',
            ar: 'أفعال الكتابة/النشر بموافقة؛ لا تُعلَن بدون موافقة بشرية.',
          },
        },
        {
          id: 'alerts',
          name: { en: 'Incident alert channels', ar: 'قنوات تنبيه الحوادث' },
          status: 'planned',
          plans: ['pro', 'plus', 'enterprise'],
          consumesConnectionSlot: true,
          access: 'write',
          requiresThirdPartySubscription: true,
          requiresUserAuthorization: true,
        },
      ],
      faqs: [
        {
          id: 'd-repos',
          question: { en: 'Which repositories can Dave Doctor access?', ar: 'أي مستودعات يصل إليها ديف دكتور؟' },
          answer: {
            en: 'Only repositories you authorize under a GitHub connection, up to plan quotas — when the GitHub integration is marked available. The homepage demo does not access your org.',
            ar: 'فقط المستودعات التي تفوّضها تحت اتصال GitHub وحتى حصة الخطة — عند إعلان التكامل. ديمو الصفحة لا يدخل مؤسستك.',
          },
        },
        {
          id: 'd-247',
          question: { en: 'Does Dave Doctor monitor 24/7?', ar: 'هل يراقب ديف دكتور على مدار الساعة؟' },
          answer: {
            en: 'No. Standard packaging proposes up to 8 hours/day (Enterprise up to 12 if operationally supported). Not a detection guarantee.',
            ar: 'لا. الباقات المقترحة حتى 8 ساعات/يوم (Enterprise حتى 12 إن أمكن تشغيليًا). ليس ضمان رصد.',
          },
        },
        {
          id: 'd-coverage',
          question: { en: 'What does monitoring coverage mean?', ar: 'ماذا تعني تغطية المراقبة؟' },
          answer: {
            en: 'A scheduled window when the agent is configured to watch connected signals. Separate from uptime SLAs.',
            ar: 'نافذة مجدولة لمراقبة الإشارات المتصلة. منفصلة عن اتفاقيات التوفر.',
          },
        },
        {
          id: 'd-modify',
          question: { en: 'Can it modify my code automatically?', ar: 'هل يعدّل الكود تلقائيًا؟' },
          answer: {
            en: 'Not without human approval. Autonomous actions are policy-bound and planned — production changes require a person.',
            ar: 'ليس بدون موافقة بشرية. الأفعال الذاتية بالسياسة ومخططة — تغيير الإنتاج يحتاج شخصًا.',
          },
        },
        {
          id: 'd-pr',
          question: { en: 'Does it create pull requests?', ar: 'هل ينشئ طلبات سحب؟' },
          answer: {
            en: 'Only if GitHub write scopes and the feature are supported for your workspace. Shown as planned/prototype on the site today.',
            ar: 'فقط إن توفرت صلاحيات GitHub والميزة لمساحة عملك. اليوم تظهر كمخطط/نموذج على الموقع.',
          },
        },
        {
          id: 'd-approve',
          question: { en: 'Can I approve actions before they happen?', ar: 'هل أوافق على الأفعال قبل حدوثها؟' },
          answer: {
            en: 'Yes — Assist mode and approval-aware design are core positioning. Autonomous remains gated.',
            ar: 'نعم — وضع المساعدة والتصميم بموافقة جزء أساسي. الذاتي يبقى مقيّدًا.',
          },
        },
        {
          id: 'd-obs',
          question: { en: 'Which observability integrations are supported?', ar: 'أي تكاملات مراقبة مدعومة؟' },
          answer: {
            en: 'Logging, metrics, and error platforms are planned connectors — none confirmed live for every account in this repo.',
            ar: 'السجلات والمقاييس والأخطاء موصلات مخططة — لا شيء مؤكد حيًا لكل الحسابات في هذا المستودع.',
          },
        },
        {
          id: 'd-end',
          question: { en: 'What happens when coverage ends?', ar: 'ماذا يحدث عند انتهاء التغطية؟' },
          answer: {
            en: 'Proposed: monitoring pauses until the next window or upgrade. Continuous detection is not claimed.',
            ar: 'المقترح: تتوقف المراقبة حتى النافذة التالية أو الترقية. لا يُعلَن الرصد المستمر.',
          },
        },
      ],
    },
  },
}

export function formatPrice(amount: number | null, currency: 'USD' | 'EGP', lang: 'en' | 'ar') {
  if (amount === null) return lang === 'ar' ? 'مخصص' : 'Custom'
  if (amount === 0) return currency === 'USD' ? '$0' : lang === 'ar' ? '0 ج.م' : '0 EGP'
  if (currency === 'USD') return `$${amount}`
  return lang === 'ar' ? `${amount.toLocaleString('en-US')} ج.م` : `${amount.toLocaleString('en-US')} EGP`
}

export function statusLabel(status: 'available' | 'prototype' | 'planned' | 'custom', lang: 'en' | 'ar') {
  const map = {
    available: { en: 'Available', ar: 'متاح' },
    prototype: { en: 'Prototype', ar: 'نموذج' },
    planned: { en: 'Coming soon', ar: 'قريبًا' },
    custom: { en: 'Custom', ar: 'مخصص' },
  } as const
  return map[status][lang]
}
