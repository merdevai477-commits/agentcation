export function formatStamp(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatDay(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export function sampleUsd(amount: number) {
  return `~$${amount.toFixed(2)} sample`
}

export function includesQuery(query: string, parts: Array<string | undefined>) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return parts.some((part) => part?.toLowerCase().includes(q))
}

export function sliceSeries<T>(points: T[], range: '1h' | '6h' | '24h' | '7d' | '30d') {
  const n = range === '1h' ? 8 : range === '6h' ? 12 : range === '24h' ? 18 : range === '7d' ? 24 : points.length
  return points.slice(-Math.min(n, points.length))
}
