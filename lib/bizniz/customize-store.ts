'use client'

import { useCallback, useEffect, useState } from 'react'
import { DEMO_CUSTOMIZE_ITEMS } from './customize-demo'
import type { CustomizeItem, CustomizeStatus, DeviMessage } from './customize-types'

const ITEMS_KEY = 'agentication_bizniz_customize_v1'
const DEVI_KEY = 'agentication_bizniz_devi_v1'

function readItems(): CustomizeItem[] {
  if (typeof window === 'undefined') return DEMO_CUSTOMIZE_ITEMS
  try {
    const raw = localStorage.getItem(ITEMS_KEY)
    if (!raw) return DEMO_CUSTOMIZE_ITEMS
    const parsed = JSON.parse(raw) as CustomizeItem[]
    return Array.isArray(parsed) && parsed.length ? parsed : DEMO_CUSTOMIZE_ITEMS
  } catch {
    return DEMO_CUSTOMIZE_ITEMS
  }
}

function writeItems(items: CustomizeItem[]) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items))
}

function readDevi(): DeviMessage[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(DEVI_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as DeviMessage[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeDevi(msgs: DeviMessage[]) {
  localStorage.setItem(DEVI_KEY, JSON.stringify(msgs))
}

export function useCustomizeQueue() {
  const [items, setItems] = useState<CustomizeItem[]>(DEMO_CUSTOMIZE_ITEMS)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setItems(readItems())
    setReady(true)
  }, [])

  const persist = useCallback((next: CustomizeItem[]) => {
    setItems(next)
    writeItems(next)
  }, [])

  const setStatus = useCallback(
    (id: string, status: CustomizeStatus) => {
      persist(items.map((it) => (it.id === id ? { ...it, status } : it)))
    },
    [items, persist],
  )

  const addFromDevi = useCallback(
    (text: string, textAr?: string) => {
      const item: CustomizeItem = {
        id: `cz_${Date.now()}`,
        kind: /سعر|price|EGP|ج\.م|تسعير/i.test(text) ? 'pricing' : 'knowledge',
        status: 'open',
        question: text,
        questionAr: textAr || text,
        note: 'Filed by Devi Clerk',
        noteAr: 'سجّله ديفي الموظف',
        clientName: 'You',
        platformId: 'whatsapp',
        at: new Date().toISOString(),
        suggestedFix: text,
        suggestedFixAr: textAr || text,
      }
      persist([item, ...items])
      return item
    },
    [items, persist],
  )

  return { items, ready, setStatus, addFromDevi }
}

export function useDeviChat(welcome: string) {
  const [messages, setMessages] = useState<DeviMessage[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = readDevi()
    if (saved.length) {
      setMessages(saved)
    } else {
      setMessages([
        {
          id: 'devi_welcome',
          role: 'devi',
          text: welcome,
          at: new Date().toISOString(),
        },
      ])
    }
    setReady(true)
    // Welcome only seeds an empty chat once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const push = useCallback((msgs: DeviMessage[]) => {
    setMessages(msgs)
    writeDevi(msgs)
  }, [])

  const send = useCallback(
    (text: string, ack: string) => {
      const now = new Date().toISOString()
      const next: DeviMessage[] = [
        ...messages,
        { id: `u_${Date.now()}`, role: 'user', text, at: now },
        { id: `d_${Date.now() + 1}`, role: 'devi', text: ack, at: now },
      ]
      push(next)
    },
    [messages, push],
  )

  return { messages, ready, send }
}
