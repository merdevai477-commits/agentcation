import type { DocArticle } from '../types'

export const planArticles: DocArticle[] = [
  {
    slug: 'understanding-our-plans',
    category: 'plans',
    title: { en: 'Understanding our plans', ar: 'فهم خططنا' },
    description: {
      en: 'FREE, PRO, PLUS, and ENTERPRISE plan shapes without invented pricing.',
      ar: 'أشكال FREE وPRO وPLUS وENTERPRISE دون أسعار مخترعة.',
    },
    status: 'available',
    related: ['choosing-the-right-plan', 'pricing-and-billing-faqs'],
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Agentication shows four plan shapes on the marketing site: FREE, PRO, PLUS, and ENTERPRISE. They describe who each plan is for and the type of capabilities you can expect — not final prices or hard limits.',
          ar: 'Agentication تعرض أربعة أشكال خطط على الموقع: FREE وPRO وPLUS وENTERPRISE. تصف لمن كل خطة ونوع القدرات المتوقعة — لا الأسعار النهائية ولا حدودًا صارمة.',
        },
      },
      {
        type: 'callout',
        variant: 'info',
        text: {
          en: 'Pricing is published as packaging is finalized. This documentation does not invent prices, refunds, billing cycles, or usage caps.',
          ar: 'تُنشر الأسعار عند تثبيت الباقات. هذا التوثيق لا يختلق أسعارًا أو استردادًا أو دورات فوترة أو سقوف استخدام.',
        },
      },
      {
        type: 'h2',
        id: 'plan-shapes',
        text: { en: 'Plan shapes on the site', ar: 'أشكال الخطط على الموقع' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'FREE — For individuals exploring agents. Core concepts and sample workflows.',
            ar: 'FREE — للأفراد الذين يستكشفون الوكلاء. المفاهيم الأساسية ومسارات نموذجية.',
          },
          {
            en: 'PRO — For developers and small teams. Advanced agent building and integrations.',
            ar: 'PRO — للمطوّرين والفرق الصغيرة. بناء متقدم للوكلاء والربط.',
          },
          {
            en: 'PLUS — For businesses and workflows. Operational journeys and team controls.',
            ar: 'PLUS — للأعمال ومسارات التشغيل. رحلات تشغيلية وتحكم للفريق.',
          },
          {
            en: 'ENTERPRISE — For advanced controls and custom needs. Custom security, support, and deployment conversations.',
            ar: 'ENTERPRISE — لضوابط متقدمة واحتياج خاص. أمان ودعم ونشر حسب الاتفاق.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'compare',
        text: { en: 'Where to compare', ar: 'أين تقارن' },
      },
      {
        type: 'p',
        text: {
          en: 'Use /pricing or /#pricing on the website to compare plan shapes side by side.',
          ar: 'استخدم /pricing أو /#pricing على الموقع لمقارنة أشكال الخطط.',
        },
      },
      {
        type: 'h2',
        id: 'next-steps',
        text: { en: 'Next steps', ar: 'الخطوات التالية' },
      },
      {
        type: 'p',
        text: {
          en: 'Read Developer agent plans or Business agent plans based on your primary agent type.',
          ar: 'اقرأ «خطط الوكيل الهندسي» أو «خطط وكيل الأعمال» حسب نوع وكيلك الأساسي.',
        },
      },
    ],
  },
  {
    slug: 'business-agent-plans',
    category: 'plans',
    title: { en: 'Business agent plans', ar: 'خطط وكيل الأعمال' },
    description: {
      en: 'How PLUS and related shapes map to business workflows.',
      ar: 'كيف ترتبط PLUS والأشكال ذات الصلة بمسارات الأعمال.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Business Agents — customer channels, knowledge, journeys, and workflow automation — align most closely with PLUS and ENTERPRISE plan shapes on the site. FREE and PRO remain useful for exploration and mixed teams.',
          ar: 'وكلاء الأعمال — قنوات العملاء والمعرفة والرحلات وأتمتة المسارات — الأقرب لأشكال PLUS وENTERPRISE على الموقع. FREE وPRO مفيدان للاستكشاف والفرق المختلطة.',
        },
      },
      {
        type: 'h2',
        id: 'plus-fit',
        text: { en: 'When PLUS fits', ar: 'متى تناسب PLUS' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'You need operational journeys and team controls across channels.',
            ar: 'تحتاج رحلات تشغيلية وتحكمًا للفريق عبر القنوات.',
          },
          {
            en: 'Multiple people configure knowledge, memory, and escalation rules.',
            ar: 'عدة أشخاص يضبطون المعرفة والذاكرة وقواعد التصعيد.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'enterprise-fit',
        text: { en: 'When ENTERPRISE fits', ar: 'متى تناسب ENTERPRISE' },
      },
      {
        type: 'p',
        text: {
          en: 'Choose ENTERPRISE plan shape when you need custom security, support, or deployment conversations — as described on the pricing section, not as a self-serve checkout with invented terms.',
          ar: 'اختر شكل ENTERPRISE عند الحاجة لأمان أو دعم أو نشر مخصص — كما في قسم الأسعار، لا كدفع ذاتي بشروط مخترعة.',
        },
      },
      {
        type: 'callout',
        variant: 'planned',
        text: {
          en: 'Messaging platforms, website widgets, and deep CRM integrations may roll out by plan tier when available.',
          ar: 'منصات المراسلة وعناصر الموقع وCRM العميق قد تُطلَق حسب طبقة الخطة عند التوفر.',
        },
      },
      {
        type: 'h2',
        id: 'next-steps',
        text: { en: 'Next steps', ar: 'الخطوات التالية' },
      },
      {
        type: 'p',
        text: {
          en: 'Read Choosing the right plan and Coverage hours and usage limits.',
          ar: 'اقرأ «اختيار الخطة المناسبة» و«ساعات التغطية وحدود الاستخدام».',
        },
      },
    ],
    related: ['choosing-the-right-plan', 'meet-business-agents'],
  },
  {
    slug: 'developer-agent-plans',
    category: 'plans',
    title: { en: 'Developer agent plans', ar: 'خطط الوكيل الهندسي' },
    description: {
      en: 'How PRO and related shapes map to Dave Doctor and engineering use.',
      ar: 'كيف ترتبط PRO والأشكال ذات الصلة بديف دكتور واستخدام الهندسة.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Dave Doctor — incidents, monitoring, PRs, and deploy verification — aligns most closely with PRO and higher plan shapes. FREE supports learning the platform and sample prototype flows.',
          ar: 'ديف دكتور — الحوادث والمراقبة وطلبات السحب والتحقق من النشر — الأقرب لـ PRO والطبقات الأعلى. FREE يدعم تعلم المنصة والمسارات النموذجية.',
        },
      },
      {
        type: 'h2',
        id: 'pro-fit',
        text: { en: 'When PRO fits', ar: 'متى تناسب PRO' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Developers or small teams building agents with integrations.',
            ar: 'مطوّرون أو فرق صغيرة تبني وكلاء مع ربط.',
          },
          {
            en: 'You expect GitHub and monitoring connections when those integrations launch.',
            ar: 'تتوقع ربط GitHub والمراقبة عند إطلاق هذه التكاملات.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'planned',
        title: { en: 'Monitoring packaging', ar: 'باقات المراقبة' },
        text: {
          en: 'Advanced monitoring and scheduled coverage hours (up to 12h/day proposed) may be restricted to higher tiers when available.',
          ar: 'المراقبة المتقدمة وساعات التغطية المجدولة (حتى 12 ساعة/يوم مقترحة) قد تُقيَّد للطبقات الأعلى عند التوفر.',
        },
      },
      {
        type: 'h2',
        id: 'next-steps',
        text: { en: 'Next steps', ar: 'الخطوات التالية' },
      },
      {
        type: 'p',
        text: {
          en: 'Read Monitoring coverage and operating hours and Developer-focused articles in the Developers section.',
          ar: 'اقرأ «ساعات التغطية والتشغيل» ومقالات المطوّرين في قسم المطوّرين.',
        },
      },
    ],
    related: ['monitoring-coverage-and-operating-hours', 'meet-dave-doctor'],
  },
  {
    slug: 'coverage-hours-and-usage-limits',
    category: 'plans',
    title: { en: 'Coverage hours and usage limits', ar: 'ساعات التغطية وحدود الاستخدام' },
    description: {
      en: 'Proposed coverage model and avoiding invented caps.',
      ar: 'نموذج التغطية المقترح وتجنب السقوف المخترعة.',
    },
    status: 'planned',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Engineering monitoring on Agentication is described with scheduled coverage — up to 12 hours per day as a proposed model. Outside configured coverage, the agent is not continuously monitoring.',
          ar: 'مراقبة الهندسة في Agentication تُوصف بساعات مجدولة — حتى 12 ساعة يوميًا كنموذج مقترح. خارج التغطية المضبوطة، الوكيل لا يراقب باستمرار.',
        },
      },
      {
        type: 'callout',
        variant: 'warning',
        text: {
          en: 'Do not assume 24/7 incident detection unless your configuration and plan explicitly provide active coverage when the feature is available.',
          ar: 'لا تفترض رصد حوادث 24/7 إلا إذا وفرت إعداداتك وخطتك تغطية فعّالة صراحة عند توفر الميزة.',
        },
      },
      {
        type: 'h2',
        id: 'packaging',
        text: { en: 'Plan packaging', ar: 'تغليف الخطط' },
      },
      {
        type: 'p',
        text: {
          en: 'Packaging may restrict advanced monitoring, coverage hours, or autonomous actions to higher tiers. Exact limits will be published with pricing — not guessed in this documentation.',
          ar: 'قد تقيّد الباقات المراقبة المتقدمة أو ساعات التغطية أو الأفعال الذاتية للطبقات الأعلى. الحدود الدقيقة تُنشر مع الأسعار — لا تُخمَّن هنا.',
        },
      },
      {
        type: 'h2',
        id: 'next-steps',
        text: { en: 'Next steps', ar: 'الخطوات التالية' },
      },
      {
        type: 'p',
        text: {
          en: 'Read Monitoring coverage and operating hours (Developers) and Pricing and billing FAQs.',
          ar: 'اقرأ «ساعات التغطية والتشغيل» (المطوّرون) و«أسئلة الأسعار والفوترة».',
        },
      },
    ],
    related: ['monitoring-coverage-and-operating-hours', 'pricing-and-billing-faqs'],
  },
  {
    slug: 'choosing-the-right-plan',
    category: 'plans',
    title: { en: 'Choosing the right plan', ar: 'اختيار الخطة المناسبة' },
    description: {
      en: 'Match plan shape to agent type, team size, and controls needed.',
      ar: 'وائم شكل الخطة مع نوع الوكيل وحجم الفريق والضوابط.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Start with how you work today, not the largest plan shape. You can compare tiers on /pricing while packaging is finalized.',
          ar: 'ابدأ بكيفية شغلك اليوم، لا بأكبر شكل خطة. يمكنك مقارنة الطبقات على /pricing بينما تُثبَّت الباقات.',
        },
      },
      {
        type: 'h2',
        id: 'scenarios',
        text: { en: 'Common scenarios', ar: 'حالات شائعة' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Exploring agents and reading docs — FREE shape.',
            ar: 'استكشاف الوكلاء وقراءة التوثيق — شكل FREE.',
          },
          {
            en: 'Engineering incidents and integrations — PRO shape or higher.',
            ar: 'حوادث الهندسة والربط — شكل PRO أو أعلى.',
          },
          {
            en: 'Customer journeys and team operations — PLUS shape or higher.',
            ar: 'رحلات العملاء وتشغيل الفريق — شكل PLUS أو أعلى.',
          },
          {
            en: 'Custom security, deployment, or support needs — ENTERPRISE conversations.',
            ar: 'أمان أو نشر أو دعم مخصص — محادثات ENTERPRISE.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'prototype-note',
        text: { en: 'Prototype products', ar: 'منتجات نموذجية' },
      },
      {
        type: 'p',
        text: {
          en: 'Dave Doctor and Business Agents are PROTOTYPE on the site. Plan shapes describe intended packaging; feature availability may lag labels on the marketing pages.',
          ar: 'ديف دكتور ووكلاء الأعمال نموذج على الموقع. أشكال الخطط تصف التغليف المقصود؛ توفر الميزات قد يتأخر عن التسميات التسويقية.',
        },
      },
      {
        type: 'h2',
        id: 'next-steps',
        text: { en: 'Next steps', ar: 'الخطوات التالية' },
      },
      {
        type: 'p',
        text: {
          en: 'Create an account via /sign-up and revisit pricing when published numbers appear.',
          ar: 'أنشئ حسابًا عبر /sign-up وعد للأسعار عند نشر الأرقام.',
        },
      },
    ],
    related: ['understanding-our-plans', 'create-your-first-agent'],
  },
  {
    slug: 'pricing-and-billing-faqs',
    category: 'plans',
    title: { en: 'Pricing and billing FAQs', ar: 'أسئلة الأسعار والفوترة' },
    description: {
      en: 'Honest answers about pricing publication, plans, and billing.',
      ar: 'إجابات صادقة عن نشر الأسعار والخطط والفوترة.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'These answers reflect what Agentication communicates on the marketing site today. They are not legal terms or a binding quote.',
          ar: 'هذه الإجابات تعكس ما تنشره Agentication على الموقع اليوم. ليست شروطًا قانونية ولا عرضًا ملزمًا.',
        },
      },
      {
        type: 'h2',
        id: 'faq-list',
        text: { en: 'Frequently asked questions', ar: 'أسئلة شائعة' },
      },
      {
        type: 'h3',
        id: 'faq-prices',
        text: { en: 'Are prices listed today?', ar: 'هل الأسعار منشورة اليوم؟' },
      },
      {
        type: 'p',
        text: {
          en: 'The site shows plan shapes (FREE, PRO, PLUS, ENTERPRISE) with descriptions. Pricing is published as packaging is finalized — we do not state dollar amounts or regional taxes in this documentation.',
          ar: 'الموقع يعرض أشكال الخطط مع أوصاف. تُنشر الأسعار عند تثبيت الباقات — لا نذكر مبالغ أو ضرائب إقليمية في هذا التوثيق.',
        },
      },
      {
        type: 'h3',
        id: 'faq-limits',
        text: { en: 'What are the usage limits?', ar: 'ما حدود الاستخدام؟' },
      },
      {
        type: 'p',
        text: {
          en: 'Limits are not invented here. Coverage hours up to 12h/day are a proposed monitoring model; packaging may restrict advanced monitoring to higher tiers when available.',
          ar: 'لا نختلق حدودًا هنا. ساعات تغطية حتى 12 س/يوم نموذج مراقبة مقترح؛ الباقات قد تقيّد المراقبة المتقدمة للطبقات الأعلى عند التوفر.',
        },
      },
      {
        type: 'h3',
        id: 'faq-refunds',
        text: { en: 'What is the refund policy?', ar: 'ما سياسة الاسترداد؟' },
      },
      {
        type: 'p',
        text: {
          en: 'Refund and billing rules are not published in product docs yet. When billing launches, terms will appear in official pricing and legal pages — not in this article.',
          ar: 'قواعد الاسترداد والفوترة غير منشورة في توثيق المنتج بعد. عند إطلاق الفوترة، ستظهر في صفحات الأسعار والقانون الرسمية — لا في هذا المقال.',
        },
      },
      {
        type: 'h3',
        id: 'faq-free',
        text: { en: 'What can I do on FREE?', ar: 'ماذا أفعل على FREE؟' },
      },
      {
        type: 'p',
        text: {
          en: 'FREE is described for individuals exploring agents — core concepts and sample workflows. You can still sign up, read docs, and use the simulated homepage demo today.',
          ar: 'FREE موصوفة للأفراد المستكشفين — مفاهيم أساسية ومسارات نموذجية. ما زال بإمكانك التسجيل وقراءة التوثيق وديمو الصفحة المحاكى اليوم.',
        },
      },
      {
        type: 'h3',
        id: 'faq-enterprise',
        text: { en: 'How do I buy ENTERPRISE?', ar: 'كيف أشتري ENTERPRISE؟' },
      },
      {
        type: 'p',
        text: {
          en: 'ENTERPRISE is framed for custom security, support, and deployment conversations — contact paths through the website and account flows when available, not a fixed self-serve price.',
          ar: 'ENTERPRISE مخصصة لمحادثات أمان ودعم ونشر — عبر الموقع ومسارات الحساب عند توفرها، لا سعرًا ذاتيًا ثابتًا.',
        },
      },
      {
        type: 'h2',
        id: 'next-steps',
        text: { en: 'Next steps', ar: 'الخطوات التالية' },
      },
      {
        type: 'p',
        text: {
          en: 'Compare shapes on /pricing and read Contact and support for help channels.',
          ar: 'قارن الأشكال على /pricing واقرأ «التواصل والدعم» لقنوات المساعدة.',
        },
      },
    ],
    related: ['contact-and-support', 'understanding-our-plans'],
  },
]
