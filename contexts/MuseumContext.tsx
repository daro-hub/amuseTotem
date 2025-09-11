'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

interface MuseumData {
  museum_id: string
  museum_name: string
  museum_description: string
  museum_languages: string[]
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
}

const MuseumContext = createContext<MuseumContextType | undefined>(undefined)

export function MuseumProvider({ children }: { children: ReactNode }) {
  const [museumData, setMuseumData] = useState<MuseumData | null>(null)
  const [currentMuseumId, setCurrentMuseumId] = useState('default-museum')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  // Carica dati del museo da localStorage all'avvio
  useEffect(() => {
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
  }, [])

  // Rimuovo questo useEffect per evitare chiamate API automatiche
  // che sovrascrivono i dati caricati da localStorage

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
    fetchMuseumData
  }

  return (
    <MuseumContext.Provider value={value}>
      {children}
    </MuseumContext.Provider>
  )
}

export function useMuseum() {
  const context = useContext(MuseumContext)
  if (context === undefined) {
    throw new Error('useMuseum must be used within a MuseumProvider')
  }
  return context
}
