import type { PlatformId } from '@/lib/bizniz/types'
import { PlatformLogo } from '@/components/brands/platform-logo'
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
  return (
    <span className={cn('platform-logo-wrap', className)} aria-hidden>
      <PlatformLogo name={id} size={size} />
    </span>
  )
}
