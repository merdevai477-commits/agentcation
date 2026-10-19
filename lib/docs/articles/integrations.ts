import type { DocArticle } from '../types'

export const integrationArticles: DocArticle[] = [
  {
    slug: 'available-integrations',
    category: 'integrations',
    title: { en: 'Available integrations', ar: 'التكاملات المتاحة' },
    description: {
      en: 'What connects today vs. planned GitHub, monitoring, messaging, and web.',
      ar: 'ما يتصل اليوم مقابل GitHub والمراقبة والمراسلة والويب المخططة.',
    },
    related: ['connecting-an-integration', 'github-integration'],
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Agentication is built to connect agents to the tools teams already use. On the marketing site, many connectors appear as product direction — not all are marked live for every account.',
          ar: 'Agentication مبنية لربط الوكلاء بأدوات الفرق. على الموقع، كثير من الموصلات اتجاه منتج — ليست كلها حية لكل حساب.',
        },
      },
      {
        type: 'h2',
        id: 'available-today',
        text: { en: 'Available today', ar: 'متاح اليوم' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Website marketing experience, documentation, and account sign-up/sign-in (Clerk).',
            ar: 'تجربة الموقع التسويقية والتوثيق والتسجيل/الدخول (Clerk).',
          },
          {
            en: 'Simulated Dave Doctor demo on the homepage (simulated replies only).',
            ar: 'ديمو ديف دكتور محاكى على الصفحة الرئيسية (ردود محاكاة فقط).',
          },
        ],
      },
      {
        type: 'h2',
        id: 'planned',
        text: { en: 'Planned or guidance (not claimed live)', ar: 'مخطط أو إرشاد (غير مُعلَن حيًا)' },
      },
      {
        type: 'ul',
        items: [
          { en: 'GitHub — repositories and pull requests for Dave Doctor.', ar: 'GitHub — مستودعات وطلبات سحب لديف دكتور.' },
          {
            en: 'Real monitoring tools — logs, metrics, traces for incident analysis.',
            ar: 'أدوات مراقبة حقيقية — سجلات ومقاييس وتتبع لتحليل الحوادث.',
          },
          {
            en: 'Messaging platforms — channels for Business Agents.',
            ar: 'منصات مراسلة — قنوات لوكلاء الأعمال.',
          },
          {
            en: 'Website widgets — on-site chat for Business Agents.',
            ar: 'عناصر موقع — دردشة على الموقع لوكلاء الأعمال.',
          },
          {
            en: 'Autonomous deploy hooks — policy-bound, approval-aware when offered.',
            ar: 'خطافات نشر ذاتية — مقيدة بالسياسة وبموافقة عند طرحها.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'planned',
        text: {
          en: 'Check in-product integration settings when signed in to see what your workspace can connect — this list may change as packaging finalizes.',
          ar: 'راجع إعدادات الربط داخل المنتج بعد الدخول لمعرفة ما يمكن لمساحة عملك ربطه — قد تتغير القائمة مع تثبيت الباقات.',
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
          en: 'Read Connecting an integration and Permissions and access.',
          ar: 'اقرأ «ربط تكامل» و«الصلاحيات والوصول».',
        },
      },
    ],
  },
  {
    slug: 'connecting-an-integration',
    category: 'integrations',
    title: { en: 'Connecting an integration', ar: 'ربط تكامل' },
    description: {
      en: 'Prepare, authorize, and validate connections safely.',
      ar: 'جهّز الربط وفوّض الوصول وتحقق من الاتصالات بأمان.',
    },
    status: 'planned',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'When integration flows are available in your account, connecting follows the same pattern: choose the tool, grant scoped permissions, validate with a test action, then enable for specific agents.',
          ar: 'عند توفر مسارات الربط في حسابك، يتبع الربط نفس النمط: اختر الأداة، امنح صلاحيات محددة، تحقق بفعل اختبار، ثم فعّل لوكلاء محددين.',
        },
      },
      {
        type: 'h2',
        id: 'steps',
        text: { en: 'Recommended steps', ar: 'خطوات موصى بها' },
      },
      {
        type: 'steps',
        items: [
          {
            title: { en: 'Inventory scope', ar: 'حصر النطاق' },
            body: {
              en: 'List repos, channels, or datasets this agent needs — and what is explicitly forbidden.',
              ar: 'اذكر المستودعات أو القنوات أو البيانات التي يحتاجها الوكيل — وما هو ممنوع صراحة.',
            },
          },
          {
            title: { en: 'Connect with least privilege', ar: 'اربط بأقل صلاحية' },
            body: {
              en: 'Start read-only; add write scopes only when workflows require them.',
              ar: 'ابدأ للقراءة؛ أضف نطاقات كتابة فقط عند الحاجة.',
            },
          },
          {
            title: { en: 'Validate', ar: 'تحقق' },
            body: {
              en: 'Run a test query or dry-run action and confirm audit logs show the attempt.',
              ar: 'نفّذ استعلامًا اختباريًا أو dry-run وتأكد أن السجلات تظهر المحاولة.',
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
          en: 'If a connector fails, read Troubleshooting integrations.',
          ar: 'إذا فشل موصل، اقرأ «استكشاف أخطاء التكاملات».',
        },
      },
    ],
    related: ['permissions-and-access', 'troubleshooting-integrations'],
  },
  {
    slug: 'permissions-and-access',
    category: 'integrations',
    title: { en: 'Permissions and access', ar: 'الصلاحيات والوصول' },
    description: {
      en: 'Scopes, approvals, and who can connect tools on behalf of the team.',
      ar: 'النطاقات والموافقات ومن يربط الأدوات نيابة عن الفريق.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Integrations inherit the permission model of the underlying tool plus Agentication agent rules. Engineering agents should stay approval-aware for writes; business agents should respect customer data policies.',
          ar: 'التكاملات ترث نموذج صلاحيات الأداة الأساسية مع قواعد وكيل Agentication. وكلاء الهندسة يبقون بموافقة للكتابة؛ وكلاء الأعمال يحترمون سياسات بيانات العملاء.',
        },
      },
      {
        type: 'h2',
        id: 'engineering',
        text: { en: 'Engineering integrations', ar: 'تكاملات الهندسة' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Prefer read scopes for investigation; separate scopes for opening PRs or triggering deploys.',
            ar: 'فضّل نطاقات القراءة للتحقيق؛ نطاقات منفصلة لفتح PR أو تشغيل نشر.',
          },
          {
            en: 'Dave Doctor does not deploy without human approval in the public product narrative.',
            ar: 'ديف دكتور لا ينشر دون موافقة بشرية في سرد المنتج العام.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'business',
        text: { en: 'Business integrations', ar: 'تكاملات الأعمال' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Limit which roles can connect messaging or CRM systems.',
            ar: 'قيّد الأدوار التي تربط المراسلة أو CRM.',
          },
          {
            en: 'Do not expose internal-only knowledge to public website widgets without review.',
            ar: 'لا تعرض معرفة داخلية فقط على عناصر الموقع العامة دون مراجعة.',
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
          en: 'Read Security and permissions in the Trust section.',
          ar: 'اقرأ «الأمان والصلاحيات» في قسم الثقة.',
        },
      },
    ],
    related: ['security-and-permissions', 'data-privacy'],
  },
  {
    slug: 'troubleshooting-integrations',
    category: 'integrations',
    title: { en: 'Troubleshooting integrations', ar: 'استكشاف أخطاء التكاملات' },
    description: {
      en: 'Common connection issues and safe retries.',
      ar: 'مشاكل الربط الشائعة وإعادة المحاولة بأمان.',
    },
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Integration problems usually come from expired authorization, insufficient scopes, or tools that are still planned rather than enabled for your workspace.',
          ar: 'مشاكل الربط غالبًا من انتهاء التفويض أو نطاقات ناقصة أو أدوات ما زالت مخططة ولم تُفعَّل لمساحة عملك.',
        },
      },
      {
        type: 'h2',
        id: 'checklist',
        text: { en: 'Checklist', ar: 'قائمة تحقق' },
      },
      {
        type: 'ol',
        items: [
          {
            en: 'Confirm the integration is marked available — not only shown on the marketing site.',
            ar: 'تأكد أن التكامل مُعلَم متاحًا — لا يظهر على الموقع فقط.',
          },
          {
            en: 'Re-authenticate the connector and verify scopes match your workflow.',
            ar: 'أعد المصادقة على الموصل وتحقق أن النطاقات تطابق مسار العمل.',
          },
          {
            en: 'Test with read-only actions before enabling writes or automations.',
            ar: 'اختبر بأفعال قراءة قبل تفعيل الكتابة أو الأتمتة.',
          },
          {
            en: 'Review agent rules — a denied action can look like a broken integration.',
            ar: 'راجع قواعد الوكيل — فعل مرفوض قد يبدو كموصل معطل.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: {
          en: 'For account-specific errors, use signed-in support paths described in Contact and support.',
          ar: 'لأخطاء خاصة بالحساب، استخدم مسارات الدعم بعد الدخول في «التواصل والدعم».',
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
          en: 'See Troubleshooting common problems for broader platform issues.',
          ar: 'راجع «استكشاف المشاكل الشائعة» لمشاكل أوسع في المنصة.',
        },
      },
    ],
    related: ['troubleshooting-common-problems', 'contact-and-support'],
  },
]
