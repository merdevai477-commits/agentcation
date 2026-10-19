import type { DocArticle } from '../types'

export const gettingStartedArticles: DocArticle[] = [
  {
    slug: 'welcome',
    category: 'getting-started',
    title: { en: 'Welcome to Agentication', ar: 'مرحبًا بك في Agentication' },
    description: {
      en: 'What you can do today on the platform and where to go next.',
      ar: 'ما الذي يمكنك فعله اليوم على المنصة وإلى أين تذهب بعد ذلك.',
    },
    status: 'available',
    related: ['what-is-agentication', 'create-your-first-agent', 'faq'],
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Agentication is a platform for specialized AI agents — not one generic chatbot. Our tagline is Get. Integrate. Grow. Build agents around your tools, context, and rules.',
          ar: 'Agentication منصة لوكلاء ذكاء متخصصين — وليس روبوت محادثة عامًا واحدًا. شعارنا: جهّز. اربط. انمُ. ابنِ وكلاء حول أدواتك وسياقك وقواعدك.',
        },
      },
      {
        type: 'callout',
        variant: 'info',
        title: { en: 'Available today', ar: 'متاح اليوم' },
        text: {
          en: 'You can explore the marketing site, try the simulated Dave Doctor demo on the homepage, create an account via sign-up, read this documentation, and compare plan shapes on pricing.',
          ar: 'يمكنك استكشاف الموقع، تجربة ديمو ديف دكتور المحاكى على الصفحة الرئيسية، إنشاء حساب عبر التسجيل، قراءة هذا التوثيق، ومقارنة أشكال الخطط في صفحة الأسعار.',
        },
      },
      {
        type: 'h2',
        id: 'start-here',
        text: { en: 'Start here', ar: 'ابدأ من هنا' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'New to the platform? Read What is Agentication? and How Agentication works.',
            ar: 'جديد على المنصة؟ اقرأ «ما هي Agentication؟» و«كيف تعمل Agentication».',
          },
          {
            en: 'Choosing between engineering and business use cases? See Choose the right agent.',
            ar: 'تختار بين الهندسة والأعمال؟ راجع «اختر الوكيل المناسب».',
          },
          {
            en: 'Ready to explore products? Visit For developers or For businesses on the site.',
            ar: 'مستعد لاستكشاف المنتجات؟ زُر «للمطوّرين» أو «للأعمال» على الموقع.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'prototype-products',
        text: { en: 'Prototype products on the site', ar: 'منتجات نموذجية على الموقع' },
      },
      {
        type: 'p',
        text: {
          en: 'Dave Doctor (AI engineering agent) and Business Agents are shown on the marketing site and labeled PROTOTYPE. Demos and sample workflows illustrate direction — they are not a guarantee that every capability is live in your account yet.',
          ar: 'ديف دكتور (وكيل هندسي) ووكلاء الأعمال معروضان على الموقع ومُعلَّمان كنموذج. العروض ومسارات العمل النموذجية توضّح الاتجاه — وليست ضمانًا أن كل قدرة متاحة في حسابك اليوم.',
        },
      },
      {
        type: 'callout',
        variant: 'warning',
        text: {
          en: 'The interactive Dave Doctor demo on the homepage uses simulated replies only. It does not connect to your repositories or production systems.',
          ar: 'ديمو ديف دكتور التفاعلي على الصفحة الرئيسية يستخدم ردودًا محاكاة فقط. لا يتصل بمستودعاتك أو أنظمة الإنتاج.',
        },
      },
      {
        type: 'h2',
        id: 'next-steps',
        text: { en: 'Practical next steps', ar: 'خطوات عملية تالية' },
      },
      {
        type: 'steps',
        items: [
          {
            title: { en: 'Create an account', ar: 'أنشئ حسابًا' },
            body: {
              en: 'Use Sign up on the website. Sign-in is powered by Clerk.',
              ar: 'استخدم «التسجيل» على الموقع. الدخول مدعوم عبر Clerk.',
            },
          },
          {
            title: { en: 'Try the simulated demo', ar: 'جرّب الديمو المحاكى' },
            body: {
              en: 'On the homepage, describe an incident or scenario and review the visible trace and proposed action.',
              ar: 'على الصفحة الرئيسية، صف حادثًا أو سيناريو وراجع الأثر الظاهر والفعل المقترح.',
            },
          },
          {
            title: { en: 'Compare plan shapes', ar: 'قارن أشكال الخطط' },
            body: {
              en: 'Open /pricing or the pricing section. Pricing is published as packaging is finalized — we do not list invented limits here.',
              ar: 'افتح /pricing أو قسم الأسعار. الأسعار تُنشر عند تثبيت الباقات — لا نذكر حدودًا مخترعة هنا.',
            },
          },
        ],
      },
    ],
  },
  {
    slug: 'what-is-agentication',
    category: 'getting-started',
    title: { en: 'What is Agentication?', ar: 'ما هي Agentication؟' },
    description: {
      en: 'Platform purpose, specialized agents, and how it differs from a single chatbot.',
      ar: 'غرض المنصة، الوكلاء المتخصصون، وكيف تختلف عن محادثة واحدة.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Agentication gives teams a shared foundation to configure AI agents with roles, integrations, knowledge, memory, rules, and execution — so automation stays visible, permissioned, and aligned with how you work.',
          ar: 'Agentication تمنح الفرق أساسًا مشتركًا لتهيئة وكلاء الذكاء بأدوار وربط ومعرفة وذاكرة وقواعد وتنفيذ — ليبقى الأتمتة ظاهرًا، بصلاحيات، ومتوافقًا مع طريقة شغلك.',
        },
      },
      {
        type: 'h2',
        id: 'specialized-agents',
        text: { en: 'Specialized agents, one platform', ar: 'وكلاء متخصصون، منصة واحدة' },
      },
      {
        type: 'p',
        text: {
          en: 'Instead of one generic assistant, Agentication is designed around distinct agent types — for example Dave Doctor for engineering incidents and Business Agents for customer and operational workflows.',
          ar: 'بدل مساعد عام واحد، صُمّمت Agentication حول أنواع وكلاء متخصصة — مثل ديف دكتور لحوادث الهندسة ووكلاء الأعمال لمسارات العملاء والتشغيل.',
        },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Dave Doctor — AI engineering partner (PROTOTYPE on the site).',
            ar: 'ديف دكتور — شريك هندسي (نموذج على الموقع).',
          },
          {
            en: 'Business Agents — built around channels, knowledge, and operations (PROTOTYPE on the site).',
            ar: 'وكلاء الأعمال — مبنيون حول القنوات والمعرفة والتشغيل (نموذج على الموقع).',
          },
        ],
      },
      {
        type: 'h2',
        id: 'foundation',
        text: { en: 'Configurable agent foundation', ar: 'أساس وكيل قابل للضبط' },
      },
      {
        type: 'p',
        text: {
          en: 'The marketing site describes agent configuration, reasoning models, tools and integrations, knowledge retrieval, memory and rules, and an execution engine with approvals. Models provide reasoning; your systems provide data; your rules control actions.',
          ar: 'يصف الموقع تهيئة الوكيل، نماذج التفكير، الأدوات والربط، استرجاع المعرفة، الذاكرة والقواعد، ومحرك تنفيذ بموافقات. النماذج تفكّر؛ أنظمتك تعطي البيانات؛ قواعدك تتحكم في الفعل.',
        },
      },
      {
        type: 'h2',
        id: 'what-is-not',
        text: { en: 'What Agentication is not', ar: 'ما ليست Agentication' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Not a promise of fully autonomous production changes without human approval — Dave Doctor explicitly does not deploy without approval in the demo narrative.',
            ar: 'ليست وعدًا بتغييرات إنتاج ذاتية بالكامل دون موافقة — ديف دكتور صراحة لا ينشر دون موافقة في سرد الديمو.',
          },
          {
            en: 'Not 24/7 monitoring unless coverage hours are configured and active when that capability is available.',
            ar: 'ليست مراقبة 24/7 إلا إذا ضُبطت ساعات التغطية وكانت فعّالة عند توفر هذه القدرة.',
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
          en: 'Continue with How Agentication works, then Choose the right agent for your team.',
          ar: 'تابع بـ«كيف تعمل Agentication»، ثم «اختر الوكيل المناسب» لفريقك.',
        },
      },
    ],
    related: ['how-agentication-works', 'choose-the-right-agent'],
  },
  {
    slug: 'how-agentication-works',
    category: 'getting-started',
    title: { en: 'How Agentication works', ar: 'كيف تعمل Agentication' },
    description: {
      en: 'From defining an agent to integrating tools, configuring rules, and tracking outcomes.',
      ar: 'من تعريف الوكيل إلى ربط الأدوات وضبط القواعد وتتبع النتائج.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'The platform follows a clear lifecycle: define the agent, integrate systems, configure behavior, then execute and review outcomes.',
          ar: 'تتبع المنصة دورة واضحة: حدّد الوكيل، اربط الأنظمة، اضبط السلوك، ثم نفّذ وراجع النتائج.',
        },
      },
      {
        type: 'h2',
        id: 'four-steps',
        text: { en: 'Four steps on the marketing site', ar: 'أربع خطوات على الموقع' },
      },
      {
        type: 'steps',
        items: [
          {
            title: { en: 'Define', ar: 'حدّد' },
            body: {
              en: 'Describe the role, goals, capabilities, and boundaries for the agent.',
              ar: 'صف الدور والأهداف والقدرات والحدود للوكيل.',
            },
          },
          {
            title: { en: 'Integrate', ar: 'اربط' },
            body: {
              en: 'Connect tools, APIs, repositories, and data sources your agent needs.',
              ar: 'صل الأدوات والواجهات والمستودعات ومصادر البيانات التي يحتاجها الوكيل.',
            },
          },
          {
            title: { en: 'Configure', ar: 'اضبط' },
            body: {
              en: 'Set memory, permissions, schedules, and business rules.',
              ar: 'اضبط الذاكرة والصلاحيات والجداول وقواعد العمل.',
            },
          },
          {
            title: { en: 'Execute', ar: 'نفّذ' },
            body: {
              en: 'Track outcomes and use reports your team can act on.',
              ar: 'تتبّع النتائج واستخدم تقارير يقدر الفريق يتحرك عليها.',
            },
          },
        ],
      },
      {
        type: 'h2',
        id: 'operating-modes',
        text: { en: 'Operating modes (product concept)', ar: 'أنماط التشغيل (مفهوم منتج)' },
      },
      {
        type: 'p',
        text: {
          en: 'Dave Doctor is described with three modes: OBSERVE, ASSIST, and AUTONOMOUS. These represent how much the agent monitors, investigates, and executes under policy — presented as a prototype/planned concept, not as fully production-operational for every workspace today.',
          ar: 'يُوصف ديف دكتور بثلاثة أنماط: مراقبة، مساعدة، وذاتي. تمثل مدى مراقبة الوكيل والتحقيق والتنفيذ تحت السياسة — كمفهوم نموذج/مخطط، وليس تشغيلًا إنتاجيًا كاملًا لكل مساحة عمل اليوم.',
        },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'OBSERVE — Monitor and report issues as they emerge.',
            ar: 'مراقبة — يراقب ويبلّغ عن المشاكل فور ظهورها.',
          },
          {
            en: 'ASSIST — Investigate incidents and prepare proposed fixes.',
            ar: 'مساعدة — يحقّق في الحادث ويجهّز إصلاحًا مقترحًا.',
          },
          {
            en: 'AUTONOMOUS — Execute explicitly authorized actions under configured policies and safeguards.',
            ar: 'ذاتي — ينفّذ أفعالًا مصرّحًا بها فقط تحت سياسات وضوابط مضبوطة.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'planned',
        text: {
          en: 'Full operational use of all modes across real monitoring and deploy pipelines depends on integrations and packaging as they become available.',
          ar: 'الاستخدام التشغيلي الكامل لكل الأنماط عبر مراقبة ونشر حقيقيين يعتمد على الربط والباقات عند توفرها.',
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
          en: 'Developers: Meet Dave Doctor. Businesses: Meet Business Agents. Everyone: Understanding our plans.',
          ar: 'المطوّرون: تعرّف على ديف دكتور. الأعمال: تعرّف على وكلاء الأعمال. للجميع: فهم خططنا.',
        },
      },
    ],
    related: ['meet-dave-doctor', 'meet-business-agents', 'understanding-our-plans'],
  },
  {
    slug: 'choose-the-right-agent',
    category: 'getting-started',
    title: { en: 'Choose the right agent', ar: 'اختر الوكيل المناسب' },
    description: {
      en: 'Pick Dave Doctor, Business Agents, or explore both before you commit.',
      ar: 'اختر ديف دكتور أو وكلاء الأعمال أو استكشف الاثنين قبل الالتزام.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Agentication supports different jobs-to-be-done. Use the guide below to align your first agent with the problem you need to solve.',
          ar: 'Agentication تدعم مهامًا مختلفة. استخدم الدليل أدناه لمواءمة وكيلك الأول مع المشكلة التي تريد حلها.',
        },
      },
      {
        type: 'h2',
        id: 'decision-guide',
        text: { en: 'What are you trying to do?', ar: 'ماذا تحاول أن تفعل؟' },
      },
      {
        type: 'cards',
        items: [
          {
            title: {
              en: '“I build software and need help understanding errors.”',
              ar: '«أبني برمجيات وأحتاج فهم الأخطاء.»',
            },
            body: {
              en: 'Explore Dave Doctor — investigation-focused engineering agent (prototype).',
              ar: 'استكشف ديف دكتور — وكيل هندسي للتحقيق (نموذج).',
            },
            href: '/docs/meet-dave-doctor',
          },
          {
            title: {
              en: '“I want to monitor my application’s health.”',
              ar: '«أريد مراقبة صحة تطبيقي.»',
            },
            body: {
              en: 'Explore Dave Doctor’s monitoring and incident analysis guidance.',
              ar: 'استكشف إرشادات مراقبة ديف دكتور وتحليل الحوادث.',
            },
            href: '/docs/monitoring-and-incident-analysis',
          },
          {
            title: {
              en: '“I receive too many customer inquiries.”',
              ar: '«أتلقى استفسارات عملاء كثيرة.»',
            },
            body: {
              en: 'Explore Business Agents for support automation (prototype).',
              ar: 'استكشف وكلاء الأعمال لأتمتة الدعم (نموذج).',
            },
            href: '/docs/meet-business-agents',
          },
          {
            title: {
              en: '“I want messaging plus business knowledge.”',
              ar: '«أريد الرسائل مع معرفة العمل.»',
            },
            body: {
              en: 'Explore Business Agents and supported integrations (many planned).',
              ar: 'استكشف وكلاء الأعمال والربط المدعوم (كثير منه مخطط).',
            },
            href: '/docs/messaging-channel-integrations',
          },
          {
            title: {
              en: '“I need an agent that remembers preferences and follows up.”',
              ar: '«أحتاج وكيلًا يتذكر التفضيلات ويتابع.»',
            },
            body: {
              en: 'Explore customer journeys and persistent context.',
              ar: 'استكشف رحلات العملاء والسياق المستمر.',
            },
            href: '/docs/customer-journeys-and-memory',
          },
          {
            title: { en: 'Compare plan shapes', ar: 'قارن أشكال الخطط' },
            body: {
              en: 'FREE, PRO, PLUS, and ENTERPRISE — prices published as packaging is finalized.',
              ar: 'FREE وPRO وPLUS وENTERPRISE — الأسعار تُنشر عند تثبيت الباقات.',
            },
            href: '/docs/understanding-our-plans',
          },
        ],
      },
      {
        type: 'h2',
        id: 'when-dave',
        text: { en: 'When Dave Doctor fits', ar: 'متى يناسب ديف دكتور' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'You want investigation and remediation proposals tied to code, monitoring, and deploy context.',
            ar: 'تريد تحقيقًا ومقترحات إصلاح مرتبطة بالكود والمراقبة وسياق النشر.',
          },
          {
            en: 'You expect human approval before production changes — matching the product stance on deploys.',
            ar: 'تتوقع موافقة بشرية قبل تغييرات الإنتاج — بما يتوافق مع موقف المنتج من النشر.',
          },
        ],
      },
      {
        type: 'cards',
        items: [
          {
            title: { en: 'Product page', ar: 'صفحة المنتج' },
            body: {
              en: 'Open the Dave Doctor section on the website.',
              ar: 'افتح قسم ديف دكتور على الموقع.',
            },
            href: '/developers',
          },
          {
            title: { en: 'Docs: what Dave can do', ar: 'التوثيق: قدرات ديف' },
            body: {
              en: 'Capabilities, modes, and honest limitations.',
              ar: 'القدرات والأنماط والحدود بوضوح.',
            },
            href: '/docs/what-dave-doctor-can-do',
          },
        ],
      },
      {
        type: 'h2',
        id: 'when-business',
        text: { en: 'When Business Agents fit', ar: 'متى تناسب وكلاء الأعمال' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'You need consistent answers grounded in business knowledge across channels.',
            ar: 'تحتاج إجابات متسقة مبنية على معرفة العمل عبر القنوات.',
          },
          {
            en: 'You want journey memory and workflow automation — subject to integrations when available.',
            ar: 'تريد ذاكرة الرحلة وأتمتة مسارات — حسب توفر الربط.',
          },
        ],
      },
      {
        type: 'cards',
        items: [
          {
            title: { en: 'Product page', ar: 'صفحة المنتج' },
            body: {
              en: 'Open the Business Agents section on the website.',
              ar: 'افتح قسم وكلاء الأعمال على الموقع.',
            },
            href: '/businesses',
          },
          {
            title: { en: 'Docs: customer support', ar: 'التوثيق: دعم العملاء' },
            body: {
              en: 'How agents handle inquiries and escalation.',
              ar: 'كيف يتعامل الوكلاء مع الاستفسارات والتصعيد.',
            },
            href: '/docs/customer-support-automation',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        title: { en: 'Illustrative examples', ar: 'أمثلة توضيحية' },
        text: {
          en: 'The travel-agency Germany example on the site is illustrative. Prices, availability, and bookings depend on connected sources and must be verified.',
          ar: 'مثال وكالة السفر في ألمانيا على الموقع توضيحي. الأسعار والتوفر والحجوزات تعتمد على المصادر المتصلة ويجب التحقق منها.',
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
          en: 'Create your first agent when account setup flows are available in your workspace, and keep reading the category that matches your choice.',
          ar: 'أنشئ وكيلك الأول عندما تتوفر مسارات إعداد الحساب في مساحة عملك، وتابع قراءة الفئة التي تناسب اختيارك.',
        },
      },
    ],
    related: ['create-your-first-agent', 'developer-agent-plans', 'business-agent-plans'],
  },
  {
    slug: 'create-your-first-agent',
    category: 'getting-started',
    title: { en: 'Create your first agent', ar: 'أنشئ وكيلك الأول' },
    description: {
      en: 'Account creation, exploration paths, and preparing for agent setup.',
      ar: 'إنشاء الحساب، مسارات الاستكشاف، والاستعداد لإعداد الوكيل.',
    },
    status: 'available',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Today, the primary path is to sign up, explore product pages, and use documentation to plan your agent. Full in-product agent builders for every capability may still be rolling out alongside prototype features.',
          ar: 'اليوم، المسار الأساسي هو التسجيل واستكشاف صفحات المنتج واستخدام التوثيق للتخطيط لوكيلك. منشئو الوكلاء داخل المنتج لكل قدرة قد يُطلَقون تدريجيًا مع الميزات النموذجية.',
        },
      },
      {
        type: 'h2',
        id: 'create-account',
        text: { en: 'Create your account', ar: 'أنشئ حسابك' },
      },
      {
        type: 'steps',
        items: [
          {
            title: { en: 'Sign up', ar: 'سجّل' },
            body: {
              en: 'Go to /sign-up on the website and complete registration. Sign-in uses Clerk.',
              ar: 'اذهب إلى /sign-up على الموقع وأكمل التسجيل. الدخول عبر Clerk.',
            },
          },
          {
            title: { en: 'Sign in later', ar: 'ادخل لاحقًا' },
            body: {
              en: 'Use /sign-in when you return. Support and account options may appear inside signed-in flows when available.',
              ar: 'استخدم /sign-in عند العودة. الدعم وخيارات الحساب قد تظهر داخل مسارات الدخول عند توفرها.',
            },
          },
        ],
      },
      {
        type: 'h2',
        id: 'explore-before-build',
        text: { en: 'Explore before you build', ar: 'استكشف قبل البناء' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Homepage — simulated Dave Doctor demo (simulated replies only).',
            ar: 'الصفحة الرئيسية — ديمو ديف دكتور محاكى (ردود محاكاة فقط).',
          },
          {
            en: '/developers or /#developers — Dave Doctor overview (PROTOTYPE).',
            ar: '/developers أو /#developers — نظرة على ديف دكتور (نموذج).',
          },
          {
            en: '/businesses or /#businesses — Business Agents overview (PROTOTYPE).',
            ar: '/businesses أو /#businesses — نظرة على وكلاء الأعمال (نموذج).',
          },
          {
            en: '/pricing or /#pricing — compare FREE, PRO, PLUS, ENTERPRISE shapes.',
            ar: '/pricing أو /#pricing — قارن أشكال FREE وPRO وPLUS وENTERPRISE.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'prepare-agent',
        text: { en: 'Prepare agent definition', ar: 'جهّز تعريف الوكيل' },
      },
      {
        type: 'p',
        text: {
          en: 'Draft role, goals, boundaries, and which integrations you will need. For engineering agents, list repositories and monitoring sources you expect to connect when GitHub and monitoring integrations are available. For business agents, list channels, FAQ sources, and escalation rules.',
          ar: 'اكتب مسودة للدور والأهداف والحدود وأي ربط تحتاجه. لوكلاء الهندسة، اذكر المستودعات ومصادر المراقبة التي تتوقع ربطها عند توفر GitHub والمراقبة. لوكلاء الأعمال، اذكر القنوات ومصادر الأسئلة الشائعة وقواعد التصعيد.',
        },
      },
      {
        type: 'callout',
        variant: 'planned',
        text: {
          en: 'GitHub, production monitoring tools, messaging platforms, website widgets, and autonomous deploys are documented as planned or guidance until marked available in product.',
          ar: 'GitHub وأدوات المراقبة الإنتاجية ومنصات المراسلة وعناصر الموقع والنشر الذاتي موثّقة كمخطط أو إرشاد حتى تُعلَم متاحة في المنتج.',
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
          en: 'Read Connecting an integration and the developer or business article series that matches your agent type.',
          ar: 'اقرأ «ربط تكامل» وسلسلة مقالات المطوّرين أو الأعمال التي تناسب نوع وكيلك.',
        },
      },
    ],
    related: ['connecting-an-integration', 'meet-dave-doctor', 'meet-business-agents'],
  },
]
