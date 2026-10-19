import type { ConnectionStatus } from '@/lib/bizniz/types'
import { cn } from '@/lib/utils'

const LABELS: Record<ConnectionStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  disconnected: 'Disconnected',
  error: 'Error',
  available: 'Not connected',
}

export function StatusDot({
  status,
  showLabel = true,
  className,
}: {
  status: ConnectionStatus
  showLabel?: boolean
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs', className)}>
      <span
        className={cn(
          'size-1.5 rounded-full',
          status === 'active' && 'bz-status-pulse bg-emerald-400',
          status === 'paused' && 'bg-amber-400',
          status === 'disconnected' && 'bg-slate-500',
          status === 'error' && 'bg-rose-400',
          status === 'available' && 'bg-slate-600',
        )}
      />
      {showLabel ? (
        <span
          className={cn(
            status === 'active' && 'text-emerald-400',
            status === 'paused' && 'text-amber-300',
            status === 'disconnected' && 'text-slate-400',
            status === 'error' && 'text-rose-300',
            status === 'available' && 'text-slate-500',
          )}
        >
          {LABELS[status]}
        </span>
      ) : null}
    </span>
  )
}
