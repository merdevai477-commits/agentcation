'use client'

import { useEffect } from 'react'

const TILT = '.product-card, .map-node, .step-card, .price-card, .arch-card, .fx-panel'
const STAGGER =
  '.product-card, .map-node, .step-card, .price-card, .arch-card, .fx-panel, .agent-console, .preview-grid, .audience-switch, .core-map > *, [data-reveal]'

export function MotionDirector() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.getElementById('top')
    if (!root) return

    const sections = Array.from(root.querySelectorAll<HTMLElement>('main > section, footer'))

    sections.forEach((section, sectionIndex) => {
      section.classList.add('reveal-section')

      // Section intro: eyebrow / title / lead copy
      const intro = section.querySelector<HTMLElement>(
        ':scope > div > .mb-8, :scope > div > .mb-10, :scope > .mb-8, :scope > .max-w-2xl, :scope .eyebrow',
      )
      const heading = section.querySelectorAll<HTMLElement>(
        ':scope h2, :scope .eyebrow, :scope > div > .max-w-2xl > p, :scope > div > .mb-8 > p, :scope > div > .mb-8 > h2',
      )

      heading.forEach((el, i) => {
        if (el.closest('.reveal-item')) return
        el.classList.add('reveal-item', i === 0 ? 'reveal-item--up' : 'reveal-item--fade')
        el.style.setProperty('--reveal-delay', `${Math.min(i * 70, 280)}ms`)
      })

      // Cards / nodes inside the section — staggered
      const items = Array.from(section.querySelectorAll<HTMLElement>(STAGGER)).filter(
        (el) => !el.classList.contains('reveal-section'),
      )

      items.forEach((el, i) => {
        el.classList.add('reveal-item', 'reveal-item--up')
        // Slight variety: every 3rd item fades from the side on wide layouts
        if (i % 4 === 1) el.classList.add('reveal-item--left')
        if (i % 4 === 2) el.classList.add('reveal-item--right')
        el.style.setProperty('--reveal-delay', `${80 + Math.min(i * 55, 420)}ms`)
      })

      // First section (hero) visible immediately for snappy load
      if (sectionIndex === 0) {
        section.classList.add('is-in')
        section.querySelectorAll('.reveal-item').forEach((el) => el.classList.add('is-in'))
      }
    })

    if (reduce) {
      root.querySelectorAll('.reveal-section, .reveal-item').forEach((el) => el.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const target = entry.target as HTMLElement
          target.classList.add('is-in')
          target.querySelectorAll('.reveal-item').forEach((child) => child.classList.add('is-in'))
          io.unobserve(target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
    )

    sections.forEach((section) => {
      if (!section.classList.contains('is-in')) io.observe(section)
    })

    // Gentle parallax on hero backdrop only
    const hero = sections[0]
    let ticking = false
    const onScroll = () => {
      if (ticking || !hero) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (y < window.innerHeight * 1.2) {
          hero.style.setProperty('--hero-shift', `${Math.min(y * 0.12, 48)}px`)
        }
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const cards = Array.from(root.querySelectorAll<HTMLElement>(TILT))
    const cleanups: Array<() => void> = []

    for (const el of cards) {
      el.classList.add('fx-tilt')
      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height
        const lift = el.classList.contains('map-node') || el.classList.contains('arch-card') ? 5 : 8
        el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
        el.style.transform = `perspective(980px) rotateX(${((0.5 - y) * lift).toFixed(2)}deg) rotateY(${((x - 0.5) * lift).toFixed(2)}deg) translateZ(0)`
      }
      const onLeave = () => {
        el.style.transform = ''
      }
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      })
    }

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return null
}
