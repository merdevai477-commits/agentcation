import type { DocArticle } from '../types'

export const developerArticles: DocArticle[] = [
  {
    slug: 'meet-dave-doctor',
    category: 'developers',
    title: { en: 'Meet Dave Doctor', ar: 'تعرّف على ديف دكتور' },
    description: {
      en: 'Your AI engineering partner for incidents, code, and deploy context.',
      ar: 'شريكك الهندسي للحوادث والكود وسياق النشر.',
    },
    status: 'prototype',
    related: ['what-dave-doctor-can-do', 'monitoring-and-incident-analysis'],
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Dave Doctor is Agentication’s AI engineering agent — built for systems that need thoughtful investigation, not just alerts. On the marketing site it is labeled PROTOTYPE.',
          ar: 'ديف دكتور هو الوكيل الهندسي في Agentication — للأنظمة التي تحتاج تحقيقًا هادئًا لا تنبيهات فقط. على الموقع مُعلَّم كنموذج.',
        },
      },
      {
        type: 'callout',
        variant: 'warning',
        text: {
          en: 'The homepage demo is a live demo with simulated replies only. Dave Doctor does not change production unless a person approves it.',
          ar: 'ديمو الصفحة الرئيسية مباشر بردود محاكاة فقط. ديف دكتور لا يغيّر الإنتاج إلا بعد موافقة شخص.',
        },
      },
      {
        type: 'h2',
        id: 'what-it-covers',
        text: { en: 'What Dave Doctor is for', ar: 'لماذا ديف دكتور' },
      },
      {
        type: 'ul',
        items: [
          { en: 'Codebase analysis', ar: 'تحليل الكود' },
          { en: 'Logs and metrics', ar: 'السجلات والمقاييس' },
          { en: 'Incident investigation', ar: 'تحقيق الحوادث' },
          { en: 'Pull request workflows', ar: 'مسارات طلبات السحب' },
          { en: 'Deployment monitoring', ar: 'مراقبة النشر' },
          { en: 'Post-deploy verification', ar: 'التحقق بعد النشر' },
        ],
      },
      {
        type: 'h2',
        id: 'incident-workflow',
        text: { en: 'Incident workflow (prototype flow)', ar: 'مسار الحادث (تدفق نموذجي)' },
      },
      {
        type: 'p',
        text: {
          en: 'The site shows a sample flow with sample data: detect → investigate → root cause → propose fix → pull request → tests and deploy → verify. Treat this as a prototype narrative until connected to your real tools.',
          ar: 'يعرض الموقع تدفقًا نموذجيًا ببيانات نموذجية: رصد → تحقيق → سبب جذري → إصلاح مقترح → طلب سحب → اختبار ونشر → تحقق. اعتبره سردًا نموذجيًا حتى يرتبط بأدواتك الحقيقية.',
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
          en: 'Read What Dave Doctor can do, then Monitoring and incident analysis and Monitoring coverage and operating hours.',
          ar: 'اقرأ «ما يستطيع ديف دكتور»، ثم «المراقبة وتحليل الحوادث» و«ساعات التغطية وساعات التشغيل».',
        },
      },
    ],
  },
  {
    slug: 'what-dave-doctor-can-do',
    category: 'developers',
    title: { en: 'What Dave Doctor can do', ar: 'ما يستطيع ديف دكتور' },
    description: {
      en: 'Capabilities, operating modes, and approval-aware execution.',
      ar: 'القدرات، أنماط التشغيل، والتنفيذ بموافقة.',
    },
    status: 'prototype',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Dave Doctor correlates signals, explains what it checked, and proposes scoped next actions. Capabilities below reflect the product direction shown on the site; availability in your workspace depends on integrations and plan packaging.',
          ar: 'ديف دكتور يربط الإشارات، يوضح ما فحصه، ويقترح خطوات تالية محددة. القدرات أدناه تعكس اتجاه المنتج على الموقع؛ التوفر في مساحة عملك يعتمد على الربط والباقة.',
        },
      },
      {
        type: 'h2',
        id: 'core-capabilities',
        text: { en: 'Core capabilities', ar: 'قدرات أساسية' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Review traces, logs, and recent deploys during incident investigation.',
            ar: 'مراجعة التتبع والسجلات وآخر عمليات النشر أثناء تحقيق الحادث.',
          },
          {
            en: 'Isolate likely root causes and document reasoning in a visible trace.',
            ar: 'عزل أسباب محتملة وتوثيق التفكير في أثر ظاهر.',
          },
          {
            en: 'Prepare patch proposals and scoped test plans for engineer review.',
            ar: 'تجهيز مقترحات رقعة وخطط اختبار محددة لمراجعة المهندس.',
          },
          {
            en: 'Open or describe pull requests for review rather than silent production edits.',
            ar: 'فتح أو وصف طلبات سحب للمراجعة بدل تعديلات إنتاج صامتة.',
          },
          {
            en: 'Support post-deploy health checks when monitoring is connected.',
            ar: 'دعم فحوصات الصحة بعد النشر عند ربط المراقبة.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'modes',
        text: { en: 'OBSERVE, ASSIST, AUTONOMOUS', ar: 'مراقبة، مساعدة، ذاتي' },
      },
      {
        type: 'p',
        text: {
          en: 'These operating modes describe how monitoring, investigation, and execution intensity are configured. They are a prototype/planned product concept — not a claim that every mode is fully operational in production for all customers today.',
          ar: 'هذه الأنماط تصف شدة المراقبة والتحقيق والتنفيذ. هي مفهوم نموذج/مخطط — وليست ادعاءً بأن كل نمط يعمل إنتاجيًا بالكامل لكل العملاء اليوم.',
        },
      },
      {
        type: 'callout',
        variant: 'tip',
        title: { en: 'Approval-aware', ar: 'بموافقة' },
        text: {
          en: 'Even in AUTONOMOUS mode, actions are described as explicitly authorized under policies and safeguards — and the public demo states Dave Doctor does not deploy without human approval.',
          ar: 'حتى في النمط الذاتي، الأفعال مصرّح بها صراحة تحت سياسات وضوابط — والديمو العام يؤكد أن ديف دكتور لا ينشر دون موافقة بشرية.',
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
          en: 'Plan your Connect development environment and GitHub integration articles before relying on live repo access.',
          ar: 'خطّط لقراءة «ربط بيئة التطوير» و«تكامل GitHub» قبل الاعتماد على وصول حي للمستودع.',
        },
      },
    ],
    related: ['connect-development-environment', 'code-fixes-and-pull-requests'],
  },
  {
    slug: 'connect-development-environment',
    category: 'developers',
    title: { en: 'Connect your development environment', ar: 'اربط بيئة التطوير' },
    description: {
      en: 'Prepare repositories, credentials, and scopes for engineering agents.',
      ar: 'جهّز المستودعات والاعتمادات والنطاقات لوكلاء الهندسة.',
    },
    status: 'planned',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Dave Doctor is designed to work with your codebase, CI context, and observability stack. Connecting a real development environment is planned guidance until in-product connection flows are marked available.',
          ar: 'ديف دكتور مصمم للعمل مع الكود وسياق CI وطبقة المراقبة. ربط بيئة تطوير حقيقية إرشاد مخطط حتى تُعلَم مسارات الربط داخل المنتج متاحة.',
        },
      },
      {
        type: 'callout',
        variant: 'planned',
        text: {
          en: 'GitHub and real monitoring tool connections are not claimed as universally live today. Use this article to prepare — not as confirmation that your workspace already has connectors enabled.',
          ar: 'GitHub وربط أدوات المراقبة الحقيقية غير مُعلَنين كمتاحين للجميع اليوم. استخدم هذا المقال للتحضير — لا كتأكيد أن موصلات مساحة عملك مفعّلة.',
        },
      },
      {
        type: 'h2',
        id: 'prepare',
        text: { en: 'What to prepare', ar: 'ما الذي تجهّزه' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'List services and repositories Dave Doctor should read (and which are out of scope).',
            ar: 'اذكر الخدمات والمستودعات التي يقرأها ديف دكتور (وما خارج النطاق).',
          },
          {
            en: 'Define who approves PRs, deploys, and rollbacks.',
            ar: 'حدّد من يوافق على طلبات السحب والنشر والتراجع.',
          },
          {
            en: 'Document runbooks and escalation paths the agent should follow.',
            ar: 'وثّق كتيبات التشغيل ومسارات التصعيد التي يتبعها الوكيل.',
          },
        ],
      },
      {
        type: 'h2',
        id: 'permissions',
        text: { en: 'Permissions mindset', ar: 'عقلية الصلاحيات' },
      },
      {
        type: 'p',
        text: {
          en: 'Start with read-only access where possible, then expand to write actions (PRs, deploy hooks) only under approval policies. See Security and permissions.',
          ar: 'ابدأ بوصول للقراءة حيث أمكن، ثم وسّع أفعال الكتابة (طلبات سحب، خطافات نشر) فقط تحت سياسات موافقة. راجع «الأمان والصلاحيات».',
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
          en: 'Continue with GitHub integration and Monitoring and incident analysis.',
          ar: 'تابع إلى «تكامل GitHub» و«المراقبة وتحليل الحوادث».',
        },
      },
    ],
    related: ['github-integration', 'permissions-and-access'],
  },
  {
    slug: 'github-integration',
    category: 'developers',
    title: { en: 'GitHub integration', ar: 'تكامل GitHub' },
    description: {
      en: 'How Dave Doctor is intended to use repositories and pull requests.',
      ar: 'كيف يُفترض أن يستخدم ديف دكتور المستودعات وطلبات السحب.',
    },
    status: 'planned',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'GitHub is a primary integration for engineering agents: read code, correlate changes with incidents, and open pull requests for human review. On the marketing site, PR steps appear in a prototype incident flow with sample data.',
          ar: 'GitHub تكامل أساسي لوكلاء الهندسة: قراءة الكود، ربط التغييرات بالحوادث، وفتح طلبات سحب للمراجعة. على الموقع، خطوات PR تظهر في مسار حادث نموذجي ببيانات نموذجية.',
        },
      },
      {
        type: 'callout',
        variant: 'planned',
        title: { en: 'Planned integration', ar: 'تكامل مخطط' },
        text: {
          en: 'Treat GitHub connection as planned until Agentication marks it available in your account. Do not assume the simulated demo has accessed your org.',
          ar: 'اعتبر ربط GitHub مخططًا حتى تعلّم Agentication توفره في حسابك. لا تفترض أن الديمو المحاكى دخل مؤسستك.',
        },
      },
      {
        type: 'h2',
        id: 'intended-use',
        text: { en: 'Intended use', ar: 'الاستخدام المقصود' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Map deploys and commits to incident timelines.',
            ar: 'ربط النشر والتزامات الكود بخط زمني للحادث.',
          },
          {
            en: 'Propose fixes as branches and PRs — not direct production pushes without approval.',
            ar: 'اقتراح إصلاحات كفروع وPR — لا دفعًا مباشرًا للإنتاج دون موافقة.',
          },
          {
            en: 'Reference CI check status before recommending rollout or rollback.',
            ar: 'الاستئناس بحالة فحوص CI قبل التوصية بالنشر أو التراجع.',
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
          en: 'Read Code fixes and pull requests and Permissions and access before granting write scopes.',
          ar: 'اقرأ «إصلاحات الكود وطلبات السحب» و«الصلاحيات والوصول» قبل منح نطاقات كتابة.',
        },
      },
    ],
    related: ['code-fixes-and-pull-requests', 'permissions-and-access'],
  },
  {
    slug: 'monitoring-and-incident-analysis',
    category: 'developers',
    title: { en: 'Monitoring and incident analysis', ar: 'المراقبة وتحليل الحوادث' },
    description: {
      en: 'Detect, investigate, and explain incidents with visible traces.',
      ar: 'رصد الحوادث والتحقيق فيها وشرحها بآثار ظاهرة.',
    },
    status: 'prototype',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Dave Doctor’s value is correlating alerts with logs, traces, metrics, and recent deploys — then narrating the investigation in a trace your team can audit.',
          ar: 'قيمة ديف دكتور في ربط التنبيهات بالسجلات والتتبع والمقاييس وآخر النشر — ثم سرد التحقيق في أثر يمكن للفريق مراجعته.',
        },
      },
      {
        type: 'h2',
        id: 'prototype-flow',
        text: { en: 'Prototype incident flow', ar: 'مسار حادث نموذجي' },
      },
      {
        type: 'ol',
        items: [
          { en: 'Detect — alert correlated with elevated errors.', ar: 'رصد — تنبيه مرتبط بارتفاع الأخطاء.' },
          { en: 'Investigate — logs, traces, and deploys reviewed.', ar: 'تحقيق — مراجعة السجلات والتتبع والنشر.' },
          { en: 'Root cause — regression isolated in a service.', ar: 'سبب جذري — عزل انحدار في خدمة.' },
          { en: 'Propose fix — patch with scoped test plan.', ar: 'إصلاح مقترح — رقعة مع خطة اختبار.' },
          { en: 'Pull request — opened for engineer review.', ar: 'طلب سحب — للمراجعة الهندسية.' },
          { en: 'Tests and deploy — checks and staged rollout.', ar: 'اختبار ونشر — فحوص ونشر مرحلي.' },
          { en: 'Verify — post-deploy health confirms recovery.', ar: 'تحقق — صحة ما بعد النشر تؤكد التعافي.' },
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: {
          en: 'Sample data on the site is illustrative. Real monitoring integrations are planned until marked available.',
          ar: 'البيانات النموذجية على الموقع توضيحية. تكاملات المراقبة الحقيقية مخططة حتى تُعلَم متاحة.',
        },
      },
      {
        type: 'h2',
        id: 'outside-coverage',
        text: { en: 'When monitoring is not active', ar: 'عندما لا تكون المراقبة فعّالة' },
      },
      {
        type: 'p',
        text: {
          en: 'Outside a configured coverage window, the agent is not continuously monitoring. Do not assume 24/7 observation unless coverage is configured and active when that feature is available.',
          ar: 'خارج نافذة التغطية المضبوطة، الوكيل لا يراقب باستمرار. لا تفترض مراقبة 24/7 إلا إذا ضُبطت التغطية وكانت فعّالة عند توفر الميزة.',
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
          en: 'Read Monitoring coverage and operating hours and Deployment verification.',
          ar: 'اقرأ «ساعات التغطية والتشغيل» و«التحقق من النشر».',
        },
      },
    ],
    related: ['monitoring-coverage-and-operating-hours', 'deployment-verification'],
  },
  {
    slug: 'code-fixes-and-pull-requests',
    category: 'developers',
    title: { en: 'Code fixes and pull requests', ar: 'إصلاحات الكود وطلبات السحب' },
    description: {
      en: 'Scoped remediation, review, and human approval before merge or deploy.',
      ar: 'إصلاح محدد، مراجعة، وموافقة بشرية قبل الدمج أو النشر.',
    },
    status: 'prototype',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Dave Doctor prepares proposed fixes — patches, rollback plans, and PRs — for engineers to review. The product stance is approval-aware: production change requires human decision.',
          ar: 'ديف دكتور يجهّز إصلاحات مقترحة — رقعًا وخطط تراجع وPR — للمهندسين. الموقف: التغيير في الإنتاج يحتاج قرارًا بشريًا.',
        },
      },
      {
        type: 'h2',
        id: 'pr-workflow',
        text: { en: 'Pull request workflow', ar: 'مسار طلب السحب' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Describe the change scope and test plan in the PR body.',
            ar: 'وصف نطاق التغيير وخطة الاختبار في نص PR.',
          },
          {
            en: 'Link the PR to the incident trace and deploy correlation.',
            ar: 'ربط PR بأثر الحادث وارتباط النشر.',
          },
          {
            en: 'Wait for review and CI before recommending rollout.',
            ar: 'انتظار المراجعة وCI قبل التوصية بالنشر.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: {
          en: 'The demo narrative includes preparing a review PR after a rollback plan — still subject to engineer approval.',
          ar: 'سرد الديمو يتضمن تجهيز PR للمراجعة بعد خطة تراجع — ما زال يخضع لموافقة المهندس.',
        },
      },
      {
        type: 'h2',
        id: 'no-silent-deploy',
        text: { en: 'No silent deploys', ar: 'لا نشر صامت' },
      },
      {
        type: 'p',
        text: {
          en: 'Dave Doctor does not deploy without human approval. Autonomous deploy concepts on the site are policy-bound and planned — not an override of this rule in the public demo.',
          ar: 'ديف دكتور لا ينشر دون موافقة بشرية. مفاهيم النشر الذاتي على الموقع مقيدة بالسياسة ومخططة — وليست تجاوزًا لهذه القاعدة في الديمو العام.',
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
          en: 'Read Deployment verification and Security and permissions.',
          ar: 'اقرأ «التحقق من النشر» و«الأمان والصلاحيات».',
        },
      },
    ],
    related: ['deployment-verification', 'security-and-permissions'],
  },
  {
    slug: 'deployment-verification',
    category: 'developers',
    title: { en: 'Deployment verification', ar: 'التحقق من النشر' },
    description: {
      en: 'Post-deploy checks and confirming recovery after rollout.',
      ar: 'فحوص ما بعد النشر وتأكيد التعافي بعد النشر.',
    },
    status: 'prototype',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'The incident workflow ends with verify — confirming that error rates, latency, and dependency health return to expected bounds after a deploy or rollback.',
          ar: 'مسار الحادث ينتهي بالتحقق — تأكيد أن معدلات الخطأ والزمن وصحة التبعيات عادت للحدود المتوقعة بعد النشر أو التراجع.',
        },
      },
      {
        type: 'h2',
        id: 'what-verify-means',
        text: { en: 'What verification includes', ar: 'ماذا يشمل التحقق' },
      },
      {
        type: 'ul',
        items: [
          {
            en: 'Compare pre- and post-deploy metrics for the affected service.',
            ar: 'مقارنة مقاييس قبل وبعد النشر للخدمة المتأثرة.',
          },
          {
            en: 'Confirm canary or staged rollout gates before full promotion.',
            ar: 'تأكيد بوابات الكناري أو النشر المرحلي قبل الترويج الكامل.',
          },
          {
            en: 'Document residual risk if metrics are still degraded.',
            ar: 'توثيق المخاطر المتبقية إذا بقيت المقاييس متدهورة.',
          },
        ],
      },
      {
        type: 'callout',
        variant: 'planned',
        text: {
          en: 'Live verification requires connected monitoring and deploy telemetry. Until integrations are available, use the prototype flow as a planning reference.',
          ar: 'التحقق الحي يحتاج مراقبة ونشرًا متصلين. حتى يتوفر الربط، استخدم المسار النموذجي كمرجع تخطيط.',
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
          en: 'Configure coverage expectations in Monitoring coverage and operating hours.',
          ar: 'اضبط توقعات التغطية في «ساعات التغطية والتشغيل».',
        },
      },
    ],
    related: ['monitoring-coverage-and-operating-hours'],
  },
  {
    slug: 'monitoring-coverage-and-operating-hours',
    category: 'developers',
    title: { en: 'Monitoring coverage and operating hours', ar: 'ساعات التغطية والتشغيل' },
    description: {
      en: 'Scheduled coverage, proposed limits, and when the agent is not on watch.',
      ar: 'تغطية مجدولة، حدود مقترحة، ومتى لا يراقب الوكيل.',
    },
    status: 'planned',
    blocks: [
      {
        type: 'p',
        text: {
          en: 'Agentication describes scheduled coverage hours (up to 12 hours per day as a proposed model) for engineering monitoring. Packaging may restrict advanced monitoring to higher tiers when the feature is available.',
          ar: 'Agentication تصف ساعات تغطية مجدولة (حتى 12 ساعة يوميًا كنموذج مقترح) لمراقبة الهندسة. الباقات قد تقيّد المراقبة المتقدمة للطبقات الأعلى عند توفر الميزة.',
        },
      },
      {
        type: 'h2',
        id: 'coverage-window',
        text: { en: 'Inside the coverage window', ar: 'داخل نافذة التغطية' },
      },
      {
        type: 'p',
        text: {
          en: 'When coverage is configured and active, Dave Doctor can observe and assist according to your mode settings — subject to connected monitoring tools.',
          ar: 'عند ضبط التغطية وتفعيلها، يمكن لديف دكتور المراقبة والمساعدة حسب أنماطك — بحسب أدوات المراقبة المتصلة.',
        },
      },
      {
        type: 'h2',
        id: 'outside-window',
        text: { en: 'Outside the coverage window', ar: 'خارج نافذة التغطية' },
      },
      {
        type: 'callout',
        variant: 'warning',
        title: { en: 'Not continuous 24/7', ar: 'ليس 24/7 مستمرًا' },
        text: {
          en: 'When coverage is not configured or not active, the agent is not continuously monitoring. Do not rely on always-on incident detection unless your plan and configuration explicitly provide it when available.',
          ar: 'عندما لا تُضبط التغطية أو لا تكون فعّالة، الوكيل لا يراقب باستمرار. لا تعتمد على رصد حوادث دائم إلا إذا وفرت خطتك وإعدادك ذلك صراحة عند التوفر.',
        },
      },
      {
        type: 'h2',
        id: 'plans',
        text: { en: 'Plans and usage', ar: 'الخطط والاستخدام' },
      },
      {
        type: 'p',
        text: {
          en: 'See Coverage hours and usage limits and Developer agent plans for how plan shapes may map to monitoring features — without invented numeric caps in this documentation.',
          ar: 'راجع «ساعات التغطية وحدود الاستخدام» و«خطط الوكيل الهندسي» لكيفية ربط أشكال الخطط بميزات المراقبة — دون حدود رقمية مخترعة في هذا التوثيق.',
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
          en: 'Compare plan shapes on /pricing and read Choosing the right plan.',
          ar: 'قارن أشكال الخطط على /pricing واقرأ «اختيار الخطة المناسبة».',
        },
      },
    ],
    related: ['coverage-hours-and-usage-limits', 'developer-agent-plans'],
  },
]
