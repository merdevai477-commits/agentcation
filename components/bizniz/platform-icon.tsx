import { MessageCircle, Send } from 'lucide-react'
import type { PlatformId } from '@/lib/bizniz/types'
import { getPlatform } from '@/lib/bizniz/platforms'
import { cn } from '@/lib/utils'

export function PlatformIcon({
  id,
  size = 18,
  className,
}: {
  id: PlatformId
  size?: number
  className?: string
}) {
  const p = getPlatform(id)
  const style = { color: p.brandColor }

  if (id === 'whatsapp') {
    return (
      <span className={cn('inline-flex', className)} style={style} aria-hidden>
        <MessageCircle size={size} fill="currentColor" strokeWidth={0} />
      </span>
    )
  }
  if (id === 'telegram') {
    return (
      <span className={cn('inline-flex', className)} style={style} aria-hidden>
        <Send size={size} />
      </span>
    )
  }
  if (id === 'instagram') {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-[6px] font-bold leading-none',
          className,
        )}
        style={{
          width: size + 4,
          height: size + 4,
          fontSize: size * 0.55,
          background: 'linear-gradient(135deg,#f58529,#dd2a7b,#8134af)',
          color: 'white',
        }}
        aria-hidden
      >
        Ig
      </span>
    )
  }
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-bold leading-none text-white',
        className,
      )}
      style={{
        width: size + 4,
        height: size + 4,
        fontSize: size * 0.45,
        background: '#0084FF',
      }}
      aria-hidden
    >
      f
    </span>
  )
}
