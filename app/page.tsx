"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AmuseLogo from "@/components/AmuseLogo"
import { tabletSizes } from "@/lib/colors"
import { supportedLanguages, languageToCountryCode } from "@/lib/languages"
import { t } from "@/lib/translations"
import { useLanguage } from "@/contexts/LanguageContext"
import { useMuseum } from "@/contexts/MuseumContext"
import { useFontRecalc } from "@/hooks/use-font-recalc"
import { MuseumDialog } from "@/components/MuseumDialog"
import { typography, gradients } from "@/lib/typography"


interface MuseumLanguage {
  language_id: number
  code: string
  name: string
}

interface MuseumData {
  museum_id: string
  museum_name: string
  museum_description: string
  museum_languages: MuseumLanguage[]
  itineraries: any[]
}

export default function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [showMuseumDialog, setShowMuseumDialog] = useState(false)
  const [hasCheckedMuseumId, setHasCheckedMuseumId] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t, setLanguage, currentLanguage } = useLanguage()
  const { museumId, museumData, setMuseumId, mode, ticketPrice, currency, updateConfig } = useMuseum()
  
  // Hook per gestire il ricalcolo delle dimensioni
  useFontRecalc()

  // Mostra dialog solo al primo accesso se non c'è museum_id
  useEffect(() => {
    if (!hasCheckedMuseumId) {
      setHasCheckedMuseumId(true)
      // Controlla se c'è museum_id salvato nel localStorage
      const savedMuseumId = localStorage.getItem('museumId')
      if (!savedMuseumId) {
        setShowMuseumDialog(true)
      }
      // Imposta sempre loading a false dopo aver controllato
      setIsLoading(false)
    }
  }, [hasCheckedMuseumId])

  // Gestisce il loading quando i dati del museo vengono caricati
  useEffect(() => {
    if (museumData || showMuseumDialog) {
      setIsLoading(false)
    }
  }, [museumData, showMuseumDialog])

  // Timeout di sicurezza per evitare loading infinito
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // 3 secondi di timeout

    return () => clearTimeout(timeout)
  }, [])

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
    // Forza il re-render per assicurarsi che le dimensioni siano corrette
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
      // Forza anche un re-render del componente
      setSelectedLanguage(null)
    }, 100)
  }, [])

  // Gestisce il ripristino della pagina da bfcache
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        console.log('🔄 Page restored from bfcache, forcing recalculation')
        // Forza ricalcolo completo
        setTimeout(() => {
          window.scrollTo(0, 0)
          window.dispatchEvent(new Event('resize'))
          setSelectedLanguage(null)
          // Forza ricalcolo font-size
          document.body.style.fontSize = ''
          document.documentElement.style.fontSize = ''
          // Trigger reflow
          document.body.offsetHeight
        }, 50)
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page became visible, forcing recalculation')
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'))
          setSelectedLanguage(null)
        }, 100)
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('pageshow', handlePageShow)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleLanguageSelect = (langCode: string) => {
    setSelectedLanguage(langCode)
    // Imposta la lingua globale per tutta l'app
    setLanguage(langCode)
    // Vai direttamente alla pagina successiva
    router.push("/quantity-selector")
  }

  const handleMuseumIdSet = (id: string, data: MuseumData) => {
    setMuseumId(id, data)
    setShowMuseumDialog(false)
  }

  const handleInvisibleButtonClick = () => {
    setShowMuseumDialog(true)
  }

  const handleDialogClose = () => {
    setShowMuseumDialog(false)
  }

  // Usa le lingue dal museo se disponibili, altrimenti array vuoto (mostra loading)
  const displayLanguages = museumData?.museum_languages || []
  
  // Debug: log delle lingue del museo
  console.log('🏛️ Museum data available:', !!museumData)
  console.log('🌍 Display languages count:', displayLanguages.length)
  console.log('🆔 Museum ID:', museumId)
  console.log('⏳ Is loading:', isLoading)
  if (displayLanguages.length > 0) {
    console.log('📋 All language codes:', displayLanguages.map(l => l.code))
  } else {
    console.log('❌ No languages found - this might be the problem!')
  }

  // Mostra loading solo se stiamo effettivamente caricando
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-[100dvh] language-selector language-selector-page bg-black flex flex-col relative">
      {/* Tasto invisibile in alto a destra per modificare museum_id */}
      <button
        onClick={handleInvisibleButtonClick}
        className="absolute top-4 right-4 w-8 h-8 opacity-0 hover:opacity-20 transition-opacity z-10"
        title="Modifica ID Museo"
      />
      
      {/* Header con logo e titolo - Fisso in alto */}
      <div className="flex flex-col items-center py-4 px-6 flex-shrink-0">
        <AmuseLogo size={tabletSizes.logo.size} />
        <div className="text-center mt-2 mb-4">
          <h2 className="text-white text-4xl font-bold text-center">
            {t('language.select')}
          </h2>
        </div>
      </div>

      {/* Griglia lingue - Scorrevole */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className={`grid grid-cols-2 ${tabletSizes.spacing.gap} w-full max-w-6xl mx-auto`}>
        {displayLanguages.length > 0 ? (
          displayLanguages.map((language, index) => {
            const langCode = language.code || 'it'
            // Mapping più intelligente per le bandiere
            let countryCode = languageToCountryCode[langCode as keyof typeof languageToCountryCode]
            
            if (!countryCode) {
              // Prova varianti del codice lingua
              const langVariants = [
                typeof langCode === 'string' ? langCode.toLowerCase() : 'it',
                typeof langCode === 'string' ? langCode.substring(0, 2) : 'it',
                typeof langCode === 'string' ? langCode.substring(0, 3) : 'it'
              ]
              
              for (const variant of langVariants) {
                if (languageToCountryCode[variant as keyof typeof languageToCountryCode]) {
                  countryCode = languageToCountryCode[variant as keyof typeof languageToCountryCode]
                  break
                }
              }
            }
            
            // Fallback finale: usa il codice lingua originale se è di 2 caratteri
            if (!countryCode && typeof langCode === 'string' && langCode.length === 2) {
              countryCode = langCode.toUpperCase() as any
            } else if (!countryCode) {
              // Prova a usare il codice lingua originale come paese
              if (typeof langCode === 'string' && langCode.length >= 2) {
                countryCode = langCode.substring(0, 2).toUpperCase() as any
              } else {
                countryCode = 'IT' // Fallback solo se proprio non si trova nulla
              }
            }
            
            // Verifica di sicurezza: assicurati che countryCode sia sempre una stringa valida
            if (!countryCode || typeof countryCode !== 'string') {
              countryCode = 'IT'
            }
            
            // Debug: log del mapping bandiere
            console.log(`🏳️ Language ${index}:`, {
              langCode,
              countryCode,
              finalFlag: `https://flagcdn.com/w1280/${countryCode?.toLowerCase() || 'it'}.png`
            })
            
            // Crea una chiave unica combinando tutti i possibili identificatori
            const uniqueKey = `${langCode}-${index}`
            
            return (
              <button
                key={uniqueKey}
                onClick={() => handleLanguageSelect(langCode)}
                className={`relative w-full h-32 rounded-xl transition-all overflow-hidden ${
                  selectedLanguage === langCode
                    ? 'ring-4 ring-white/30'
                    : 'hover:scale-105'
                }`}
              >
                {/* Bandiera come sfondo della card */}
                <img 
                  src={`https://flagcdn.com/w1280/${countryCode?.toLowerCase() || 'it'}.png`}
                  srcSet={`https://flagcdn.com/w2560/${countryCode?.toLowerCase() || 'it'}.png 2x, https://flagcdn.com/w3840/${countryCode?.toLowerCase() || 'it'}.png 3x`}
                  alt={`${language.name || langCode} flag`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Overlay scuro per leggibilità del testo */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Nome della lingua sovrapposto */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-white text-2xl font-medium drop-shadow-lg">
                    {language.name || langCode}
                  </span>
                </div>
              </button>
            )
          })
        ) : (
          <div className="col-span-2 text-center text-white">
            <div className={`${typography.subtitle.classes} mb-4`}>Nessuna lingua disponibile</div>
            <div className={`${typography.body.classes} mb-6`}>Configura un museo per vedere le lingue disponibili</div>
            <button
              onClick={handleInvisibleButtonClick}
              className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Configura Museo
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Dialog per configurazione museo */}
      <MuseumDialog
        isOpen={showMuseumDialog}
        onClose={handleDialogClose}
        onMuseumIdSet={handleMuseumIdSet}
        currentMuseumId={museumId || undefined}
        currentTicketPrice={ticketPrice}
        currentCurrency={currency}
        currentMode={mode}
        onConfigUpdate={updateConfig}
      />
    </div>
  )
}
