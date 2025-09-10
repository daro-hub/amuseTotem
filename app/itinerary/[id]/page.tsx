"use client"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import NavigationBar from "@/components/NavigationBar"
import POICard from "@/components/POICard"
import { Clock, Euro, Ticket, PawPrint } from "lucide-react"

interface PointOfInterest {
  id: number
  order: number
  gallery: any[]
  poster_image: string | null
  is_demo: boolean
  assets_order: any
  duration_code: string
  name: string
  short_description: string
  audioguide_url: string | null
  video_url: string | null
  audio_duration_seconds: number
  long_description: string
  geo_position: {
    type: string
    data: {
      lng: number
      lat: number
    }
  }
}

interface ItineraryDetail {
  id: number
  created_at: number
  museum_id: number
  visible: boolean
  code: string
  gallery: any[]
  duration: number
  start_date: number | null
  end_date: number | null
  poster_image: string | null
  in_evidence: boolean
  order: number | null
  survey_link: string | null
  offline: boolean
  is_outdoor: boolean
  description: string
  title: string
  fl_adv_wall: boolean
  languages: Array<{
    language_code: string
    language_name: string
  }>
  point_of_interests: PointOfInterest[]
  museum_name: string
  fl_chatbot_enabled: boolean
}

const colors = ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff", "#8ac926"]

