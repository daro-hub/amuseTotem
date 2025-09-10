"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import NavigationBar from "@/components/NavigationBar"
import ItineraryCard from "@/components/ItineraryCard"
import { MessageCircle } from "lucide-react"

interface Itinerary {
  id: number
  visible: boolean
  code: string
  duration: number
  start_date: number
  end_date: number
  poster_image: string | null
  order: number | null
  title: string
  description: string
  audience: string | null
}

export default function Homepage() {
  const router = useRouter()
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [loading, setLoading] = useState(true)
  const [museumCode, setMuseumCode] = useState<string>("")

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch itineraries data
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        console.log('🔄 Starting itineraries fetch...')
        
        // Ottieni il codice del museo dal localStorage
        const museumCode = localStorage.getItem("museumCode")
        console.log('💾 Museum code from localStorage:', museumCode)
        
        if (!museumCode) {
          console.log('❌ No museum code found in localStorage')
          return
        }

        // Poi ottieni gli itinerari
        const selectedLanguage = localStorage.getItem("selectedLanguage") || "it"
        console.log('🌍 Selected language:', selectedLanguage)
        console.log('🔄 Calling itineraries API...')
        
        const itinerariesApiUrl = `https://xejn-1dw8-r0nq.f2.xano.io/api:IU7Sz6jQ/itinerary_totem?museum_id=682&lang=${selectedLanguage}`
        console.log('🔗 Itineraries API URL:', itinerariesApiUrl)
        console.log('📦 Itineraries API Method: GET')
        console.log('📦 Itineraries API Payload: museum_id=682&lang=' + selectedLanguage + ' (query parameters)')
        
        const response = await fetch(itinerariesApiUrl)
        console.log('📡 Itineraries API Response status:', response.status)
        
        const data = await response.json()
        console.log('📊 Itineraries API Response data:', data)
        console.log('📊 Itineraries API Response type:', typeof data)
        console.log('📊 Itineraries count:', Array.isArray(data) ? data.length : 'Not an array')
        
        // Debug di tutti gli itinerari ricevuti
        if (Array.isArray(data)) {
          console.log('🔍 All itineraries received:')
          data.forEach((itinerary, index) => {
            console.log(`  ${index + 1}. ID: ${itinerary.id}, Title: "${itinerary.title}", Visible: ${itinerary.visible}`)
          })
        }
        
        console.log('✅ All itineraries count:', data.length)
        console.log('✅ All itineraries:', data)
        
        setItineraries(data)
      } catch (error) {
        console.error('❌ Error fetching itineraries:', error)
      } finally {
        console.log('🏁 Itineraries API call completed')
        setLoading(false)
      }
    }

    fetchItineraries()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout

    const resetTimer = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        router.push("/")
      }, 45000)
    }

    const handleActivity = () => {
      resetTimer()
    }

    resetTimer() // Avvia il timer iniziale

    document.addEventListener("touchstart", handleActivity)
    document.addEventListener("click", handleActivity)

    return () => {
      if (timer) clearTimeout(timer)
      document.removeEventListener("touchstart", handleActivity)
      document.removeEventListener("click", handleActivity)
    }
  }, [router])

  // Organizza gli itinerari in righe di 2
  const organizeItineraries = () => {
    const rows = []
    for (let i = 0; i < itineraries.length; i += 2) {
      const row = itineraries.slice(i, i + 2)
      rows.push(row)
    }
    return rows
  }

  const itineraryRows = organizeItineraries()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-2xl">Caricamento itinerari...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      <NavigationBar />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 fade-in">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#ffbe0b] via-[#fb5607] to-[#ff8500] bg-clip-text text-transparent">
            Scegli il Tuo Itinerario
          </h1>

          <div className="bg-gradient-to-r from-[#8338ec] via-[#3a86ff] to-[#ff006e] p-1 rounded-2xl mb-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-[#ffbe0b] to-[#fb5607] p-3 rounded-full">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-2">Hai curiosità durante la visita?</h3>
                  <p className="text-xl text-gray-300">
                    Potrai chattare con me, Pinci, per scoprire tutti i segreti delle opere!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {itineraryRows.length > 0 ? (
            itineraryRows.map((row, rowIndex) => (
              <div key={rowIndex} className={`flex gap-8 ${row.length === 1 ? "justify-center" : "justify-center"}`}>
                {row.map((itinerary, index) => (
                  <div key={itinerary.id} className="flex-shrink-0">
                    <ItineraryCard
                      itinerary={{
                        id: itinerary.id,
                        name: itinerary.title,
                        description: itinerary.description,
                        image: itinerary.poster_image || "/placeholder.svg?height=300&width=400",
                        badge: itinerary.audience || "Tutti",
                        badgeColor: "#3a86ff",
                        duration: `${itinerary.duration} min`,
                        price: 0,
                      }}
                      index={rowIndex * 2 + index}
                      onClick={() => router.push(`/itinerary/${itinerary.code}`)}
                    />
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center text-white text-xl">
              Nessun itinerario disponibile
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
