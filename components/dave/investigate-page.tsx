'use client'

import dynamic from 'next/dynamic'
import { daveCopy } from '@/lib/dave/copy'
import { MotionIn } from '@/components/bizniz/motion-in'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { DaveTopbar } from './shell/topbar'

const DaveDoctorWorkspace = dynamic(
  () =>
    import('@/components/dave-doctor-demo/dave-doctor-workspace').then((m) => m.DaveDoctorWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="dv-card dv-glass grid min-h-[420px] place-items-center text-sm text-slate-500">
        Loading investigation…
      </div>
    ),
  },
)

export function DaveInvestigatePage() {
  const { lang, isRtl } = useBiznizLang()
  const t = daveCopy(lang)

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <MotionIn>
        <DaveTopbar title={t.investigateTitle} subtitle={t.investigateSub} showInvestigate={false} />
      </MotionIn>
      <MotionIn delay={40}>
        <p className="dv-banner mb-4">{t.demoHint}</p>
      </MotionIn>
      <MotionIn delay={80} className="dv-investigate-wrap">
        <DaveDoctorWorkspace />
      </MotionIn>
    </div>
  )
}
