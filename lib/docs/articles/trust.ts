import type { DocArticle } from '../types'

export const trustArticles: DocArticle[] = [
  {
    slug: 'data-privacy',
    category: 'trust',
    title: { en: 'Data privacy', ar: 'خصوصية البيانات' },
    description: {
      en: 'How to think about customer, code, and account data with agents.',
      ar: 'كيف تفكر في بيانات العملاء والكود والحساب مع الوكلاء.',
    },
    related: ['security-and-permissions', 'understanding-ai-limitations'],
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Agents work best with context — but context must follow your privacy commitments. Agentication is designed around permissioned access and visible actions; you control which integrations and knowledge sources are in scope.',
          ar: 'الوكلاء يعملون أفضل مع سياق — لكن السياق يجب أن يلتزم بوعود الخصوصية. Agentication مصممة حول وصول بصلاحيات وأفعال ظاهرة؛ أنت تتحكم في التكاملات ومصادر المعرفة ضمن النطاق.',
        },
      },
      {
        type: 'h2',
        id: 'minimize',
        text: { en: 'Minimize sensitive data', ar: 'قلّل البيانات الحساسة' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Connect only the repositories, channels, and documents required for the agent role.',
            ar: 'اربط فقط المستودعات والقنوات والمستندات التي يتطلبها دور الوكيل.',
          },
          {
            en: 'Avoid placing secrets in prompts or knowledge bases — use integration credentials instead when available.',
            ar: 'تجنب وضع أسرار في التوجيهات أو قواعد المعرفة — استخدم اعتمادات الربط عند التوفر.',
          },
          {
            en: 'Align journey memory retention with your published privacy policy (/privacy on the site).',
            ar: 'وائم احتفاظ ذاكرة الرحلة مع سياسة الخصوصية المنشورة (/privacy على الموقع).',
          },
        ],
      },
      {
        type: 'h2',
        id: 'customer-data',
        text: { en: 'Customer-facing agents', ar: 'وكلاء مواجهة للعملاء' },
      },
      {
        type: 'p',
        text: {
          en: 'Business Agents should not invent personal records or payment details. Verify transactional answers against connected systems — especially for illustrative commerce or travel examples on the marketing site.',
          ar: 'وكلاء الأعمال لا يجب أن يختلقوا سجلات شخصية أو تفاصيل دفع. تحقق من إجابات المعاملات عبر الأنظمة المتصلة — خاصة في أمثلة التجارة أو السفر التوضيحية على الموقع.',
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
          en: 'Read Security and permissions and the site Privacy page.',
          ar: 'اقرأ «الأمان والصلاحيات» وصفحة الخصوصية على الموقع.',
        },
      },
    ],
  },
  {
    slug: 'security-and-permissions',
    category: 'trust',
    title: { en: 'Security and permissions', ar: 'الأمان والصلاحيات' },
    description: {
      en: 'Approval-aware execution, least privilege, and team controls.',
      ar: 'تنفيذ بموافقة، أقل صلاحية، وضوابط الفريق.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Agentication emphasizes approval-aware, permissioned automation. The marketing site highlights chips such as approval-aware and model-agnostic architecture — actions should be visible and constrained by your rules.',
          ar: 'Agentication تؤكد أتمتة بموافقة وصلاحيات. الموقع يبرز مثل «بموافقة» وهيكل مستقل عن النموذج — الأفعال يجب أن تكون ظاهرة ومقيدة بقواعدك.',
        },
      },
      {
        type: 'h2',
        id: 'engineering-safety',
        text: { en: 'Engineering safety', ar: 'سلامة الهندسة' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Separate observe/investigate permissions from merge or deploy permissions.',
            ar: 'افصل صلاحيات المراقبة/التحقيق عن الدمج أو النشر.',
          },
          {
            en: 'Dave Doctor does not deploy without human approval in the public demo narrative.',
            ar: 'ديف دكتور لا ينشر دون موافقة بشرية في سرد الديمو العام.',
          },
          {
            en: 'AUTONOMOUS mode, when offered, still means explicitly authorized actions under policies — not unbounded access.',
            ar: 'النمط الذاتي، عند طرحه، يعني أفعالًا مصرّحًا بها تحت سياسات — لا وصولًا بلا حدود.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'account-security',
        text: { en: 'Account access', ar: 'وصول الحساب' },
      },
      {
        type: 'p',
        text: {
          en: 'Sign-up and sign-in use Clerk. Protect your account credentials and review connected integrations periodically when those screens are available.',
          ar: 'التسجيل والدخول عبر Clerk. احمِ اعتمادات حسابك وراجع التكاملات المتصلة دوريًا عند توفر هذه الشاشات.',
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
          en: 'Read Permissions and access (Integrations) and ENTERPRISE plan shape for custom security conversations.',
          ar: 'اقرأ «الصلاحيات والوصول» (الربط) وشكل ENTERPRISE لمحادثات الأمان المخصصة.',
        },
      },
    ],
    related: ['permissions-and-access', 'developer-agent-plans'],
  },
  {
    slug: 'understanding-ai-limitations',
    category: 'trust',
    title: { en: 'Understanding AI limitations', ar: 'فهم حدود الذكاء الاصطناعي' },
    description: {
      en: 'Hallucination risk, verification, and prototype features.',
      ar: 'خطر الهلوسة، التحقق، والميزات النموذجية.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'AI agents reason over models and retrieved context. They can be wrong — especially when knowledge is missing, integrations are not connected, or the scenario is illustrative rather than live data.',
          ar: 'وكلاء الذكاء يفكّرون عبر النماذج والسياق المسترجع. قد يخطئون — خاصة عند غياب المعرفة أو عدم ربط التكاملات أو عندما يكون السيناريو توضيحيًا لا بيانات حية.',
        },
      },
      {
        type: 'h2',
        id: 'verify',
        text: { en: 'Verify before you act', ar: 'تحقق قبل أن تتصرف' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Treat proposed fixes, rollbacks, and customer quotes as drafts until a human validates them.',
            ar: 'اعتبر الإصلاحات والتراجعات وعروض العملاء مسودات حتى يتحقق شخص.',
          },
          {
            en: 'For prices, availability, and bookings — always confirm against connected sources.',
            ar: 'للأسعار والتوفر والحجوزات — أكّد دائمًا عبر المصادر المتصلة.',
          },
          {
            en: 'The homepage Dave Doctor demo is simulated — not evidence of live system access.',
            ar: 'ديمو ديف دكتور على الصفحة الرئيسية محاكى — ليس دليلًا على وصول حي للأنظمة.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: {
          en: 'Product concepts on the marketing site are illustrative where labeled. PROTOTYPE badges mean capabilities may not be fully operational.',
          ar: 'مفاهيم المنتج على الموقع توضيحية حيث وُسمت. شارة «نموذج» تعني أن القدرات قد لا تكون تشغيلية بالكامل.',
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
          en: 'Read FAQ and Business knowledge and FAQs.',
          ar: 'اقرأ «الأسئلة الشائعة» و«معرفة العمل والأسئلة الشائعة».',
        },
      },
    ],
    related: ['faq', 'business-knowledge-and-faqs'],
  },
  {
    slug: 'faq',
    category: 'trust',
    title: { en: 'FAQ', ar: 'الأسئلة الشائعة' },
    description: {
      en: 'Quick answers about Agentication, demos, plans, and availability.',
      ar: 'إجابات سريعة عن Agentication والعروض والخطط والتوفر.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Answers reflect the live marketing site and honest product maturity. For pricing legalities, see Pricing and billing FAQs and site Terms.',
          ar: 'الإجابات تعكس الموقع الحي ونضج المنتج بصدق. للمسائل القانونية للأسعار، راجع «أسئلة الأسعار والفوترة» وشروط الموقع.',
        },
      },
      {
        type: 'h2',
        id: 'product',
        text: { en: 'Product', ar: 'المنتج' },
      },
      {
        type: 'h3',
        id: 'faq-what-is',
        text: { en: 'What is Agentication?', ar: 'ما هي Agentication؟' },
      },
      {
        type: 'p',
        text: {
          en: 'A platform for specialized AI agents — Dave Doctor for engineering and Business Agents for customer and operational work. Tagline: Get. Integrate. Grow.',
          ar: 'منصة لوكلاء ذكاء متخصصين — ديف دكتور للهندسة ووكلاء الأعمال للعملاء والتشغيل. الشعار: جهّز. اربط. انمُ.',
        },
      },
      {
        type: 'h3',
        id: 'faq-demo',
        text: { en: 'Is the Dave Doctor demo real?', ar: 'هل ديمو ديف دكتور حقيقي؟' },
      },
      {
        type: 'p',
        text: {
          en: 'No. The interactive homepage demo uses simulated replies only and does not access your infrastructure.',
          ar: 'لا. الديمو التفاعلي على الصفحة الرئيسية يستخدم ردودًا محاكاة فقط ولا يصل إلى بنيتك.',
        },
      },
      {
        type: 'h3',
        id: 'faq-deploy',
        text: { en: 'Will Dave Doctor deploy fixes automatically?', ar: 'هل ينشر ديف دكتور الإصلاحات تلقائيًا؟' },
      },
      {
        type: 'p',
        text: {
          en: 'Not without human approval. Autonomous deploy concepts are policy-bound and planned; the demo explicitly states production is not changed without a person approving.',
          ar: 'لا دون موافقة بشرية. مفاهيم النشر الذاتي مقيدة بالسياسة ومخططة؛ الديمو يصرّح أن الإنتاج لا يتغير دون موافقة شخص.',
        },
      },
      {
        type: 'h3',
        id: 'faq-monitoring',
        text: { en: 'Does Agentication monitor 24/7?', ar: 'هل تراقب Agentication 24/7؟' },
      },
      {
        type: 'p',
        text: {
          en: 'Not by default. Scheduled coverage (up to 12h/day proposed) applies when configured and active. Outside that window, the agent is not continuously monitoring.',
          ar: 'ليس افتراضيًا. التغطية المجدولة (حتى 12 س/يوم مقترحة) عند الضبط والتفعيل. خارج النافذة، الوكيل لا يراقب باستمرار.',
        },
      },
      {
        type: 'h2',
        id: 'plans-availability',
        text: { en: 'Plans and availability', ar: 'الخطط والتوفر' },
      },
      {
        type: 'h3',
        id: 'faq-plans',
        text: { en: 'Which plans exist?', ar: 'ما الخطط المتاحة؟' },
      },
      {
        type: 'p',
        text: {
          en: 'FREE, PRO, PLUS, and ENTERPRISE shapes are shown on /pricing. Pricing is published as packaging is finalized.',
          ar: 'أشكال FREE وPRO وPLUS وENTERPRISE على /pricing. الأسعار تُنشر عند تثبيت الباقات.',
        },
      },
      {
        type: 'h3',
        id: 'faq-available-now',
        text: { en: 'What can I use today?', ar: 'ماذا أستخدم اليوم؟' },
      },
      {
        type: 'p',
        text: {
          en: 'Explore the site, try the simulated demo, sign up, read docs, and compare plan shapes. Deep integrations and prototype flows may require future releases.',
          ar: 'استكشف الموقع، جرّب الديمو المحاكى، سجّل، اقرأ التوثيق، وقارن أشكال الخطط. الربط العميق والمسارات النموذجية قد تحتاج إصدارات لاحقة.',
        },
      },
      {
        type: 'h3',
        id: 'faq-travel',
        text: { en: 'Is the travel agency example real?', ar: 'هل مثال وكالة السفر حقيقي؟' },
      },
      {
        type: 'p',
        text: {
          en: 'It is illustrative. Prices, availability, and bookings depend on connected sources and must be verified.',
          ar: 'هو توضيحي. الأسعار والتوفر والحجوزات تعتمد على المصادر المتصلة ويجب التحقق منها.',
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
          en: 'Still stuck? Read Troubleshooting common problems or Contact and support.',
          ar: 'ما زلت عالقًا؟ اقرأ «استكشاف المشاكل الشائعة» أو «التواصل والدعم».',
        },
      },
    ],
    related: ['pricing-and-billing-faqs', 'welcome'],
  },
  {
    slug: 'troubleshooting-common-problems',
    category: 'trust',
    title: { en: 'Troubleshooting common problems', ar: 'استكشاف المشاكل الشائعة' },
    description: {
      en: 'Docs, sign-in, demos, and expectation mismatches.',
      ar: 'التوثيق والدخول والعروض وتوقعات غير متطابقة.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Many issues are confusion between marketing prototypes and live account capabilities — not a broken browser.',
          ar: 'كثير من المشاكل لبس بين النماذج التسويقية وقدرات الحساب الحية — لا متصفحًا معطوبًا.',
        },
      },
      {
        type: 'h2',
        id: 'demo',
        text: { en: 'Demo behaves unexpectedly', ar: 'الديمو يتصرف بشكل غير متوقع' },
      },
      {
        type: 'p',
        text: {
          en: 'The homepage demo is scripted simulation. It will not clone your production incident or open real PRs. Use it to understand trace + proposed action UX.',
          ar: 'ديمو الصفحة الرئيسية محاكاة مكتوبة مسبقًا. لن يستنسخ حادث إنتاجك أو يفتح طلب سحب حقيقيًا. استخدمه لفهم تجربة الأثر والفعل المقترح.',
        },
      },
      {
        type: 'h2',
        id: 'missing-feature',
        text: { en: 'Feature shown on site but missing in account', ar: 'ميزة على الموقع وغائبة من الحساب' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Check for PROTOTYPE or illustrative labels on the marketing page.',
            ar: 'ابحث عن تسميات «نموذج» أو «توضيحي» على صفحة التسويق.',
          },
          {
            en: 'Read Available integrations — GitHub, monitoring, messaging, and widgets are often planned.',
            ar: 'اقرأ «التكاملات المتاحة» — GitHub والمراقبة والمراسلة والعناصر غالبًا مخططة.',
          },
          {
            en: 'Compare your plan shape on /pricing; packaging may gate advanced features when they launch.',
            ar: 'قارن شكل خطتك على /pricing؛ الباقات قد تقيّد الميزات المتقدمة عند الإطلاق.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'sign-in',
        text: { en: 'Sign-in issues', ar: 'مشاكل الدخول' },
      },
      {
        type: 'p',
        text: {
          en: 'Sign-in uses Clerk. Clear browser cookies, try another browser, and ensure you completed sign-up at /sign-up. For persistent account lockouts, use Contact and support paths — we do not list a fake support email here.',
          ar: 'الدخول عبر Clerk. امسح cookies أو جرّب متصفحًا آخر وتأكد من إكمال التسجيل في /sign-up. للحظر المستمر، استخدم مسارات «التواصل والدعم» — لا نذكر بريد دعم وهميًا هنا.',
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
          en: 'Integration-specific issues: Troubleshooting integrations.',
          ar: 'مشاكل الربط: «استكشاف أخطاء التكاملات».',
        },
      },
    ],
    related: ['troubleshooting-integrations', 'contact-and-support'],
  },
  {
    slug: 'contact-and-support',
    category: 'trust',
    title: { en: 'Contact and support', ar: 'التواصل والدعم' },
    description: {
      en: 'Where to get help without invented contact details.',
      ar: 'أين تحصل على المساعدة دون تفاصيل اتصال مخترعة.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Agentication does not publish a fabricated support@ address in this documentation. Use official channels on the website and inside your account when they appear.',
          ar: 'Agentication لا تنشر عنوان support@ وهميًا في هذا التوثيق. استخدم القنوات الرسمية على الموقع وداخل حسابك عند ظهورها.',
        },
      },
      {
        type: 'h2',
        id: 'website',
        text: { en: 'Website and footer', ar: 'الموقع والتذييل' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Check the website footer for Documentation, Sign in, Privacy, and Terms links.',
            ar: 'راجع تذييل الموقع لروابط التوثيق والدخول والخصوصية والشروط.',
          },
          {
            en: 'Use /docs for product guidance and /sign-in to access account-specific help when offered.',
            ar: 'استخدم /docs للإرشاد و/sign-in للمساعدة الخاصة بالحساب عند طرحها.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'signed-in',
        text: { en: 'Signed-in support paths', ar: 'مسارات الدعم بعد الدخول' },
      },
      {
        type: 'p',
        text: {
          en: 'After you sign in, look for in-app support, feedback, or team contact entry points as they roll out. ENTERPRISE plan shape includes custom support conversations — initiated through sales or account teams, not via invented addresses in docs.',
          ar: 'بعد الدخول، ابحث عن دعم داخل التطبيق أو ملاحظات أو تواصل مع الفريق عند طرحها. شكل ENTERPRISE يتضمن محادثات دعم مخصصة — عبر فرق المبيعات أو الحساب، لا عناوين مخترعة في التوثيق.',
        },
      },
      {
        type: 'callout',
        variant: 'tip',
        text: {
          en: 'Before contacting support, note your browser, time (UTC), whether the issue involves a PROTOTYPE feature, and any integration you attempted to connect.',
          ar: 'قبل التواصل، اذكر المتصفح والوقت (UTC) وهل المشكلة في ميزة «نموذج» وأي تكامل حاولت ربطه.',
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
          en: 'Search this documentation from the docs home, or read FAQ for common answers.',
          ar: 'ابحث في هذا التوثيق من صفحة التوثيق، أو اقرأ «الأسئلة الشائعة».',
        },
      },
    ],
    related: ['faq', 'troubleshooting-common-problems'],
  },
]
