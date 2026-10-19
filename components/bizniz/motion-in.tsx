'use client'

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Lightweight entrance motion — CSS only after one IntersectionObserver tick. */
export function MotionIn({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add('is-in')
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const style = { transitionDelay: `${delay}ms` } satisfies CSSProperties
  const cls = cn('bz-motion', className)

  // Single element type keeps ref typing simple; semantic tags via role when needed.
  if (as === 'section') {
    return (
      <section ref={ref as never} className={cls} style={style}>
        {children}
      </section>
    )
  }
  if (as === 'li') {
    return (
      <li ref={ref as never} className={cls} style={style}>
        {children}
      </li>
    )
  }
  if (as === 'article') {
    return (
      <article ref={ref as never} className={cls} style={style}>
        {children}
      </article>
    )
  }
  return (
    <div ref={ref} className={cls} style={style}>
      {children}
    </div>
  )
}
