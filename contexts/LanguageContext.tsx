'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { supportedLanguages, Language } from '@/lib/languages'
import { t as translateFunction } from '@/lib/translations'

interface LanguageContextType {
  currentLanguage: string
  setCurrentLanguage: (language: string) => void
  setLanguage: (language: string) => void
  availableLanguages: Language[]
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('it')

  const t = (key: string): string => {
    return translateFunction(key, currentLanguage)
  }

  const value = {
    currentLanguage,
    setCurrentLanguage,
    setLanguage: setCurrentLanguage, // Alias per compatibilità
    availableLanguages: supportedLanguages,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
