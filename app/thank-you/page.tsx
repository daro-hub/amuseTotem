'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AmuseLogo from '@/components/AmuseLogo'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'
import { tabletSizes } from '@/lib/colors'
import QRCode from 'react-qr-code'
import { generateMultipleTickets } from '@/lib/ticket-service'

export default function ThankYou () {
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState(20)
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [qrCodes, setQrCodes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [museumCode, setMuseumCode] = useState<string>('')
  const router = useRouter()
  const { currentLanguage } = useLanguage()

  // Genera i biglietti direttamente nella thank you page
  useEffect(() => {
    const generateTicketsDirectly = async () => {
      try {
        console.log('🎫 Generazione biglietti direttamente nella thank you page...')
        
        // Carica il codice del museo dal localStorage
        const museumData = localStorage.getItem('museumData')
        if (!museumData) {
          console.log('❌ Nessun dato museo trovato nel localStorage')
          setQrCodes([])
          setQuantity(0)
          setIsLoading(false)
          return
        }
        
        const museum = JSON.parse(museumData)
        const museumCode = museum.code
        console.log('🏛️ Codice museo dal localStorage:', museumCode)
        
        // Carica il numero di biglietti dal localStorage
        const ticketQuantity = localStorage.getItem('ticketQuantity')
        const ticketCount = ticketQuantity ? parseInt(ticketQuantity) : 2
        console.log('🎫 Numero biglietti dal localStorage:', ticketCount)
        
        console.log('🎫 Generando', ticketCount, 'biglietti per museo', museumCode)
        
        // Genera i QR codes per ogni biglietto
        const qrCodeUrls = []
        for (let i = 0; i < ticketCount; i++) {
          console.log(`🎫 Generando biglietto ${i + 1}/${ticketCount}`)
          
          try {
            // Chiama l'API per generare il ticket code
            const apiUrl = 'https://xejn-1dw8-r0nq.f2.xano.io/api:B_gGZXzt/totem/tickets'
            const payload = { museum_code: museumCode }
            
            console.log('🔗 Chiamata API:', apiUrl, payload)
            
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload)
            })
            
            if (!response.ok) {
              throw new Error(`API Error: ${response.status}`)
            }
            
            const data = await response.json()
            console.log('📊 Risposta API:', data)
            
            const ticketCode = data.ticket_code
            console.log('🎫 Ticket code generato:', ticketCode)
            
            // Crea l'URL del QR code
            const qrUrl = `https://web.amuseapp.art/check-in?code=${ticketCode}&museumId=${museumCode}`
            console.log('🔗 QR URL generato:', qrUrl)
            
            qrCodeUrls.push(qrUrl)
            
          } catch (error) {
            console.error(`❌ Errore generazione biglietto ${i + 1}:`, error)
            // Continua con gli altri biglietti anche se uno fallisce
          }
        }
        
        console.log('✅ Tutti i QR codes generati:', qrCodeUrls)
        
        // Aggiorna lo stato
        setQrCodes(qrCodeUrls)
        setQuantity(qrCodeUrls.length)
        setMuseumCode(museumCode)
        
      } catch (error) {
        console.error('❌ Errore nella generazione biglietti:', error)
        setQrCodes([])
        setQuantity(0)
      } finally {
        setIsLoading(false)
      }
    }

    generateTicketsDirectly()
  }, [])


  // Timer countdown separato per evitare problemi di rendering
  // Timer countdown - parte solo quando l'utente visualizza l'ultimo QR code
  useEffect(() => {
    if (!timerStarted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timerStarted])

  // Avvia il timer quando l'utente visualizza l'ultimo QR code
  useEffect(() => {
    if (qrCodes.length > 0 && currentTicketIndex === qrCodes.length - 1) {
      setTimerStarted(true)
    } else {
      setTimerStarted(false)
    }
  }, [currentTicketIndex, qrCodes.length])

  // Funzione per resettare il timer
  const resetTimer = () => {
    setTimeLeft(20)
    // Non resettare timerStarted qui, sarà gestito dal useEffect
  }

  // Event listener per il touch dello schermo
  useEffect(() => {
    const handleTouch = () => {
      resetTimer()
    }

    // Aggiungi event listener per touch
    document.addEventListener('touchstart', handleTouch)
    document.addEventListener('click', handleTouch)
    document.addEventListener('touchmove', handleTouch)
    document.addEventListener('scroll', handleTouch)
    document.addEventListener('mousemove', handleTouch)

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouch)
      document.removeEventListener('click', handleTouch)
      document.removeEventListener('touchmove', handleTouch)
      document.removeEventListener('scroll', handleTouch)
      document.removeEventListener('mousemove', handleTouch)
    }
  }, [])

  // Redirect separato quando il timer arriva a 0
  useEffect(() => {
    if (timeLeft === 0) {
      router.push('/')
    }
  }, [timeLeft, router])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Qui potresti inviare l'email
      console.log('Email inviata:', email)
      alert('Ricevuta inviata via email!')
    }
  }

  const handleNextTicket = () => {
    setCurrentTicketIndex(prev => (prev + 1) % qrCodes.length)
  }

  const handlePreviousTicket = () => {
    setCurrentTicketIndex(prev => (prev - 1 + qrCodes.length) % qrCodes.length)
  }


  // Genera un QR code reale usando i dati dell'API
  const generateQRCode = (url: string) => {
    return (
      <div className="w-80 h-80 bg-white p-6 rounded-lg">
        <QRCode
          value={url}
          size={272}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen thank-you-page bg-black flex flex-col items-center justify-between p-6 max-w-2xl mx-auto">
      <style jsx>{`
        .qr-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Header con logo, titolo e sottotitolo - Allineato in alto */}
      <div className="flex flex-col items-center pt-2 pb-2 flex-shrink-0">
        <AmuseLogo size={tabletSizes.logo.size} />
        <div className="text-center mt-1">
          <h2 className="text-white text-4xl font-bold text-center">
            {t('thankYou.title', currentLanguage)}
          </h2>
          <p className="text-white text-2xl font-light text-center mt-2">
            {t('thankYou.subtitle', currentLanguage)}
          </p>
        </div>
      </div>

      {/* Contenuto centrale */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-4xl flex-1 justify-center">


        {/* Mostra i biglietti generati */}
        {!isLoading && qrCodes.length > 0 ? (
          <div className="w-full flex flex-col items-center space-y-2">
            {/* Container carosello */}
            <div className="relative w-full h-[28rem] flex items-center justify-center">
              {/* Pulsante sinistro */}
              <button
                onClick={handlePreviousTicket}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-teal-800 hover:bg-teal-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Pulsante destro */}
              <button
                onClick={handleNextTicket}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-teal-800 hover:bg-teal-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {qrCodes.map((qrCode, index) => {
                const distance = Math.abs(index - currentTicketIndex)
                const isActive = index === currentTicketIndex
                const isVisible = distance <= 2 // Mostra solo i QR codes vicini
                
                if (!isVisible) return null
                
                const scale = isActive ? 1 : 0.7 - (distance * 0.15)
                const opacity = isActive ? 1 : 0.6 - (distance * 0.2)
                const translateX = (index - currentTicketIndex) * 120
                const zIndex = isActive ? 10 : 10 - distance
                
                return (
                  <div
                    key={index}
                    className="absolute transition-all duration-500 ease-out"
                    style={{
                      transform: `translateX(${translateX}px) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex
                    }}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      {generateQRCode(qrCode)}
                      <span className="text-white text-4xl font-medium bg-teal-800 px-3 py-1 rounded-full">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            
          </div>
        ) : isLoading ? (
          <div className="text-white text-center">
            <p className={tabletSizes.text.body}>{t('loading', currentLanguage)}</p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center space-y-6">
            <div className="text-center space-y-4">
              <div className="text-8xl">🎫</div>
              <h3 className="text-white text-4xl font-bold">
                Biglietti Non Trovati
              </h3>
              <p className="text-gray-300 text-xl max-w-md">
                Non sono stati trovati biglietti generati. Torna alla home per effettuare un nuovo acquisto.
              </p>
            </div>
            
            <Button
              onClick={() => router.push('/')}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xl font-medium max-w-md"
            >
              Torna alla Home
            </Button>
          </div>
        )}

        {/* Email Section */}
        <div className="w-full max-w-2xl space-y-3">
          <p className={`text-white ${tabletSizes.text.body} font-light text-center`}>
            {t('thankYou.email', currentLanguage)}
          </p>
          
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('thankYou.email', currentLanguage)}
              className={`w-full ${tabletSizes.button.padding} bg-transparent border border-white rounded-lg text-white placeholder-white/70 focus:outline-none focus:border-white/50 ${tabletSizes.text.body}`}
            />
            {email && (
              <Button
                type="submit"
                className={`w-full bg-teal-800 hover:bg-teal-700 text-white border-0 rounded-lg ${tabletSizes.button.padding} font-light ${tabletSizes.button.text}`}
              >
                {t('thankYou.send', currentLanguage)}
              </Button>
            )}
          </form>
        </div>
      </div>

      {/* Spazio tra email e timer */}
      <div className="h-8"></div>

      {/* Timer e progress bar migliorati */}
      <div className="w-full max-w-2xl space-y-4">
        {/* Timer visuale migliorato */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          {/* Pulsante New Purchase - sopra al centro */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => router.push('/')}
              className={`bg-teal-800 hover:bg-teal-700 text-white rounded-lg ${tabletSizes.button.padding} font-medium transition-colors duration-200 ${tabletSizes.button.text}`}
            >
              {t('thankYou.newPurchase', currentLanguage)}
            </button>
          </div>
          
          {/* Progress bar migliorata */}
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden mb-4">
            <div
              className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((20 - timeLeft) / 20) * 100}%` }}
            />
          </div>
          
          {/* Timer - sotto centrato */}
          <div className="flex items-center justify-center space-x-2">
            <div className={`text-white ${tabletSizes.text.small} font-medium`}>
              {t('thankYou.timer', currentLanguage)}
            </div>
            <div className={`text-teal-400 ${tabletSizes.text.body} font-bold`}>
              {timeLeft.toString().padStart(2, '0')}s
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
