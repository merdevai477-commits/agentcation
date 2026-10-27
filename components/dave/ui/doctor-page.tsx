'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { doctorCopy } from '@/lib/dave/doctor-copy'
import { useBiznizLang } from '@/components/bizniz/use-bizniz-lang'
import { useDoctorWorkspace } from '@/components/dave/workspace-context'
import { DaveTopbar } from '@/components/dave/shell/topbar'
import { LoadingState, StateBlock } from './kit'

export function DoctorPage({
  title,
  subtitle,
  actions,
  children,
  emptyTitle,
  emptyBody,
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  emptyTitle?: string
  emptyBody?: string
}) {
  const { lang, isRtl } = useBiznizLang()
  const { preview, setPreview } = useDoctorWorkspace()
  const copy = doctorCopy(lang)

  let body = children
  if (preview === 'loading') body = <LoadingState />
  else if (preview === 'error') {
    body = (
      <StateBlock
        title={copy.states.errorTitle}
        body={copy.states.errorBody}
        action={
          <button type="button" className="dv-btn dv-btn--primary" onClick={() => setPreview('ready')}>
            {copy.states.retry}
          </button>
        }
      />
    )
  } else if (preview === 'denied') {
    body = (
      <StateBlock
        title={copy.states.deniedTitle}
        body={copy.states.deniedBody}
        action={
          <button type="button" className="dv-btn dv-btn--ghost" onClick={() => setPreview('ready')}>
            {copy.states.retry}
          </button>
        }
      />
    )
  } else if (preview === 'disconnected') {
    body = (
      <StateBlock
        title={copy.states.disconnectedTitle}
        body={copy.states.disconnectedBody}
        action={
          <Link href="/dashboard/integrations" className="dv-btn dv-btn--ghost">
            {copy.states.integrations}
          </Link>
        }
      />
    )
  } else if (preview === 'empty') {
    body = <StateBlock title={emptyTitle || copy.states.empty} body={emptyBody || copy.states.emptyBody} />
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <DaveTopbar title={title} subtitle={subtitle} showInvestigate={false} extra={actions} />
      {lang === 'ar' ? <p className="dv-note">{copy.technical}</p> : null}
      {body}
    </div>
  )
}
