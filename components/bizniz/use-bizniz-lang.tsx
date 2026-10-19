'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Lang } from '@/lib/copy'

const KEY = 'ag-lang'

type Value = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggle: () => void
  isRtl: boolean
}

const Ctx = createContext<Value | null>(null)

export function BiznizLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'ar' || saved === 'en') {
      setLangState(saved)
      document.documentElement.lang = saved
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr'
    }
  }, [])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    window.localStorage.setItem(KEY, next)
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
  }, [])

  const toggle = useCallback(() => {
    setLang(lang === 'en' ? 'ar' : 'en')
  }, [lang, setLang])

  const value = useMemo(
    () => ({ lang, setLang, toggle, isRtl: lang === 'ar' }),
    [lang, setLang, toggle],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useBiznizLang() {
  const ctx = useContext(Ctx)
  if (!ctx) {
    throw new Error('useBiznizLang must be used within BiznizLangProvider')
  }
  return ctx
}
