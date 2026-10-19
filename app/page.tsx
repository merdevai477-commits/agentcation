'use client'

import { useState } from 'react'
import {
  Activity,
  ArrowRight,
  BookOpen,
  Bot,
  Boxes,
  Brain,
  Check,
  Code2,
  Command,
  Database,
  Eye,
  FileCode2,
  GitPullRequest,
  Globe2,
  Layers,
  MessageSquare,
  Network,
  Play,
  Rocket,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Terminal,
  Users,
  Wrench,
  Zap,
} from 'lucide-react'
import { AgentDemo } from '@/components/agent-demo'
import { BrandLogo } from '@/components/brand-logo'
import { HeroMascot } from '@/components/hero-mascot'
import { SiteNav } from '@/components/site-nav'
import { Starfield } from '@/components/fx/starfield'
import { MotionDirector } from '@/components/fx/motion-director'
import { I18nProvider, useI18n } from '@/components/i18n'
import { PricingSection } from '@/components/pricing/pricing-section'

const stepIcons = [Terminal, Globe2, ShieldCheck, Zap]
const nodeIcons = [Wrench, BookOpen, Brain, ShieldCheck, Rocket]
const archIcons = [Settings2, Brain, Network, Database, Layers, Zap]
const flowIcons = [Activity, Search, FileCode2, Wrench, GitPullRequest, Rocket, Check]
const devItemIcons = [FileCode2, Activity, Search, GitPullRequest, Rocket, ShieldCheck]
const bizItemIcons = [MessageSquare, BookOpen, Brain, Boxes, Users, ShieldCheck]

function Button({ children, href = '/sign-up', variant = 'primary' }: { children: React.ReactNode; href?: string; variant?: 'primary' | 'secondary' }) {
  const classes = variant === 'primary' ? 'fx-btn fx-btn--primary' : 'fx-btn fx-btn--ghost'
  return (
    <a href={href} className={classes}>
      <span className="inline-flex items-center gap-2">{children}</span>
      <ArrowRight size={16} />
    </a>
  )
}

