'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { fetchBiznizOverview, type BiznizOverview } from '@/lib/bizniz/api'

export function useLiveOverview(pollMs = 15000) {
  const { getToken, isSignedIn } = useAuth()
  const [data, setData] = useState<BiznizOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const tokenFn = useCallback(() => getToken(), [getToken])

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setLoading(false)
      return
    }
    try {
      const next = await fetchBiznizOverview(tokenFn)
      setData(next)
      setError('')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [isSignedIn, tokenFn])

  useEffect(() => {
    void refresh()
    if (!isSignedIn) return
    const t = setInterval(() => void refresh(), pollMs)
    return () => clearInterval(t)
  }, [isSignedIn, pollMs, refresh])

  return { data, loading, error, refresh }
}
