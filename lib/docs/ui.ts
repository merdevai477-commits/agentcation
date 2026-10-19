import type { L } from './types'

export const docsUi = {
  eyebrow: { en: 'Documentation', ar: 'التوثيق' } satisfies L,
  searchPlaceholder: { en: 'What would you like to learn about?', ar: 'ماذا تريد أن تتعلم؟' } satisfies L,
  searchEmpty: { en: 'No articles match your search.', ar: 'لا توجد مقالات تطابق بحثك.' } satisfies L,
  searchHint: { en: 'Try “Dave Doctor”, “pricing”, or “integrations”.', ar: 'جرّب «ديف دكتور» أو «الأسعار» أو «الربط».' } satisfies L,
  results: { en: 'Search results', ar: 'نتائج البحث' } satisfies L,
  onThisPage: { en: 'On this page', ar: 'في هذه الصفحة' } satisfies L,
  related: { en: 'Related articles', ar: 'مقالات ذات صلة' } satisfies L,
  previous: { en: 'Previous', ar: 'السابق' } satisfies L,
  next: { en: 'Next', ar: 'التالي' } satisfies L,
  menu: { en: 'Docs menu', ar: 'قائمة التوثيق' } satisfies L,
  closeMenu: { en: 'Close menu', ar: 'إغلاق القائمة' } satisfies L,
  home: { en: 'Docs home', ar: 'الرئيسية' } satisfies L,
  backToSite: { en: 'Back to site', ar: 'العودة للموقع' } satisfies L,
  getStarted: { en: 'Get started', ar: 'ابدأ الآن' } satisfies L,
  breadcrumbDocs: { en: 'Docs', ar: 'التوثيق' } satisfies L,
  status: {
    available: { en: 'Available', ar: 'متاح' },
    prototype: { en: 'Prototype', ar: 'نموذج' },
    planned: { en: 'Planned', ar: 'مخطط' },
  } satisfies Record<'available' | 'prototype' | 'planned', L>,
  callout: {
    info: { en: 'Note', ar: 'ملاحظة' },
    warning: { en: 'Important', ar: 'مهم' },
    planned: { en: 'Planned', ar: 'مخطط' },
    tip: { en: 'Tip', ar: 'نصيحة' },
  } satisfies Record<'info' | 'warning' | 'planned' | 'tip', L>,
  exploreProduct: { en: 'Explore the product', ar: 'استكشف المنتج' } satisfies L,
  tagline: { en: 'Get. Integrate. Grow.', ar: 'جهّز. اربط. انمُ.' } satisfies L,
}
