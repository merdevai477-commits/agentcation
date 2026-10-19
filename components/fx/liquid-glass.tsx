'use client'

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** Follow pointer with specular highlight */
  interactive?: boolean
}

export function LiquidGlass({ children, className = '', interactive = true }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(event: PointerEvent<HTMLDivElement>) {
    if (!interactive || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    ref.current.style.setProperty('--lg-x', `${x}%`)
    ref.current.style.setProperty('--lg-y', `${y}%`)
  }

  return (
    <div
      ref={ref}
      className={`lg-panel ${className}`.trim()}
      style={{ '--lg-x': '30%', '--lg-y': '20%' } as CSSProperties}
      onPointerMove={onMove}
      onPointerLeave={() => {
        if (!ref.current) return
        ref.current.style.setProperty('--lg-x', '30%')
        ref.current.style.setProperty('--lg-y', '20%')
      }}
    >
      {/* Real frosted glass: blurs page content behind the bar */}
      <div className="lg-panel__frost" aria-hidden />
      <div className="lg-panel__tint" aria-hidden />
      <div className="lg-panel__caustic" aria-hidden />
      <div className="lg-panel__specular" aria-hidden />
      <div className="lg-panel__rim" aria-hidden />
      <div className="lg-panel__noise" aria-hidden />
      <div className="lg-panel__shine" aria-hidden />
      <div className="lg-panel__content">{children}</div>
    </div>
  )
}
