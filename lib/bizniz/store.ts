'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  AUTO_STORAGE_KEY,
  DEMO_AUTOMATIONS,
  DEMO_CONNECTED_APPS,
  STORAGE_KEY,
} from './demo-data'
import type { Automation, ConnectedApp, ConnectionStatus, PlatformId } from './types'

function loadApps(): ConnectedApp[] {
  if (typeof window === 'undefined') return DEMO_CONNECTED_APPS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEMO_CONNECTED_APPS)
    const parsed = JSON.parse(raw) as ConnectedApp[]
    if (!Array.isArray(parsed) || parsed.length === 0) return structuredClone(DEMO_CONNECTED_APPS)
    return parsed
  } catch {
    return structuredClone(DEMO_CONNECTED_APPS)
  }
}

function saveApps(apps: ConnectedApp[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
}

function loadAutos(): Automation[] {
  if (typeof window === 'undefined') return DEMO_AUTOMATIONS
  try {
    const raw = localStorage.getItem(AUTO_STORAGE_KEY)
    if (!raw) return structuredClone(DEMO_AUTOMATIONS)
    const parsed = JSON.parse(raw) as Automation[]
    if (!Array.isArray(parsed) || parsed.length === 0) return structuredClone(DEMO_AUTOMATIONS)
    return parsed
  } catch {
    return structuredClone(DEMO_AUTOMATIONS)
  }
}

function saveAutos(autos: Automation[]) {
  localStorage.setItem(AUTO_STORAGE_KEY, JSON.stringify(autos))
}

export function useBiznizApps() {
  const [apps, setApps] = useState<ConnectedApp[]>(DEMO_CONNECTED_APPS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setApps(loadApps())
    setReady(true)
  }, [])

  const persist = useCallback((next: ConnectedApp[]) => {
    setApps(next)
    saveApps(next)
  }, [])

  const setStatus = useCallback(
    (id: string, status: ConnectionStatus, extras?: Partial<ConnectedApp>) => {
      persist(
        apps.map((app) =>
          app.id === id
            ? {
                ...app,
                status,
                automationPaused: status === 'paused' || status === 'disconnected',
                ...extras,
              }
            : app,
        ),
      )
    },
    [apps, persist],
  )

  const pause = useCallback((id: string) => setStatus(id, 'paused', { automationPaused: true }), [setStatus])
  const resume = useCallback((id: string) => setStatus(id, 'active', { automationPaused: false }), [setStatus])
  const disconnect = useCallback(
    (id: string) =>
      setStatus(id, 'disconnected', {
        automationPaused: true,
        accountLabel: undefined,
        connectedAt: undefined,
        messagesThisMonth: 0,
      }),
    [setStatus],
  )
  const connectDemo = useCallback(
    (id: string, accountLabel: string) =>
      setStatus(id, 'active', {
        automationPaused: false,
        accountLabel,
        connectedAt: new Date().toISOString(),
        messagesThisMonth: apps.find((a) => a.id === id)?.messagesThisMonth || 120,
        messageDeltaPct: 5,
      }),
    [apps, setStatus],
  )

  const byPlatform = useCallback(
    (platformId: PlatformId) => apps.filter((a) => a.platformId === platformId),
    [apps],
  )

  const connectedOnly = apps.filter((a) => a.status === 'active' || a.status === 'paused' || a.status === 'error')

  return {
    apps,
    ready,
    connectedOnly,
    byPlatform,
    pause,
    resume,
    disconnect,
    connectDemo,
    reset: () => persist(structuredClone(DEMO_CONNECTED_APPS)),
  }
}

export function useBiznizAutomations() {
  const [autos, setAutos] = useState<Automation[]>(DEMO_AUTOMATIONS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setAutos(loadAutos())
    setReady(true)
  }, [])

  const persist = useCallback((next: Automation[]) => {
    setAutos(next)
    saveAutos(next)
  }, [])

  const pause = useCallback(
    (id: string) =>
      persist(autos.map((a) => (a.id === id ? { ...a, status: 'paused' as const } : a))),
    [autos, persist],
  )
  const resume = useCallback(
    (id: string) =>
      persist(autos.map((a) => (a.id === id ? { ...a, status: 'active' as const } : a))),
    [autos, persist],
  )

  return { autos, ready, pause, resume }
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.max(1, Math.round(diff / 60000))
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 48) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}
