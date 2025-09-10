"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import NavigationBar from "@/components/NavigationBar"
import { Mail, Minus, Plus, CreditCard, Shield } from "lucide-react"
import { generateMultipleTickets } from "@/lib/ticket-service"
import { useMuseum } from "@/contexts/MuseumContext"
import { useLanguage } from "@/contexts/LanguageContext"

// Interfacce TypeScript
interface Itinerary {
  id: number
  code: string
  title: string
  description: string
  duration: number
  poster_image: string | null
  price?: number
}

const itinerariesData = {
  "1": {
    name: "Rinascimento Fiorentino",
    price: 15,
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Immergiti nell'epoca d'oro dell'arte italiana, scoprendo i capolavori che hanno cambiato la storia dell'arte mondiale.",
  },
  "2": {
    name: "Avventura per Famiglie",
    price: 12,
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Un viaggio magico attraverso l'arte, pensato per coinvolgere e divertire tutta la famiglia con attività interattive.",
  },
  "3": {
    name: "Segreti dell'Arte",
    price: 20,
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Un'esperienza approfondita per esperti e appassionati, con analisi tecniche e retroscena storici delle opere più importanti.",
  },
}

export default function Purchase() {
  const params = useParams()
  const router = useRouter()
  const { museumData } = useMuseum()
  const { t } = useLanguage()
  const itineraryCode = params.id as string
  
  console.log('🔍 Purchase page debug:')
  console.log('📦 Params:', params)
  console.log('🆔 Itinerary code from params:', itineraryCode)
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [tickets, setTickets] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch itinerary data
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        console.log('🔄 Fetching itinerary data...')
        
        // Ottieni il codice del museo dal context
        const museumCode = museumData?.code
        console.log('💾 Museum code from context:', museumCode)
        
        if (!museumCode) {
          console.log('❌ No museum code found in context')
          setError('Codice museo non trovato')
          setLoading(false)
          return
        }

        // Ottieni la lingua selezionata
        const selectedLanguage = localStorage.getItem("selectedLanguage") || "it"
        console.log('🌍 Selected language:', selectedLanguage)

        const apiUrl = `https://xejn-1dw8-r0nq.f2.xano.io/api:IU7Sz6jQ/museum/${museumCode}/itineraries/${itineraryCode}?language=${selectedLanguage}`
        console.log('🔗 API URL:', apiUrl)
        console.log('📦 API Method: GET')
        console.log('📦 API Payload: language=' + selectedLanguage + ' (query parameter)')

        const response = await fetch(apiUrl)
        console.log('📡 API Response status:', response.status)

        const data = await response.json()
        console.log('📊 API Response data:', data)

        if (data) {
          console.log('✅ Setting itinerary data:', data)
          setItinerary({
            id: data.id,
            code: data.code,
            title: data.title,
            description: data.description,
            duration: data.duration,
            poster_image: data.poster_image,
            price: 15 // Prezzo fisso per ora
          })
        } else {
          console.log('❌ No itinerary data found')
          setError('Itinerario non trovato')
        }
      } catch (error) {
        console.error('❌ Error fetching itinerary:', error)
        setError('Errore nel caricamento dell\'itinerario')
      } finally {
        console.log('🏁 Itinerary fetch completed')
        setLoading(false)
      }
    }

    if (museumData?.code) {
      fetchItinerary()
    }
  }, [itineraryCode, museumData])

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-2xl">{t('loading')}</div>
      </div>
    )
  }

  if (error || !itinerary) {
    console.log('❌ Error or no itinerary:', error)
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white text-2xl">{error || t('itineraryNotFound')}</div>
      </div>
    )
  }

  const totalPrice = (itinerary.price || 15) * tickets

  const handlePurchase = async () => {
    if (!email || !email.includes("@")) {
      alert(t('enterValidEmail'))
      return
    }

    setIsProcessing(true)

    try {
      // Ottieni il codice del museo dal context
      const museumCode = museumData?.code
      
      if (!museumCode) {
        alert(t('museumCodeNotFound'))
        setIsProcessing(false)
        return
      }

      // Genera i ticket codes reali tramite API
      console.log('🔄 Generando ticket codes...')
      const generatedTickets = await generateMultipleTickets(tickets, museumCode)
      console.log('✅ Tickets generati:', generatedTickets)
      
      // Estrai solo gli URL dei QR codes
      const qrCodes = generatedTickets.map(ticket => ticket.qrCode || '')
      console.log('✅ QR Codes (URL di check-in) estratti:')
      qrCodes.forEach((url, index) => {
        console.log(`  Ticket ${index + 1}: ${url}`)
      })

      const purchaseData = {
        itinerary: itinerary.title,
        tickets,
        email,
        total: totalPrice,
        qrCodes: qrCodes,
        museumCode: museumCode
      }

      localStorage.setItem("purchaseData", JSON.stringify(purchaseData))
      router.push("/success")
    } catch (error) {
      console.error('❌ Errore nella generazione dei ticket:', error)
      alert(t('ticketGenerationError'))
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] p-8">
      <NavigationBar />

      <div className="max-w-4xl mx-auto">
        <div className="fade-in">
          <h1 className="text-5xl font-bold mb-8 text-center bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent">
            {t('completePurchase')}
          </h1>

          <div className="bg-gray-800 rounded-3xl p-8 mb-8">
            <div className="flex gap-6 items-start mb-6">
              <img
                src={itinerary.poster_image || "/placeholder.svg"}
                alt={itinerary.title}
                className="w-32 h-32 object-cover rounded-2xl flex-shrink-0"
              />
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-3">{itinerary.title}</h2>
                <p className="text-lg text-gray-300 leading-relaxed">{itinerary.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Mail className="w-6 h-6" />
                  {t('emailForReceipt')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="inserisci@tuaemail.com"
                  className="w-full p-6 text-2xl rounded-2xl bg-gray-700 text-white border-2 border-gray-600 focus:border-[#8ac926] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  {t('numberOfTickets')}
                </label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setTickets(Math.max(1, tickets - 1))} className="btn-3d-small rounded-full">
                    <div className="shadow"></div>
                    <div
                      className="edge"
                      style={{
                        background:
                          "linear-gradient(to left, hsl(16deg 100% 25%) 0%, hsl(16deg 100% 35%) 8%, hsl(16deg 100% 35%) 92%, hsl(16deg 100% 25%) 100%)",
                      }}
                    ></div>
                    <div className="front w-20 h-20 bg-[#fb5607] text-white text-3xl font-bold rounded-full flex items-center justify-center">
                      <Minus className="w-8 h-8" strokeWidth={4} />
                    </div>
                  </button>
                  <span className="text-4xl font-bold text-white w-20 text-center">{tickets}</span>
                  <button onClick={() => setTickets(Math.min(10, tickets + 1))} className="btn-3d-small rounded-full">
                    <div className="shadow"></div>
                    <div
                      className="edge"
                      style={{
                        background:
                          "linear-gradient(to left, hsl(88deg 61% 25%) 0%, hsl(88deg 61% 35%) 8%, hsl(88deg 61% 35%) 92%, hsl(88deg 61% 25%) 100%)",
                      }}
                    ></div>
                    <div className="front w-20 h-20 bg-[#8ac926] text-white text-3xl font-bold rounded-full flex items-center justify-center">
                      <Plus className="w-8 h-8" strokeWidth={4} />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-3xl p-8">
              <h3 className="text-3xl font-bold text-white mb-6">{t('summary')}</h3>
              <div className="space-y-4 text-xl">
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('ticketsLabel')}:</span>
                  <span className="text-white">{tickets}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">{t('unitPrice')}:</span>
                  <span className="text-white">€{itinerary.price || 15}</span>
                </div>
                <hr className="border-gray-600" />
                <div className="flex justify-between text-2xl font-bold">
                  <span className="text-[#8ac926]">{t('total')}:</span>
                  <span className="text-[#8ac926]">€{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handlePurchase}
              disabled={isProcessing || !email}
              className={`btn-3d rounded-full ${isProcessing || !email ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="shadow"></div>
              <div
                className="edge"
                style={{
                  background:
                    isProcessing || !email
                      ? "linear-gradient(to left, hsl(220deg 13% 25%) 0%, hsl(220deg 13% 35%) 8%, hsl(220deg 13% 35%) 92%, hsl(220deg 13% 25%) 100%)"
                      : "linear-gradient(to left, hsl(217deg 91% 35%) 0%, hsl(217deg 91% 45%) 8%, hsl(217deg 91% 45%) 92%, hsl(217deg 91% 35%) 100%)",
                }}
              ></div>
              <div
                className={`front text-3xl font-bold py-6 px-12 rounded-full flex items-center gap-4 ${
                  isProcessing || !email ? "bg-gray-600 text-gray-400" : "bg-[#3a86ff] text-white"
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    {t('processing')}
                  </>
                ) : (
                  <>
                    <CreditCard className="w-8 h-8" />
                    {t('proceedWithPurchase')}
                  </>
                )}
              </div>
            </button>

            <p className="text-lg text-gray-400 mt-4 flex items-center justify-center gap-2">
              <Shield className="w-5 h-5" />
              {t('securePayment')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