function ProductPreview({ business = false }: { business?: boolean }) {
  const { t } = useI18n()
  const items = business ? t.previewBiz : t.previewEng
  const itemIcons = business
    ? [MessageSquare, BookOpen, Brain, Sparkles]
    : [Activity, Database, Rocket, ShieldCheck]
  return (
    <div className="preview-grid relative overflow-hidden rounded-xl border border-white/10 bg-black/60 p-4 shadow-2xl shadow-black/40">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="size-2 shrink-0 rounded-full bg-sky-400" />
          {business ? 'business-agent / journey' : 'dave-doctor / incident-042'}
        </div>
        <span className="rounded-full border border-sky-500/30 px-2 py-1 text-[10px] text-sky-300">{t.sample}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/8 bg-white/[.025] p-3">
          <div className="mb-3 flex items-center justify-between text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              {business ? <MessageSquare size={12} /> : <Activity size={12} />}
              {business ? t.journey : t.signal}
            </span>
            <span>{t.illustrative}</span>
          </div>
          {items.map((item, i) => {
            const Icon = itemIcons[i] ?? Sparkles
            return (
              <div key={item} className="mb-2 flex items-center gap-2 rounded-md border border-white/6 bg-black/30 px-3 py-2 text-xs text-slate-300">
                <Icon size={13} className={`shrink-0 ${i === 0 ? 'text-sky-300' : 'text-slate-400'}`} />
                {item}
              </div>
            )
          })}
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-white/10 bg-white/[.03] p-3">
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-200">
              <Sparkles size={14} className="text-sky-300" />
              {t.activity}
            </div>
            <p className="text-xs leading-5 text-slate-300">{business ? t.activityBiz : t.activityEng}</p>
          </div>
          <div className="rounded-lg border border-white/8 bg-black/30 p-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Rocket size={12} />
              {t.next}
            </span>
            <p className="mt-2 text-slate-200">{business ? t.nextBiz : t.nextEng}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const bizItemsEn = [
  'Website & messaging channels',
  'Company knowledge & FAQs',
  'Customer context memory',
  'Lead qualification',
  'Team collaboration',
  'Human handoff (planned)',
]

function Home() {
  const { t, lang } = useI18n()
  const [mode, setMode] = useState<'OBSERVE' | 'ASSIST' | 'AUTONOMOUS'>('OBSERVE')
  const [audience, setAudience] = useState<'dev' | 'biz'>('biz')
  const bizItems = lang === 'ar'
    ? ['قنوات الموقع والمراسلة', 'معرفة الشركة والأسئلة الشائعة', 'ذاكرة سياق العميل', 'تأهيل العملاء المحتملين', 'تعاون الفريق', 'تسليم للبشر (مخطط)']
    : bizItemsEn

  const modeIcons = { OBSERVE: Eye, ASSIST: Wrench, AUTONOMOUS: Zap }

  return (
    <div id="top" className="site-root min-h-screen overflow-x-clip text-slate-100">
      <Starfield />
      <MotionDirector />
      <SiteNav />

      <main>
        <section className="hero-grid relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-5 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-24">
          <div className="relative z-10">
            <div className="hero-split grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/25 bg-sky-500/10 px-3 py-1.5 text-[11px] font-medium tracking-[.18em] text-sky-200">
                  <Sparkles size={12} className="text-sky-300" />
                  {t.heroEyebrow}
                </div>
                <h1 className="hero-title max-w-4xl text-[2.6rem] font-semibold leading-[1.05] tracking-[-.045em] text-white sm:text-6xl lg:text-7xl">
                  {t.heroTitleA}
                  <span>{t.heroEm}</span>
                  {t.heroTitleB}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">{t.heroBody}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href="#platform">{t.explore}</Button>
                  <Button href="#agent-demo" variant="secondary">
                    <Play size={15} />
                    {t.talkBiz}
                  </Button>
                </div>
              </div>
              <HeroMascot />
            </div>
            <div className="mt-10 lg:mt-12">
              <AgentDemo />
            </div>
          </div>

          <div className="fx-panel relative z-10 mt-14 rounded-2xl border border-white/10 bg-black/55 p-3 shadow-[0_24px_80px_rgba(0,0,0,.5)] backdrop-blur-xl sm:p-5 lg:mt-16">
            <div className="mb-4 flex items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <span className="grid size-7 place-items-center rounded-md bg-sky-500/15 text-sky-300">
                  <Command size={14} />
                </span>
                {t.coreTitle}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="size-1.5 rounded-full bg-sky-400" />
                {t.coreBadge}
              </div>
            </div>
            <div className="core-map grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
              <div className="map-node map-node--main border-sky-500/25 bg-sky-500/10 sm:col-span-3 lg:col-span-1 lg:row-span-2">
                <Bot className="text-sky-300" size={20} />
                <span>{t.coreMain[0]}</span>
                <small>{t.coreMain[1]}</small>
              </div>
              {t.coreNodes.map(([label, hint], i) => {
                const Icon = nodeIcons[i]
                return (
                  <div key={label} className="map-node">
                    <Icon className="text-sky-300" size={17} />
                    <span>{label}</span>
                    <small>{hint}</small>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="platform" className="border-y border-white/8 bg-black/70 py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
            <div className="mb-8 max-w-2xl">
              <p className="eyebrow inline-flex items-center gap-2">
                <Layers size={12} className="text-sky-400" />
                {t.platformEyebrow}
              </p>
              <h2>{t.platformTitle}</h2>
              <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">{t.platformBody}</p>
            </div>

            <div className="audience-switch" role="tablist" aria-label="Platform audience">
              <button
                type="button"
                role="tab"
                aria-selected={audience === 'dev'}
                className={audience === 'dev' ? 'is-active' : ''}
                onClick={() => setAudience('dev')}
              >
                <Code2 size={15} />
                {t.forDev}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={audience === 'biz'}
                className={audience === 'biz' ? 'is-active' : ''}
                onClick={() => setAudience('biz')}
              >
                <MessageSquare size={15} />
                {t.forBiz}
              </button>
            </div>

            <article
              id={audience === 'dev' ? 'developers' : 'businesses'}
              key={audience}
              className="product-card audience-panel mx-auto max-w-4xl"
            >
              <div className="mb-8 flex items-start justify-between gap-3">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[.16em] text-sky-300">
                    {audience === 'dev' ? <Code2 size={15} /> : <MessageSquare size={15} />}
                    {audience === 'dev' ? t.devKicker : t.bizKicker}
                  </div>
                  <h3>{audience === 'dev' ? t.devTitle : t.bizTitle}</h3>
                  <p className="mt-3 max-w-2xl text-slate-400">{audience === 'dev' ? t.devBody : t.bizBody}</p>
                </div>
                <span className="shrink-0 rounded-full border border-sky-500/30 px-2 py-1 text-[10px] text-sky-300">{t.prototype}</span>
              </div>
              <ProductPreview business={audience === 'biz'} />
              <div className="mt-7 grid grid-cols-1 gap-y-3 sm:grid-cols-2 sm:gap-x-4">
                {(audience === 'dev' ? t.devItems : bizItems).map((item, i) => {
                  const Icon = (audience === 'dev' ? devItemIcons : bizItemIcons)[i] ?? Check
                  return (
                    <div key={item} className="flex gap-2 text-xs text-slate-300">
                      <Icon size={14} className="mt-0.5 shrink-0 text-sky-400" />
                      {item}
                    </div>
                  )
                })}
              </div>
              <a
                href={audience === 'dev' ? '#dave-doctor' : '#businesses'}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200"
              >
                {audience === 'dev' ? t.devLink : t.bizLink} <ArrowRight size={15} />
              </a>
            </article>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-24 lg:px-8 lg:py-28">
          <div className="mb-12 max-w-2xl">
            <p className="eyebrow inline-flex items-center gap-2">
              <Zap size={12} className="text-sky-400" />
              {t.howEyebrow}
            </p>
            <h2>{t.howTitle}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map(([num, title, desc], i) => {
              const Icon = stepIcons[i]
              return (
                <div key={num} className="step-card">
                  <span className="text-xs text-slate-400">{num}</span>
                  <div className="my-8 flex items-center">
                    <span className="grid size-10 place-items-center rounded-lg border border-sky-500/25 bg-sky-500/10 text-sky-300">
                      <Icon size={17} />
                    </span>
                  </div>
                  <h4>{title}</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="border-y border-white/8 bg-black/70 py-16 sm:py-24 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-5 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-8">
            <div>
              <p className="eyebrow inline-flex items-center gap-2">
                <Boxes size={12} className="text-sky-400" />
                {t.archEyebrow}
              </p>
              <h2>{t.archTitle}</h2>
              <p className="mt-5 leading-7 text-slate-400">{t.archBody}</p>
              <div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-400">
                {t.chips.map((chip) => (
                  <span key={chip} className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/25 px-3 py-2 text-sky-200">
                    <ShieldCheck size={12} className="text-sky-400" />
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {t.arch.map(([num, title, desc], i) => {
                const Icon = archIcons[i] ?? Sparkles
                return (
                  <div key={num} className="arch-card rounded-lg border border-white/8 bg-white/[.025] p-4">
                    <div className="mb-5 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="inline-flex items-center gap-1.5 text-sky-300">
                        <Icon size={14} />
                        {num}
                      </span>
                      <span>+</span>
                    </div>
                    <h4 className="text-sm text-white">{title}</h4>
                    <p className="mt-1 text-xs text-slate-500">{desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="dave-doctor" className="mx-auto max-w-7xl px-4 py-16 sm:px-5 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div>
              <p className="eyebrow inline-flex items-center gap-2">
                <Activity size={12} className="text-sky-400" />
                {t.daveEyebrow}
              </p>
              <h2>{t.daveTitle}</h2>
              <p className="mt-5 leading-7 text-slate-400">{t.daveBody}</p>
              <div className="mt-8 flex flex-wrap gap-2" role="tablist">
                {t.modes.map((item) => {
                  const Icon = modeIcons[item.id as keyof typeof modeIcons] ?? Eye
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={mode === item.id}
                      onClick={() => setMode(item.id as typeof mode)}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold transition ${mode === item.id ? 'border-sky-400/50 bg-sky-500/15 text-sky-100' : 'border-white/10 text-slate-500 hover:text-white'}`}
                    >
                      <Icon size={13} />
                      {item.label}
                    </button>
                  )
                })}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{t.modeCopy[mode]}</p>
            </div>
            <div className="fx-panel rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl sm:p-5">
              <div className="mb-5 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <GitPullRequest size={15} className="text-sky-400" />
                  {t.workflow}
                </span>
                <span className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="size-1.5 rounded-full bg-sky-400" />
                  {t.protoFlow}
                </span>
              </div>
              {t.flow.map(([step, detail], i) => {
                const Icon = flowIcons[i] ?? Check
                return (
                  <div key={step} className="flex items-start gap-4 border-t border-white/8 py-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300">
                      <Icon size={12} />
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold tracking-[.12em] text-slate-300">{step}</span>
                      <p className="mt-1 text-xs text-slate-500">{detail}</p>
                    </div>
                    {i === 2 && <span className="ms-auto shrink-0 text-[10px] text-slate-400">{t.isolated}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <PricingSection />

        <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-20 text-center sm:px-5 lg:px-8">
          <div className="relative">
            <p className="eyebrow inline-flex items-center justify-center gap-2">
              <Rocket size={12} className="text-sky-400" />
              {t.ctaEyebrow}
            </p>
            <h2>{t.ctaTitle}</h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">{t.ctaBody}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button>{t.getStarted}</Button>
              <Button href="/docs" variant="secondary">
                <BookOpen size={15} />
                {t.docs}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-5 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div>
            <BrandLogo />
            <p className="mt-4 text-sm text-slate-500">{t.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm text-slate-500 sm:grid-cols-4">
            {t.foot.map((label, i) => (
              <a key={label} href={t.footHrefs[i]} className="hover:text-sky-300">
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-white/8 px-4 py-5 text-xs text-slate-600 sm:px-5 lg:px-8">{t.legal}</div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <I18nProvider>
      <Home />
    </I18nProvider>
  )
}
