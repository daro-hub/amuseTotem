'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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
  // Inizializza sempre con 'it' per evitare hydration mismatch
  const [currentLanguage, setCurrentLanguage] = useState('it')
  const [isClient, setIsClient] = useState(false)

  // Effetto per caricare la lingua dal localStorage solo dopo l'hydration
  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  // Salva la lingua nel localStorage quando cambia
  const handleSetLanguage = (language: string) => {
    setCurrentLanguage(language)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedLanguage', language)
    }
  }

  const t = (key: string): string => {
    return translateFunction(key, currentLanguage)
  }

  const value = {
    currentLanguage,
    setCurrentLanguage: handleSetLanguage,
    setLanguage: handleSetLanguage, // Alias per compatibilità
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