export default function ItineraryDetail() {
  const params = useParams()
  const router = useRouter()
  const itineraryCode = params.id as string

  const [itinerary, setItinerary] = useState<ItineraryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [museumCode, setMuseumCode] = useState<string>("")
  const [visiblePOIs, setVisiblePOIs] = useState<boolean[]>([])
  const [visiblePawPrints, setVisiblePawPrints] = useState<boolean[]>([])
  const [expandedPOIId, setExpandedPOIId] = useState<number | null>(null)

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Fetch itinerary data
  useEffect(() => {
    const fetchItineraryData = async () => {
      try {
        console.log('🔄 Starting itinerary detail fetch...')
        console.log('🆔 Itinerary code:', itineraryCode)
        
        // Ottieni il codice del museo dal localStorage
        const museumCodeValue = localStorage.getItem("museumCode")
        console.log('💾 Museum code from localStorage:', museumCodeValue)
        
        if (!museumCodeValue) {
          console.log('❌ No museum code found in localStorage')
          return
        }
        
        setMuseumCode(museumCodeValue)

          // Poi ottieni i dettagli dell'itinerario
          const selectedLanguage = localStorage.getItem("selectedLanguage") || "it"
          console.log('🌍 Selected language:', selectedLanguage)
          console.log('🔄 Calling itinerary detail API...')
          
          const itineraryDetailApiUrl = `https://xejn-1dw8-r0nq.f2.xano.io/api:IU7Sz6jQ/museum/${museumCodeValue}/itineraries/${itineraryCode}?language=${selectedLanguage}&museum_code=${museumCodeValue}&itinerary_code=${itineraryCode}`
          console.log('🔗 Itinerary Detail API URL:', itineraryDetailApiUrl)
          console.log('📦 Itinerary Detail API Method: GET')
          console.log('📦 Itinerary Detail API Payload: language=' + selectedLanguage + '&museum_code=' + museumCodeValue + '&itinerary_code=' + itineraryCode + ' (query parameters)')
          
          const response = await fetch(itineraryDetailApiUrl)
          console.log('📡 Itinerary Detail API Response status:', response.status)
          
          const data = await response.json()
          console.log('📊 Itinerary Detail API Response data:', data)
          console.log('📊 Itinerary Detail API Response type:', typeof data)
          
          if (data && data.point_of_interests) {
            console.log('✅ POIs found:', data.point_of_interests.length)
            
            // Filtra i POI per rimuovere i duplicati basandosi su id
            const uniquePOIs = data.point_of_interests.filter((poi: PointOfInterest, index: number, self: PointOfInterest[]) => 
              index === self.findIndex((p: PointOfInterest) => p.id === poi.id)
            )
            
            console.log('✅ Unique POIs count:', uniquePOIs.length)
            console.log('✅ Unique POIs:', uniquePOIs)
            
            // Sostituisci i POI con quelli unici
            data.point_of_interests = uniquePOIs
            
            // Debug dettagliato dei POI
            console.log('🔍 POIs with images:')
            uniquePOIs.forEach((poi: PointOfInterest, index: number) => {
              console.log(`  ${index + 1}. ID: ${poi.id}, Name: "${poi.name}", Image: ${poi.poster_image ? '✅' : '❌'} ${poi.poster_image || 'null'}`)
            })
          } else {
            console.log('❌ No POIs found in response')
          }
          
          setItinerary(data)
      } catch (error) {
        console.error('❌ Error fetching itinerary data:', error)
      } finally {
        console.log('🏁 Itinerary detail API call completed')
        setLoading(false)
      }
    }

    if (itineraryCode) {
      fetchItineraryData()
    }
  }, [itineraryCode])

  useEffect(() => {
    if (itinerary) {
      // Inizializza tutti i POI come non visibili
      setVisiblePOIs(new Array(itinerary.point_of_interests.length).fill(false))
      // Calcola il numero totale di impronte e inizializzale come non visibili
      const totalPawPrints = (itinerary.point_of_interests.length - 1) * 8 // 8 impronte per segmento
      setVisiblePawPrints(new Array(totalPawPrints).fill(false))
      
      // Forza il primo controllo dopo un breve delay per garantire il caricamento
      setTimeout(() => {
        const handleInitialCheck = () => {
          const scrollY = window.scrollY
          const windowHeight = window.innerHeight
          
          itinerary.point_of_interests.forEach((_, index) => {
            const poiPosition = 600 + index * 180
            if (scrollY + windowHeight > poiPosition - 200) {
              setVisiblePOIs(prev => {
                const updated = [...prev]
                updated[index] = true
                return updated
              })
              
              // Rendi visibili le zampe per i POI già visibili
              if (index > 0) {
                const startPawIndex = (index - 1) * 8
                const endPawIndex = index * 8
                setVisiblePawPrints(prev => {
                  const updated = [...prev]
                  for (let pawIndex = startPawIndex; pawIndex < endPawIndex; pawIndex++) {
                    if (pawIndex < updated.length) {
                      updated[pawIndex] = true
                    }
                  }
                  return updated
                })
              }
            }
          })
        }
        
        handleInitialCheck()
      }, 100)
    }
  }, [itinerary])

  useEffect(() => {
    if (!itinerary) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // Calcola quali POI dovrebbero essere visibili in base allo scroll
      const newVisiblePOIs = [...visiblePOIs]
      let hasChanges = false

      itinerary.point_of_interests.forEach((_, index) => {
        // Calcola la posizione approssimativa del POI
        const poiPosition = 600 + index * 180 // Posizione base + offset per ogni POI

        // Se il POI è nella viewport o poco sopra, rendilo visibile
        if (scrollY + windowHeight > poiPosition - 200 && !newVisiblePOIs[index]) {
          newVisiblePOIs[index] = true
          hasChanges = true

          // Rendi visibili anche le impronte che portano a questo POI
          if (index > 0) {
            const startPawIndex = (index - 1) * 8
            const endPawIndex = index * 8
            
            // Rendi visibili tutte le impronte del segmento immediatamente
            setVisiblePawPrints((prev) => {
              const updated = [...prev]
              for (let pawIndex = startPawIndex; pawIndex < endPawIndex; pawIndex++) {
                if (pawIndex < updated.length) {
                  updated[pawIndex] = true
                }
              }
              return updated
            })
          }
        }
      })

      if (hasChanges) {
        setVisiblePOIs(newVisiblePOIs)
      }
    }

    // Aggiungi listener per lo scroll
    window.addEventListener("scroll", handleScroll)

    // Controlla immediatamente per i POI già visibili
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [itinerary, visiblePOIs])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-2xl">Caricamento itinerario...</div>
      </div>
    )
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-2xl">Itinerario non trovato</div>
      </div>
    )
  }

  // Calcola le posizioni per il percorso a zigzag
  const getZigzagPositions = (poisCount: number) => {
    const positions = []
    const containerWidth = 700
    const cardWidth = 240 // w-60
    const marginFromEdge = 5 // Distanza dal bordo del container
    
    // Calcola le posizioni per avere la stessa distanza dal bordo
    const leftX = marginFromEdge + (cardWidth / 2) // 5 + 120 = 125
    const rightX = containerWidth - marginFromEdge - (cardWidth / 2) // 700 - 5 - 120 = 575
    const stepHeight = 180

    for (let i = 0; i < poisCount; i++) {
      const isLeft = i % 2 === 0
      const x = isLeft ? leftX : rightX
      const y = 80 + i * stepHeight
      positions.push({ x, y, isLeft })
    }
    return positions
  }

  const positions = getZigzagPositions(itinerary.point_of_interests.length)

  // Genera le impronte lungo il percorso con colori dei POI dentro cerchi 3D
  const generateColoredPawPrints = () => {
    const pawPrints = []
    const stepsPerSegment = 8

    for (let i = 0; i < positions.length - 1; i++) {
      const start = positions[i]
      const end = positions[i + 1]
      const color = colors[i % colors.length] // Colore del POI di partenza

      for (let step = 0; step < stepsPerSegment; step++) {
        const progress = step / (stepsPerSegment - 1)
        const x = start.x + (end.x - start.x) * progress
        const y = start.y + (end.y - start.y) * progress

        // Calcola l'angolo di rotazione verso la direzione del percorso
        const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI)

        // Alterna le impronte leggermente a sinistra e destra
        const offset = step % 2 === 0 ? -8 : 8
        const perpAngle = (angle + 90) * (Math.PI / 180)

        pawPrints.push({
          x: x + Math.cos(perpAngle) * offset,
          y: y + Math.sin(perpAngle) * offset,
          rotation: angle,
          color: color, // Aggiungi il colore
          globalIndex: i * stepsPerSegment + step, // Indice globale per la visibilità
        })
      }
    }

    return pawPrints
  }

  const pawPrints = generateColoredPawPrints()
  const containerHeight = positions.length * 180 + 60
  const containerWidth = 700

  return (
    <div className="min-h-screen bg-[#121212] p-6">
      <NavigationBar />

      <div className="max-w-5xl mx-auto">
        <div className="fade-in">
          {/* Card senza effetto 3D */}
          <div className="bg-gray-800 rounded-3xl p-6 mb-8">
            <div className="flex gap-6">
              {/* Immagine */}
              <div className="flex-shrink-0">
                <img
                  src={itinerary.poster_image || "/placeholder.svg"}
                  alt={itinerary.title}
                  className="w-48 h-48 object-cover rounded-2xl"
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-4">{itinerary.title}</h1>
                  <p className="text-xl text-gray-300 mb-6">{itinerary.description}</p>
                </div>

                <div className="flex gap-4">
                  <div className="bg-gray-700 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#8ac926]" />
                    <span className="text-white text-lg font-semibold">{itinerary.duration} min</span>
                  </div>
                  <div className="bg-gray-700 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Euro className="w-5 h-5 text-[#ffbe0b]" />
                    <span className="text-white text-lg font-semibold">€0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

                      {/* Tasto acquisto centrato */}
            <div className="text-center mb-10">
              <button onClick={() => router.push(`/purchase/${itineraryCode}`)} className="btn-3d rounded-full pulse-glow">
                <div className="shadow"></div>
                <div
                  className="edge"
                  style={{
                    background:
                      "linear-gradient(to left, hsl(45deg 100% 35%) 0%, hsl(45deg 100% 45%) 8%, hsl(45deg 100% 45%) 92%, hsl(45deg 100% 35%) 100%)",
                  }}
                ></div>
                <div className="front bg-[#ffbe0b] text-black text-2xl font-bold py-5 px-10 rounded-full flex items-center gap-3">
                  <Ticket className="w-7 h-7" />
                  Acquista il Biglietto
                </div>
              </button>
            </div>

          {/* Percorso a zigzag */}
          <div className="pb-2">
            <h2 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent flex items-center justify-center gap-4">
              <svg className="w-12 h-12 text-[#3b82f6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Il Tuo Percorso
            </h2>

            <div className="relative flex justify-center">
              <div 
                className="relative" 
                style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
                onClick={(e) => {
                  // Se clicchi sul container (non su una card), chiudi la card espansa
                  if (e.target === e.currentTarget) {
                    setExpandedPOIId(null)
                  }
                }}
              >
                {/* Impronte colorate */}
                {pawPrints.map((pawPrint, index) => (
                  <div
                    key={index}
                    className={`absolute transition-all duration-300 ease-out ${
                      visiblePawPrints[pawPrint.globalIndex] ? "paw-print-visible" : "paw-print-hidden"
                    }`}
                    style={{
                      left: `${pawPrint.x - 12}px`,
                      top: `${pawPrint.y - 12}px`,
                      transform: `rotate(${pawPrint.rotation}deg)`,
                    }}
                  >
                    <PawPrint className="w-6 h-6" strokeWidth={4} style={{ color: pawPrint.color }} />
                  </div>
                ))}

                {/* Punti di connessione */}
                {positions.map((pos, index) => (
                  <div
                    key={index}
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg"
                    style={{
                      left: `${pos.x - 8}px`,
                      top: `${pos.y - 8}px`,
                      backgroundColor: colors[index % colors.length],
                    }}
                  />
                ))}

                {/* Card POI */}
                {itinerary.point_of_interests.map((poi, index) => {
                  const pos = positions[index]
                  const color = colors[index % colors.length]
                  const expandDirection = "vertical" // Espansione solo verticale
                  const isVisible = visiblePOIs[index]
                  const isExpanded = expandedPOIId === poi.id

                  const handleToggleExpand = () => {
                    if (isExpanded) {
                      // Se è già espanso, chiudilo
                      setExpandedPOIId(null)
                    } else {
                      // Altrimenti, chiudi gli altri e espandi questo
                      setExpandedPOIId(poi.id)
                    }
                  }

                  return (
                    <div
                      key={poi.id}
                      className={`absolute transition-all duration-700 ease-out ${
                        isVisible ? "drop-in-visible" : "drop-in-hidden"
                      }`}
                      style={{
                        left: `${pos.x - 120}px`, // Centrato per larghezza w-60 (240px / 2 = 120px)
                        top: `${pos.y - 80}px`,
                        transitionDelay: `${index * 0.1}s`,
                        zIndex: isExpanded ? 100 : 10,
                      }}
                      onClick={(e) => {
                        // Previeni la propagazione del click al container
                        e.stopPropagation()
                      }}
                    >
                      <POICard 
                        poi={{
                          id: poi.id,
                          name: poi.name,
                          image: poi.poster_image || "/placeholder.svg?height=200&width=200",
                          description: poi.long_description || poi.short_description,
                        }} 
                        index={index} 
                        color={color} 
                        expandDirection={expandDirection}
                        isExpanded={isExpanded}
                        onToggleExpand={handleToggleExpand}
                      />
                      {/* Debug per le immagini */}
                      {(() => { console.log(`🖼️ POI ${poi.id} image:`, poi.poster_image); return null; })()}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pulsante Acquista Biglietto in fondo */}
            <div className="text-center mt-2">
              <button onClick={() => router.push(`/purchase/${itineraryCode}`)} className="btn-3d rounded-full pulse-glow">
                <div className="shadow"></div>
                <div
                  className="edge"
                  style={{
                    background:
                      "linear-gradient(to left, hsl(45deg 100% 35%) 0%, hsl(45deg 100% 45%) 8%, hsl(45deg 100% 45%) 92%, hsl(45deg 100% 35%) 100%)",
                  }}
                ></div>
                <div className="front bg-[#ffbe0b] text-black text-2xl font-bold py-5 px-10 rounded-full flex items-center gap-3">
                  <Ticket className="w-7 h-7" />
                  Acquista il Biglietto
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
