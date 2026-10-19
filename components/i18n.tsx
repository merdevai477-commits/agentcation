'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { copy, type Copy, type Lang } from '@/lib/copy'

type I18nValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Copy
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = window.localStorage.getItem('ag-lang')
    if (saved === 'ar' || saved === 'en') setLangState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    window.localStorage.setItem('ag-lang', lang)
  }, [lang])

  return (
    <I18nContext.Provider value={{ lang, setLang: setLangState, t: copy[lang] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used within I18nProvider')
  return value
}

/** Safe for surfaces outside the marketing I18nProvider (e.g. /dashboard). */
export function useOptionalI18n() {
  return useContext(I18nContext)
}

export function LangSwitch() {
  const { lang, setLang } = useI18n()
  const next = lang === 'en' ? 'ar' : 'en'
  return (
    <button type="button" className="lang-switch" onClick={() => setLang(next)} aria-label={lang === 'en' ? 'العربية' : 'English'}>
      {lang === 'en' ? 'عربي' : 'EN'}
    </button>
  )
}
