'use client'

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article'
  interactive?: boolean
}

/** Liquid-glass surface for Dave Doctor cards and panels. */
export function DaveGlass({ children, className, as = 'div', interactive = true }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    ref.current.style.setProperty('--dv-gx', `${x}%`)
    ref.current.style.setProperty('--dv-gy', `${y}%`)
  }

  const props = {
    ref: ref as never,
    className: cn('dv-lg', className),
    style: { '--dv-gx': '28%', '--dv-gy': '18%' } as CSSProperties,
    onPointerMove: onMove,
    onPointerLeave: () => {
      if (!ref.current) return
      ref.current.style.setProperty('--dv-gx', '28%')
      ref.current.style.setProperty('--dv-gy', '18%')
    },
  }

  const layers = (
    <>
      <span className="dv-lg__frost" aria-hidden />
      <span className="dv-lg__shine" aria-hidden />
      <span className="dv-lg__rim" aria-hidden />
      <div className="dv-lg__body">{children}</div>
    </>
  )

  if (as === 'section') return <section {...props}>{layers}</section>
  if (as === 'article') return <article {...props}>{layers}</article>
  return <div {...props}>{layers}</div>
}
