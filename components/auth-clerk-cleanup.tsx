'use client'

import { useEffect } from 'react'

/** Hide residual Clerk chrome ("Secured by Clerk", "Development mode") inside the auth box. */
export function AuthClerkCleanup() {
  useEffect(() => {
    const root = document.querySelector('.auth-clerk')
    if (!root) return

    const scrub = () => {
      const nodes = root.querySelectorAll('a, p, span, div, button')
      nodes.forEach((el) => {
        const text = (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase()
        const href = el instanceof HTMLAnchorElement ? (el.href || '').toLowerCase() : ''
        const hit =
          href.includes('clerk.com') ||
          href.includes('clerk.dev') ||
          text === 'secured by clerk' ||
          text.includes('secured by') ||
          text === 'development mode' ||
          text === 'dev mode'
        if (!hit) return
        // Prefer hiding the smallest branded wrapper, not the whole card
        const target =
          (el.closest('[class*="footer"]') as HTMLElement | null) ||
          (el.parentElement as HTMLElement | null) ||
          (el as HTMLElement)
        target.style.setProperty('display', 'none', 'important')
        target.setAttribute('aria-hidden', 'true')
      })
    }

    scrub()
    const mo = new MutationObserver(scrub)
    mo.observe(root, { childList: true, subtree: true, characterData: true })
    return () => mo.disconnect()
  }, [])

  return null
}
