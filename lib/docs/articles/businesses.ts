import type { DocArticle } from '../types'

export const businessArticles: DocArticle[] = [
  {
    slug: 'meet-business-agents',
    category: 'businesses',
    title: { en: 'Meet Business Agents', ar: 'تعرّف على وكلاء الأعمال' },
    description: {
      en: 'Agents for customer relationships, channels, and operational workflows.',
      ar: 'وكلاء لعلاقات العملاء والقنوات ومسارات التشغيل.',
    },
    status: 'prototype',
    related: ['customer-support-automation', 'business-knowledge-and-faqs'],
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Business Agents connect channels, knowledge, and operational tools into an agent that understands how work gets done in your organization. On the marketing site they are labeled PROTOTYPE.',
          ar: 'وكلاء الأعمال يربطون القنوات والمعرفة وأدوات التشغيل في وكيل يفهم كيف يتم العمل في مؤسستك. على الموقع مُعلَّمون كنموذج.',
        },
      },
      {
        type: 'h2',
        id: 'what-they-do',
        text: { en: 'What they are designed for', ar: 'لماذا صُمّموا' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Detect customer intent and retrieve grounded business knowledge.',
            ar: 'رصد نية العميل واسترجاع معرفة عمل مبنية على مصادر.',
          },
          {
            en: 'Save preferences and journey context for the next interaction.',
            ar: 'حفظ التفضيلات وسياق الرحلة للتفاعل التالي.',
          },
          {
            en: 'Propose next actions such as sending tailored options or escalating.',
            ar: 'اقتراح خطوات مثل إرسال خيارات مناسبة أو التصعيد.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: { en: 'Illustrative travel example', ar: 'مثال السفر توضيحي' },
        text: {
          en: 'The travel-agency Germany example on the site is clearly illustrative. Prices, availability, and bookings depend on connected sources and must be verified.',
          ar: 'مثال وكالة السفر في ألمانيا على الموقع توضيحي بوضوح. الأسعار والتوفر والحجوزات تعتمد على المصادر المتصلة ويجب التحقق منها.',
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
          en: 'Read Customer support automation and Business knowledge and FAQs.',
          ar: 'اقرأ «أتمتة دعم العملاء» و«معرفة العمل والأسئلة الشائعة».',
        },
      },
    ],
  },
  {
    slug: 'customer-support-automation',
    category: 'businesses',
    title: { en: 'Customer support automation', ar: 'أتمتة دعم العملاء' },
    description: {
      en: 'Consistent responses, escalation, and human handoff when needed.',
      ar: 'ردود متسقة، تصعيد، وتسليم بشري عند الحاجة.',
    },
    status: 'prototype',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Business Agents aim to handle repeatable support work — answering from knowledge, summarizing journeys, and preparing the next best action — while keeping boundaries you define.',
          ar: 'وكلاء الأعمال يهدفون لشغل الدعم المتكرر — الإجابة من المعرفة، تلخيص الرحلات، وتجهيز أفضل خطوة تالية — ضمن حدود تحددها.',
        },
      },
      {
        type: 'h2',
        id: 'grounded-answers',
        text: { en: 'Grounded answers', ar: 'إجابات مبنية على مصادر' },
      },
      {
        type: 'p',
        text: {
          en: 'Responses should cite business knowledge and policies you provide — not invent catalog or pricing facts. When sources are missing, the agent should ask clarifying questions or escalate.',
          ar: 'الردود يجب أن تستند إلى المعرفة والسياسات التي تقدّمها — لا إلى اختراع أسعار أو تفاصيل منتج. عند غياب المصادر، يطلب الوكيل توضيحًا أو يصعّد.',
        },
      },
      {
        type: 'h2',
        id: 'human-handoff',
        text: { en: 'Human handoff', ar: 'تسليم بشري' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Define when the agent stops and a person takes over.',
            ar: 'حدّد متى يتوقف الوكيل ويتولى شخص.',
          },
          {
            en: 'Pass journey context and preferences to the human agent.',
            ar: 'مرّر سياق الرحلة والتفضيلات للموظف.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'planned',
        text: {
          en: 'Deep integration with ticketing and CRM systems is planned guidance until marked available.',
          ar: 'الربط العميق مع التذاكر وCRM إرشاد مخطط حتى يُعلَم متاحًا.',
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
          en: 'Configure Messaging channel integrations and Website integration when those connectors are offered.',
          ar: 'اضبط «تكاملات قنوات المراسلة» و«تكامل الموقع» عند توفر الموصلات.',
        },
      },
    ],
    related: ['messaging-channel-integrations', 'customer-journeys-and-memory'],
  },
  {
    slug: 'messaging-channel-integrations',
    category: 'businesses',
    title: { en: 'Messaging channel integrations', ar: 'تكاملات قنوات المراسلة' },
    description: {
      en: 'Connect chat and messaging platforms to Business Agents.',
      ar: 'ربط الدردشة ومنصات المراسلة بوكلاء الأعمال.',
    },
    status: 'planned',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Business Agents are designed to meet customers on messaging platforms your business already uses. Connecting those channels is planned until Agentication marks specific platforms available.',
          ar: 'وكلاء الأعمال مصممون للقاء العملاء على منصات المراسلة التي تستخدمها. ربط القنوات مخطط حتى تعلّم Agentication المنصات المتاحة.',
        },
      },
      {
        type: 'h2',
        id: 'principles',
        text: { en: 'Integration principles', ar: 'مبادئ الربط' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'One agent configuration can serve multiple channels with consistent knowledge.',
            ar: 'تهيئة وكيل واحدة يمكن أن تخدم قنوات متعددة بمعرفة متسقة.',
          },
          {
            en: 'Channel-specific formatting without changing core business rules.',
            ar: 'تنسيق حسب القناة دون تغيير قواعد العمل الأساسية.',
          },
          {
            en: 'Respect opt-in, quiet hours, and regional messaging policies you set.',
            ar: 'احترام الموافقة وساعات الهدوء وسياسات المراسلة الإقليمية التي تضبطها.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'next-steps',
        text: { en: 'Next steps', ar: 'الخطوات التالية' },
      },
      {
        type: 'p',
        text: {
          en: 'Read Available integrations and Connecting an integration.',
          ar: 'اقرأ «التكاملات المتاحة» و«ربط تكامل».',
        },
      },
    ],
    related: ['available-integrations', 'connecting-an-integration'],
  },
  {
    slug: 'website-integration',
    category: 'businesses',
    title: { en: 'Website integration', ar: 'تكامل الموقع' },
    description: {
      en: 'Website widgets and on-site customer journeys.',
      ar: 'عناصر الموقع ورحلات العملاء على الموقع.',
    },
    status: 'planned',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Website widgets let visitors start a conversation from your site with the same knowledge and memory as other channels. Widget deployment is planned guidance until marked available.',
          ar: 'عناصر الموقع تتيح للزوار بدء محادثة من موقعك بنفس المعرفة والذاكرة. نشر العنصر إرشاد مخطط حتى يُعلَم متاحًا.',
        },
      },
      {
        type: 'h2',
        id: 'setup',
        text: { en: 'Typical setup (when available)', ar: 'إعداد نموذجي (عند التوفر)' },
      },
      {
        type: 'steps',
        items: [
          {
            title: { en: 'Choose placement', ar: 'اختر الموضع' },
            body: {
              en: 'Decide which pages show the widget and default language.',
              ar: 'حدّد الصفحات التي يظهر فيها العنصر واللغة الافتراضية.',
            },
          },
          {
            title: { en: 'Connect knowledge', ar: 'اربط المعرفة' },
            body: {
              en: 'Point the agent at FAQs, product docs, and policies you maintain.',
              ar: 'وجّه الوكيل إلى الأسئلة الشائعة ووثائق المنتج والسياسات.',
            },
          },
          {
            title: { en: 'Test journeys', ar: 'اختبر الرحلات' },
            body: {
              en: 'Walk through common intents before going live.',
              ar: 'مرّ على النوايا الشائعة قبل الإطلاق.',
            },
          },
        ],
      },
      {
        type: 'h2',
        id: 'next-steps',
        text: { en: 'Next steps', ar: 'الخطوات التالية' },
      },
      {
        type: 'p',
        text: {
          en: 'Read Business knowledge and FAQs and Customer journeys and memory.',
          ar: 'اقرأ «معرفة العمل والأسئلة الشائعة» و«رحلات العملاء والذاكرة».',
        },
      },
    ],
    related: ['business-knowledge-and-faqs', 'customer-journeys-and-memory'],
  },
  {
    slug: 'business-knowledge-and-faqs',
    category: 'businesses',
    title: { en: 'Business knowledge and FAQs', ar: 'معرفة العمل والأسئلة الشائعة' },
    description: {
      en: 'Sources, updates, and keeping answers accurate.',
      ar: 'المصادر والتحديث والحفاظ على دقة الإجابات.',
    },
    status: 'prototype',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Business Agents retrieve knowledge you connect — FAQs, product information, policies, and internal playbooks — to keep answers aligned with your source of truth.',
          ar: 'وكلاء الأعمال يسترجعون المعرفة التي تربطها — الأسئلة الشائعة، معلومات المنتج، السياسات، وكتيبات داخلية — ليبقى الرد متوافقًا مع مصدر الحقيقة.',
        },
      },
      {
        type: 'h2',
        id: 'maintain',
        text: { en: 'Maintain your knowledge', ar: 'حافظ على المعرفة' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Version policy and pricing pages when they change — agents do not guess live numbers.',
            ar: 'رقّم صفحات السياسة والأسعار عند تغييرها — الوكلاء لا يخمّنون أرقامًا حية.',
          },
          {
            en: 'Mark illustrative or sample content so it is not treated as contractual.',
            ar: 'علّم المحتوى التوضيحي أو النموذجي حتى لا يُعامل كالتزام تعاقدي.',
          },
          {
            en: 'Review retrieval gaps surfaced in business reports.',
            ar: 'راجع فجوات الاسترجاع الظاهرة في تقارير الأعمال.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: {
          en: 'For travel, commerce, or booking scenarios, always verify availability and price against connected systems.',
          ar: 'في السفر أو التجارة أو الحجز، تحقق دائمًا من التوفر والسعر عبر الأنظمة المتصلة.',
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
          en: 'Read Understanding AI limitations and Workflow automation.',
          ar: 'اقرأ «فهم حدود الذكاء الاصطناعي» و«أتمتة مسارات العمل».',
        },
      },
    ],
    related: ['understanding-ai-limitations', 'workflow-automation'],
  },
  {
    slug: 'customer-journeys-and-memory',
    category: 'businesses',
    title: { en: 'Customer journeys and memory', ar: 'رحلات العملاء والذاكرة' },
    description: {
      en: 'Persistent context, preferences, and next-best actions.',
      ar: 'سياق مستمر، تفضيلات، وأفضل خطوة تالية.',
    },
    status: 'prototype',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'The marketing preview shows journey context — intent detected, knowledge retrieved, preference saved, next action proposed. Memory helps the agent stay concise and relevant across turns.',
          ar: 'معاينة الموقع تعرض سياق الرحلة — نية مرصودة، معرفة مسترجعة، تفضيل محفوظ، خطوة مقترحة. الذاكرة تساعد الوكيل على البقاء مختصرًا وذا صلة عبر الجولات.',
        },
      },
      {
        type: 'h2',
        id: 'what-to-store',
        text: { en: 'What to store', ar: 'ماذا تخزّن' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Stated preferences (for example concise comparisons vs. long catalogs).',
            ar: 'تفضيلات مذكورة (مثل مقارنة مختصرة مقابل فهرس طويل).',
          },
          {
            en: 'Open tasks and commitments made to the customer.',
            ar: 'مهام مفتوحة والتزامات تجاه العميل.',
          },
          {
            en: 'Escalation history and resolution notes for humans.',
            ar: 'سجل التصعيد وملاحظات الحل للبشر.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'privacy',
        text: { en: 'Privacy and retention', ar: 'الخصوصية والاحتفاظ' },
      },
      {
        type: 'p',
        text: {
          en: 'Align memory retention with your privacy policy and Data privacy documentation. Do not store sensitive data unless your rules explicitly allow it.',
          ar: 'وائم احتفاظ الذاكرة مع سياسة الخصوصية وتوثيق «خصوصية البيانات». لا تخزّن بيانات حساسة إلا إذا سمحت قواعدك صراحة.',
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
          en: 'Read Business reports to review journey outcomes.',
          ar: 'اقرأ «تقارير الأعمال» لمراجعة نتائج الرحلات.',
        },
      },
    ],
    related: ['business-reports', 'data-privacy'],
  },
  {
    slug: 'workflow-automation',
    category: 'businesses',
    title: { en: 'Workflow automation', ar: 'أتمتة مسارات العمل' },
    description: {
      en: 'Rules, approvals, and operational steps beyond chat.',
      ar: 'قواعد وموافقات وخطوات تشغيل تتجاوز الدردشة.',
    },
    status: 'planned',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Business Agents can orchestrate multi-step workflows — notify teams, create tasks, or trigger integrations — under rules and approvals you configure.',
          ar: 'وكلاء الأعمال يمكنهم تنسيق مسارات متعددة الخطوات — إشعار الفرق، إنشاء مهام، أو تشغيل تكامل — تحت قواعد وموافقات تضبطها.',
        },
      },
      {
        type: 'callout',
        variant: 'planned',
        text: {
          en: 'Autonomous execution of operational workflows depends on connected tools and plan packaging when available.',
          ar: 'التنفيذ الذاتي لمسارات التشغيل يعتمد على الأدوات المتصلة والباقة عند التوفر.',
        },
      },
      {
        type: 'h2',
        id: 'design',
        text: { en: 'Design workflows safely', ar: 'صمّم المسارات بأمان' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Separate read-only research steps from write actions.',
            ar: 'افصل خطوات البحث للقراءة عن أفعال الكتابة.',
          },
          {
            en: 'Require approval for refunds, contract changes, or account access.',
            ar: 'اشترط موافقة للاسترداد أو تغيير العقد أو الوصول للحساب.',
          },
          {
            en: 'Log every action in business reports.',
            ar: 'سجّل كل فعل في تقارير الأعمال.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'next-steps',
        text: { en: 'Next steps', ar: 'الخطوات التالية' },
      },
      {
        type: 'p',
        text: {
          en: 'Read Security and permissions and Business agent plans.',
          ar: 'اقرأ «الأمان والصلاحيات» و«خطط وكيل الأعمال».',
        },
      },
    ],
    related: ['security-and-permissions', 'business-agent-plans'],
  },
  {
    slug: 'business-reports',
    category: 'businesses',
    title: { en: 'Business reports', ar: 'تقارير الأعمال' },
    description: {
      en: 'Outcomes, activity, and reports your team can act on.',
      ar: 'النتائج والنشاط وتقارير يتحرك عليها الفريق.',
    },
    status: 'planned',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Agentication’s execute step includes tracking outcomes and providing reports. For business agents, that means visibility into conversations, resolutions, escalations, and workflow results.',
          ar: 'خطوة التنفيذ في Agentication تتضمن تتبع النتائج وتقديم تقارير. لوكلاء الأعمال، ذلك يعني رؤية المحادثات والحلول والتصعيد ونتائج المسارات.',
        },
      },
      {
        type: 'h2',
        id: 'report-types',
        text: { en: 'What reports should answer', ar: 'ماذا يجب أن تجيب التقارير' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Which intents were handled vs. escalated?',
            ar: 'أي النوايا عولجت وأيها اُصعد؟',
          },
          {
            en: 'Where did knowledge retrieval fail or go stale?',
            ar: 'أين فشل الاسترجاع أو قدّم معلومة قديمة؟',
          },
          {
            en: 'Which automations ran and who approved them?',
            ar: 'أي أتمتة نفّذت ومن وافق عليها؟',
          },
        ],
      },
      {
        type: 'h2',
        id: 'next-steps',
        text: { en: 'Next steps', ar: 'الخطوات التالية' },
      },
      {
        type: 'p',
        text: {
          en: 'Compare PLUS and ENTERPRISE plan shapes for team controls on /pricing.',
          ar: 'قارن أشكال PLUS وENTERPRISE لضوابط الفريق على /pricing.',
        },
      },
    ],
    related: ['business-agent-plans', 'choosing-the-right-plan'],
  },
]
