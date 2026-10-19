'use client'

import Link from 'next/link'
import { ArrowUpRight, Info, Lightbulb, AlertTriangle, Clock3 } from 'lucide-react'
import { pick, type DocBlock, type Lang } from '@/lib/docs'
import { docsUi } from '@/lib/docs/ui'

const calloutIcon = {
  info: Info,
  warning: AlertTriangle,
  planned: Clock3,
  tip: Lightbulb,
} as const

export function DocsBlocks({ blocks, lang }: { blocks: DocBlock[]; lang: Lang }) {
  return (
    <div className="docs-prose">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':
            return (
              <p key={i} className="docs-p">
                {pick(block.text, lang)}
              </p>
            )
          case 'h2':
            return (
              <h2 key={block.id} id={block.id} className="docs-h2">
                {pick(block.text, lang)}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={block.id} id={block.id} className="docs-h3">
                {pick(block.text, lang)}
              </h3>
            )
          case 'ul':
            return (
              <ul key={i} className="docs-ul">
                {block.items.map((item, j) => (
                  <li key={j}>{pick(item, lang)}</li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={i} className="docs-ol">
                {block.items.map((item, j) => (
                  <li key={j}>{pick(item, lang)}</li>
                ))}
              </ol>
            )
          case 'callout': {
            const Icon = calloutIcon[block.variant]
            const title = block.title ? pick(block.title, lang) : pick(docsUi.callout[block.variant], lang)
            return (
              <aside key={i} className={`docs-callout docs-callout--${block.variant}`} role="note">
                <div className="docs-callout__head">
                  <Icon size={16} aria-hidden />
                  <span>{title}</span>
                </div>
                <p>{pick(block.text, lang)}</p>
              </aside>
            )
          }
          case 'steps':
            return (
              <ol key={i} className="docs-steps">
                {block.items.map((step, j) => (
                  <li key={j}>
                    <span className="docs-steps__n">{String(j + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{pick(step.title, lang)}</strong>
                      <p>{pick(step.body, lang)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )
          case 'cards':
            return (
              <div key={i} className="docs-cards">
                {block.items.map((card, j) => {
                  const href = card.href.startsWith('/') ? card.href : `/docs/${card.href}`
                  const external = href.startsWith('http') || href.startsWith('/#') || !href.startsWith('/docs')
                  const inner = (
                    <>
                      <div className="docs-cards__top">
                        <strong>{pick(card.title, lang)}</strong>
                        <ArrowUpRight size={15} aria-hidden />
                      </div>
                      <p>{pick(card.body, lang)}</p>
                    </>
                  )
                  return external ? (
                    <a key={j} href={href} className="docs-card">
                      {inner}
                    </a>
                  ) : (
                    <Link key={j} href={href} className="docs-card">
                      {inner}
                    </Link>
                  )
                })}
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
