'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DEMO_DURATION_MS } from '@/lib/dave-doctor-demo/scenario'

type Options = {
  reducedMotion?: boolean
  autoplay?: boolean
  /** Restart from the beginning when the story finishes. Default true. */
  loop?: boolean
}

export function useDaveTimeline({ reducedMotion = false, autoplay = true, loop = true }: Options = {}) {
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(!autoplay)
  const [generation, setGeneration] = useState(0)

  const elapsedRef = useRef(0)
  const pausedRef = useRef(paused)
  const loopRef = useRef(loop)
  const rafRef = useRef(0)
  const lastTsRef = useRef<number | null>(null)
  const mountedRef = useRef(true)

  pausedRef.current = paused
  loopRef.current = loop

  const tick = useCallback((ts: number) => {
    if (!mountedRef.current) return
    if (lastTsRef.current == null) lastTsRef.current = ts
    const dt = ts - lastTsRef.current
    lastTsRef.current = ts

    if (!pausedRef.current) {
      let next = elapsedRef.current + dt
      if (next >= DEMO_DURATION_MS) {
        if (loopRef.current) {
          next = 0
          lastTsRef.current = ts
        } else {
          next = DEMO_DURATION_MS
          elapsedRef.current = next
          setElapsed(next)
          pausedRef.current = true
          setPaused(true)
          lastTsRef.current = null
          return
        }
      }
      elapsedRef.current = next
      setElapsed(next)
    }

    rafRef.current = window.requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      window.cancelAnimationFrame(rafRef.current)
    }
  }, [])

  useEffect(() => {
    window.cancelAnimationFrame(rafRef.current)
    lastTsRef.current = null

    if (reducedMotion) {
      elapsedRef.current = DEMO_DURATION_MS
      setElapsed(DEMO_DURATION_MS)
      setPaused(true)
      return
    }

    rafRef.current = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafRef.current)
  }, [generation, reducedMotion, tick])

  const replay = useCallback(() => {
    window.cancelAnimationFrame(rafRef.current)
    lastTsRef.current = null
    elapsedRef.current = 0
    setElapsed(0)
    setPaused(false)
    pausedRef.current = false
    setGeneration((g) => g + 1)
  }, [])

  const pause = useCallback(() => {
    setPaused(true)
    pausedRef.current = true
    lastTsRef.current = null
    window.cancelAnimationFrame(rafRef.current)
  }, [])

  const resume = useCallback(() => {
    if (!loopRef.current && elapsedRef.current >= DEMO_DURATION_MS) {
      replay()
      return
    }
    setPaused(false)
    pausedRef.current = false
    lastTsRef.current = null
    setGeneration((g) => g + 1)
  }, [replay])

  const togglePause = useCallback(() => {
    if (pausedRef.current) resume()
    else pause()
  }, [pause, resume])

  return {
    elapsed,
    paused,
    done: !loop && elapsed >= DEMO_DURATION_MS,
    replay,
    pause,
    resume,
    togglePause,
  }
}
