'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect, Suspense } from 'react'
import { useUrlParams } from '@/hooks/use-url-params'

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
  itineraries: Itinerary[]
}

interface Itinerary {
  id: string
  name: string
  description: string
  duration: number
  price: number
  difficulty: string
  highlights: string[]
  pois: POI[]
}

interface POI {
  id: string
  name: string
  description: string
  type: string
  duration: number
  coordinates?: {
    lat: number
    lng: number
  }
}

interface MuseumContextType {
  museumData: MuseumData | null
  setMuseumData: (data: MuseumData) => void
  currentMuseumId: string
  setCurrentMuseumId: (id: string) => void
  museumId: string
  setMuseumId: (id: string, data?: MuseumData) => void
  isLoading: boolean
  error: string | null
  fetchMuseumData: (museumId: string) => Promise<void>
  ticketPrice: number
  currency: string
  mode: 'test' | 'museo' | 'chiesa'
  updateConfig: (ticketPrice: number, currency: string, mode: 'test' | 'museo' | 'chiesa') => void
}

const MuseumContext = createContext<MuseumContextType | undefined>(undefined)

function MuseumProviderContent({ children }: { children: ReactNode }) {
  const [museumData, setMuseumData] = useState<MuseumData | null>(null)
  const [currentMuseumId, setCurrentMuseumId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Ottieni parametri URL
  const urlParams = useUrlParams()
  
  // Stati per i parametri configurabili
  const [ticketPrice, setTicketPrice] = useState(5)
  const [currency, setCurrency] = useState('EUR')
  const [mode, setMode] = useState<'test' | 'museo' | 'chiesa'>('test')
  
  // Inizializza i valori dai parametri URL o localStorage
  useEffect(() => {
    const initialTicketPrice = urlParams.ticketPrice || 
      (typeof window !== 'undefined' && localStorage.getItem('urlTicketPrice') ? parseFloat(localStorage.getItem('urlTicketPrice')!) : 5)
    const initialCurrency = urlParams.currency || 
      (typeof window !== 'undefined' ? localStorage.getItem('urlCurrency') : null) || 'EUR'
    // Modalità: priorità URL, poi localStorage, poi default 'test'
    let initialMode: 'test' | 'museo' | 'chiesa' = 'test'
    
    if (urlParams.mode) {
      initialMode = urlParams.mode
    } else if (typeof window !== 'undefined' && localStorage.getItem('urlMode')) {
      const savedMode = localStorage.getItem('urlMode') as 'test' | 'museo' | 'chiesa'
      // Solo se è esplicitamente 'museo', altrimenti usa 'test'
      initialMode = savedMode === 'museo' ? 'museo' : 'test'
    }
    
    console.log('🔄 MuseumContext initializing values:', {
      urlParams: { ticketPrice: urlParams.ticketPrice, currency: urlParams.currency, mode: urlParams.mode },
      localStorage: {
        ticketPrice: typeof window !== 'undefined' ? localStorage.getItem('urlTicketPrice') : 'N/A',
        currency: typeof window !== 'undefined' ? localStorage.getItem('urlCurrency') : 'N/A',
        mode: typeof window !== 'undefined' ? localStorage.getItem('urlMode') : 'N/A'
      },
      final: { ticketPrice: initialTicketPrice, currency: initialCurrency, mode: initialMode }
    })
    
    setTicketPrice(initialTicketPrice)
    setCurrency(initialCurrency)
    setMode(initialMode)
  }, [urlParams.ticketPrice, urlParams.currency, urlParams.mode])

  const fetchMuseumData = async (museumId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Chiama l'API reale del museo
      const apiUrl = `https://xejn-1dw8-r0nq.f2.xano.io/api:B_gGZXzt/museum_totem?museum_id=${museumId}`
      console.log('🔄 Fetching museum data from API:', apiUrl)
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const apiData = await response.json()
      console.log('📊 API Response:', apiData)
      
      if (apiData && apiData.length > 0) {
        const museumData = apiData[0]
        const processedData: MuseumData = {
          museum_id: museumData.museum_id || museumId,
          museum_name: museumData.name || 'Museo',
          museum_description: museumData.description || 'Museo interattivo',
          museum_languages: museumData.museum_languages || [],
          itineraries: [] // Gli itinerari verranno caricati separatamente se necessario
        }
        
        console.log('✅ Processed museum data:', processedData)
        setMuseumData(processedData)
        
        // Salva i dati in localStorage per il prossimo caricamento
        localStorage.setItem('museumId', museumId)
        localStorage.setItem('museumData', JSON.stringify(processedData))
      } else {
        throw new Error('Nessun dato museo trovato')
      }
    } catch (err) {
      setError('Errore nel caricamento dei dati del museo')
      console.error('Error fetching museum data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Carica dati del museo da URL o localStorage
  useEffect(() => {
    // Priorità 1: Parametri URL
    if (urlParams.museumId) {
      console.log('🔗 Museum ID from URL:', urlParams.museumId)
      setCurrentMuseumId(urlParams.museumId)
      
      // Salva i parametri URL nel localStorage per mantenerli durante la navigazione
      if (typeof window !== 'undefined') {
        localStorage.setItem('urlMuseumId', urlParams.museumId)
        if (urlParams.ticketPrice) {
          localStorage.setItem('urlTicketPrice', urlParams.ticketPrice.toString())
        }
        if (urlParams.currency) {
          localStorage.setItem('urlCurrency', urlParams.currency)
        }
        if (urlParams.mode) {
          localStorage.setItem('urlMode', urlParams.mode)
        }
      }
      
      // Carica i dati del museo dall'API
      fetchMuseumData(urlParams.museumId)
      return
    }

    // Priorità 2: localStorage (fallback)
    if (typeof window !== 'undefined') {
      const savedMuseumId = localStorage.getItem('museumId')
      const savedMuseumData = localStorage.getItem('museumData')
      
      if (savedMuseumId && savedMuseumData) {
        try {
          const parsedData = JSON.parse(savedMuseumData)
          setCurrentMuseumId(savedMuseumId)
          setMuseumData(parsedData)
          console.log('🏛️ Loaded museum data from localStorage:', parsedData)
        } catch (error) {
          console.error('❌ Error parsing saved museum data:', error)
          localStorage.removeItem('museumId')
          localStorage.removeItem('museumData')
        }
      }
    }
  }, [urlParams.museumId])

  // Usa i parametri salvati se non ci sono parametri URL
  useEffect(() => {
    if (!urlParams.museumId && typeof window !== 'undefined') {
      const savedUrlMuseumId = localStorage.getItem('urlMuseumId')
      const savedUrlTicketPrice = localStorage.getItem('urlTicketPrice')
      const savedUrlCurrency = localStorage.getItem('urlCurrency')
      const savedUrlMode = localStorage.getItem('urlMode')
      
      if (savedUrlMuseumId) {
        // Solo se la modalità salvata è 'museo', altrimenti usa 'test'
        const modeToUse = savedUrlMode === 'museo' ? 'museo' : 'test'
        
        console.log('🔄 Restoring URL parameters from localStorage:', {
          museumId: savedUrlMuseumId,
          ticketPrice: savedUrlTicketPrice,
          currency: savedUrlCurrency,
          mode: savedUrlMode,
          modeToUse: modeToUse
        })
        setCurrentMuseumId(savedUrlMuseumId)
        setMode(modeToUse)
        fetchMuseumData(savedUrlMuseumId)
      }
    }
  }, [urlParams.museumId])

  // Forza il ripristino dei parametri URL quando la pagina viene caricata
  useEffect(() => {
    if (typeof window === 'undefined') return

    const restoreUrlParams = () => {
      const savedUrlMuseumId = localStorage.getItem('urlMuseumId')
      const savedUrlTicketPrice = localStorage.getItem('urlTicketPrice')
      const savedUrlCurrency = localStorage.getItem('urlCurrency')
      const savedUrlMode = localStorage.getItem('urlMode')
      
      if (savedUrlMuseumId && !urlParams.museumId) {
        // Solo se la modalità salvata è 'museo', altrimenti usa 'test'
        const modeToUse = savedUrlMode === 'museo' ? 'museo' : 'test'
        
        console.log('🔄 Force restoring URL parameters on page load', {
          museumId: savedUrlMuseumId,
          mode: savedUrlMode,
          modeToUse: modeToUse
        })
        setCurrentMuseumId(savedUrlMuseumId)
        setMode(modeToUse)
        fetchMuseumData(savedUrlMuseumId)
      }
    }

    // Ripristina i parametri quando la pagina diventa visibile
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        restoreUrlParams()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    restoreUrlParams()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Rimuovo questo useEffect per evitare chiamate API automatiche
  // che sovrascrivono i dati caricati da localStorage

  const updateConfig = (newTicketPrice: number, newCurrency: string, newMode: 'test' | 'museo' | 'chiesa') => {
    setTicketPrice(newTicketPrice)
    setCurrency(newCurrency)
    setMode(newMode)
    
    // Salva nel localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('urlTicketPrice', newTicketPrice.toString())
      localStorage.setItem('urlCurrency', newCurrency)
      localStorage.setItem('urlMode', newMode)
      console.log('💾 Saved config to localStorage:', { ticketPrice: newTicketPrice, currency: newCurrency, mode: newMode })
    }
  }

  const value = {
    museumData,
    setMuseumData,
    currentMuseumId,
    setCurrentMuseumId,
    museumId: currentMuseumId, // Alias per compatibilità
    setMuseumId: (id: string, data?: MuseumData) => {
      setCurrentMuseumId(id)
      if (data) {
        setMuseumData(data)
      }
    },
    isLoading,
    error,
    fetchMuseumData,
    ticketPrice,
    currency,
    mode,
    updateConfig
  }

  return (
    <MuseumContext.Provider value={value}>
      {children}
    </MuseumContext.Provider>
  )
}

export function MuseumProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <MuseumProviderContent>
        {children}
      </MuseumProviderContent>
    </Suspense>
  )
}

export function useMuseum() {
  const context = useContext(MuseumContext)
  if (context === undefined) {
    throw new Error('useMuseum must be used within a MuseumProvider')
  }
  return context
}
