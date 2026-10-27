'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const TONES = {
  cyan: 'dv-ico--cyan',
  violet: 'dv-ico--violet',
  amber: 'dv-ico--amber',
  rose: 'dv-ico--rose',
  emerald: 'dv-ico--emerald',
  sky: 'dv-ico--sky',
} as const

export function IconChip({
  icon: Icon,
  tone = 'cyan',
  size = 18,
  className,
}: {
  icon: LucideIcon
  tone?: keyof typeof TONES
  size?: number
  className?: string
}) {
  return (
    <span className={cn('dv-ico', TONES[tone], className)} aria-hidden>
      <Icon size={size} strokeWidth={1.9} />
    </span>
  )
}
