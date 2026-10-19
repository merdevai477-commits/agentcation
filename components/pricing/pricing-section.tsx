'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Info } from 'lucide-react'
import { useI18n } from '@/components/i18n'
import { formatPrice, pricingConfig, statusLabel } from '@/lib/pricing/config'
import type { Currency, Localized, PlanId, ProductLine } from '@/lib/pricing/types'

function L({ value }: { value: Localized }) {
  const { lang } = useI18n()
  return <>{value[lang]}</>
}

function Tip({ text }: { text?: Localized }) {
  const { lang } = useI18n()
  if (!text) return null
  return (
    <span className="pricing-tip" title={text[lang]} aria-label={text[lang]}>
      <Info size={12} />
    </span>
  )
}

function cellValue(value: Localized | boolean | string, lang: 'en' | 'ar') {
  if (typeof value === 'boolean') return value ? (lang === 'ar' ? 'نعم' : 'Yes') : (lang === 'ar' ? 'لا' : 'No')
  if (typeof value === 'string') return value
  return value[lang]
}

export function PricingSection() {
  const { lang } = useI18n()
  const [product, setProduct] = useState<ProductLine>('business')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [coverageHours, setCoverageHours] = useState<number | 'manual'>(4)

  const catalog = pricingConfig.products[product]
  const planOrder: PlanId[] = ['free', 'pro', 'plus', 'enterprise']

  const coverageRequirement = useMemo((): PlanId | null => {
    if (product !== 'developer') return null
    if (coverageHours === 'manual') return 'free'
    if (coverageHours <= 4) return 'pro'
    if (coverageHours <= 8) return 'plus'
    return 'enterprise'
  }, [product, coverageHours])

  const ui = useMemo(
    () =>
      lang === 'ar'
        ? {
            eyebrow: 'الأسعار',
            title: 'اختر المسار، ثم الخطة.',
            body: 'وكلاء الأعمال وديف دكتور لهما حدود وتكاملات مختلفة. الأرقام أدناه باقات إطلاق مقترحة.',
            compare: 'مقارنة الميزات',
            integrations: 'التكاملات وما تعنيه',
            faq: 'أسئلة شائعة',
            monthly: '/شهر',
            recommended: 'موصى به',
            slot: 'يستهلك خانة اتصال',
            third: 'رسوم طرف ثالث محتملة',
            auth: 'يتطلب تفويضًا',
            access: 'الوصول',
            plansCol: 'الخطة',
            coverage: 'ساعات التغطية المقترحة',
            coverageHint: 'اختر نافذة مراقبة لترى أي خطة تناسبها. ليست اتفاقية توفر.',
            needsPlan: 'يتطلب خطة',
          }
        : {
            eyebrow: 'PRICING',
            title: 'Pick a product path, then a plan.',
            body: 'Business Agents and Dave Doctor have different limits and connectors. Numbers below are proposed launch packaging.',
            compare: 'Feature comparison',
            integrations: 'Integrations & what they mean',
            faq: 'FAQ',
            monthly: '/mo',
            recommended: 'Recommended',
            slot: 'Uses a connection slot',
            third: 'May need vendor fees',
            auth: 'Requires authorization',
            access: 'Access',
            plansCol: 'Plan',
            coverage: 'Proposed coverage hours',
            coverageHint: 'Pick a monitoring window to see which plan fits. Not an uptime SLA.',
            needsPlan: 'Requires',
          },
    [lang],
  )

  return (
    <section id="pricing" className="pricing-section border-y border-white/8 bg-[#0c1018]/80 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">{ui.eyebrow}</p>
          <h2>{ui.title}</h2>
          <p className="mt-4 text-slate-400">{ui.body}</p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="audience-switch" role="tablist" aria-label="Pricing product">
            {(Object.keys(pricingConfig.products) as ProductLine[]).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={product === id}
                className={product === id ? 'is-active' : ''}
                onClick={() => {
                  setProduct(id)
                  setOpenFaq(null)
                  if (id === 'developer') setCoverageHours(4)
                }}
              >
                <L value={pricingConfig.products[id].title} />
              </button>
            ))}
          </div>

          <div className="currency-switch" role="group" aria-label="Currency">
            {(['USD', 'EGP'] as Currency[]).map((code) => (
              <button
                key={code}
                type="button"
                className={currency === code ? 'is-active' : ''}
                onClick={() => setCurrency(code)}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          <L value={catalog.subtitle} />
        </p>
        <p className="mt-2 text-xs text-slate-500">
          <L value={pricingConfig.disclaimer} /> · <L value={pricingConfig.currencyNote} />
        </p>

        {product === 'developer' && (
          <div className="pricing-coverage mt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{ui.coverage}</p>
                <p className="mt-1 text-xs text-slate-500">{ui.coverageHint}</p>
              </div>
              {coverageRequirement && (
                <p className="text-xs text-violet-300">
                  {ui.needsPlan}{' '}
                  <L value={catalog.plans.find((p) => p.id === coverageRequirement)!.name} />
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={ui.coverage}>
              {(
                [
                  { value: 'manual' as const, label: lang === 'ar' ? 'يدوي / أساسي' : 'Manual / basic' },
                  { value: 4 as const, label: lang === 'ar' ? '4 س/يوم' : '4 h/day' },
                  { value: 8 as const, label: lang === 'ar' ? '8 س/يوم' : '8 h/day' },
                  { value: 12 as const, label: lang === 'ar' ? 'حتى 12 س/يوم' : 'Up to 12 h/day' },
                ] as const
              ).map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  className={`pricing-coverage__btn ${coverageHours === opt.value ? 'is-active' : ''}`}
                  onClick={() => setCoverageHours(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {catalog.plans.map((plan) => {
            const recommended = plan.id === catalog.recommendedPlan || plan.recommended
            const coverageMatch = coverageRequirement === plan.id
            return (
              <article
                key={plan.id}
                className={`price-card pricing-card rounded-xl border p-5 ${recommended ? 'is-recommended' : ''} ${coverageMatch ? 'is-coverage-match' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-white">
                    <L value={plan.name} />
                  </h3>
                  {recommended && <span className="pricing-badge">{ui.recommended}</span>}
                </div>
                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
                  <L value={plan.idealFor} />
                </p>
                <div className="my-6 border-y border-white/8 py-5">
                  <p className="text-3xl font-semibold tracking-tight text-white">
                    {formatPrice(plan.price[currency], currency, lang)}
                    {plan.price[currency] !== null && (
                      <span className="ms-1 text-sm font-normal text-slate-500">{ui.monthly}</span>
                    )}
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {plan.highlights.map((item) => (
                    <li key={item.label.en} className="flex gap-2 text-sm text-slate-300">
                      <Check size={14} className="mt-0.5 shrink-0 text-sky-400" />
                      <span>
                        <L value={item.label} />
                        {item.status && item.status !== 'available' && (
                          <span className="pricing-chip">{statusLabel(item.status, lang)}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <a href={plan.cta.href} className="pricing-cta mt-8">
                  <L value={plan.cta.label} />
                  <ArrowRight size={15} />
                </a>
              </article>
            )
          })}
        </div>

        {(catalog.conversationDefinition || catalog.coverageDefinition) && (
          <div className="pricing-note mt-8 grid gap-3 md:grid-cols-2">
            {catalog.conversationDefinition && (
              <p>
                <strong>{lang === 'ar' ? 'تعريف المحادثة' : 'Conversation definition'}:</strong>{' '}
                <L value={catalog.conversationDefinition} />
              </p>
            )}
            {catalog.coverageDefinition && (
              <p>
                <strong>{lang === 'ar' ? 'تعريف التغطية' : 'Coverage definition'}:</strong>{' '}
                <L value={catalog.coverageDefinition} />
              </p>
            )}
          </div>
        )}

        <div className="mt-14">
          <h3 className="text-xl font-semibold text-white">{ui.compare}</h3>
          <div className="pricing-table-wrap mt-5">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th scope="col">{ui.plansCol}</th>
                  {planOrder.map((id) => (
                    <th key={id} scope="col">
                      <L value={catalog.plans.find((p) => p.id === id)!.name} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {catalog.comparison.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">
                      <span className="inline-flex items-center gap-1.5">
                        <L value={row.label} />
                        <Tip text={row.tooltip} />
                        {row.status && row.status !== 'available' && (
                          <span className="pricing-chip">{statusLabel(row.status, lang)}</span>
                        )}
                      </span>
                    </th>
                    {planOrder.map((id) => (
                      <td key={id}>{cellValue(row.values[id], lang)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-14">
          <h3 className="text-xl font-semibold text-white">{ui.integrations}</h3>
          <p className="mt-2 text-sm text-slate-400">
            <L value={catalog.enforcementNote} />
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {catalog.integrations.map((item) => (
              <article key={item.id} className="pricing-integration">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-medium text-white">
                    <L value={item.name} />
                  </h4>
                  <span className="pricing-chip">{statusLabel(item.status, lang)}</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  {ui.plansCol}: {item.plans.map((p) => p.toUpperCase()).join(', ')}
                </p>
                <ul className="mt-3 space-y-1 text-xs text-slate-400">
                  {item.consumesConnectionSlot && <li>· {ui.slot}</li>}
                  {item.requiresThirdPartySubscription && <li>· {ui.third}</li>}
                  {item.requiresUserAuthorization && <li>· {ui.auth}</li>}
                  <li>
                    · {ui.access}: {item.access}
                  </li>
                </ul>
                {item.notes && (
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    <L value={item.notes} />
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <h3 className="text-xl font-semibold text-white">{ui.faq}</h3>
          <div className="mt-5 space-y-2">
            {catalog.faqs.map((item) => {
              const open = openFaq === item.id
              return (
                <div key={item.id} className="pricing-faq">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : item.id)}
                  >
                    <span>
                      <L value={item.question} />
                    </span>
                    <ChevronDown size={16} className={open ? 'rotate-180' : ''} />
                  </button>
                  {open && (
                    <p className="pricing-faq__a">
                      <L value={item.answer} />
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          <L value={pricingConfig.billingNote} />
        </p>
      </div>
    </section>
  )
}
