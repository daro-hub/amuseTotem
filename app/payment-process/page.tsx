'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AmuseLogo from '@/components/AmuseLogo'
import { PaymentTerminal } from '@/components/PaymentTerminal'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMuseum } from '@/contexts/MuseumContext'
import { t } from '@/lib/translations'
import { tabletSizes } from '@/lib/colors'
import { typography } from '@/lib/typography'

export default function PaymentProcess () {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const { currentLanguage } = useLanguage()
  const { museumData } = useMuseum()

  // Ottieni quantità e prezzo dal localStorage
  const [quantity, setQuantity] = useState(1)
  const [ticketPrice] = useState(25) // Prezzo fisso per ora

  useEffect(() => {
    // Carica quantità salvata
    const savedQuantity = localStorage.getItem('selectedQuantity')
    if (savedQuantity) {
      setQuantity(parseInt(savedQuantity))
    }
  }, [])

  const totalAmount = quantity * ticketPrice

  const handlePaymentSuccess = () => {
    setIsProcessing(true)
    // Salva dati pagamento
    localStorage.setItem('paymentCompleted', 'true')
    localStorage.setItem('paymentAmount', totalAmount.toString())
    localStorage.setItem('paymentTimestamp', new Date().toISOString())
    
    // Vai alla thank you page dopo 2 secondi
    setTimeout(() => {
      router.push('/thank-you')
    }, 2000)
  }

  const handlePaymentError = (error: string) => {
    setPaymentError(error)
    console.error('Payment error:', error)
  }

  const handlePaymentCancel = () => {
    router.push('/payment-confirm')
  }

  const handleBack = () => {
    router.push('/payment-confirm')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6">
      {/* Logo e nome app */}
      <div className="pt-0 pb-0">
        <AmuseLogo size={tabletSizes.logo.size} m-0 py-0 />
      </div>

      {/* Contenuto centrale */}
      <div className={`flex flex-col items-center space-y-8 w-full ${tabletSizes.spacing.container} mt-8`}>
        {/* Istruzioni pagamento */}
        <div className="text-center space-y-4">
          <h2 className="text-white text-6xl font-bold text-center">
            {t('paymentProcess.title', currentLanguage)}
          </h2>
          <p className="text-white text-3xl font-light text-center">
            {t('paymentProcess.instructions', currentLanguage)}
          </p>
        </div>

        {/* Terminale di pagamento SumUp */}
        {!isProcessing ? (
          <PaymentTerminal
            amount={totalAmount}
            description={`${quantity} biglietti per ${museumData?.museum_name || 'Museo'}`}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className={`${typography.subtitle.classes} text-green-400`}>
              Pagamento Completato!
            </h3>
            <p className={`${typography.body.classes} text-gray-300`}>
              Generazione biglietti in corso...
            </p>
          </div>
        )}

        {/* Mostra errore se presente */}
        {paymentError && (
          <div className="text-center space-y-4 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className={`${typography.body.classes} text-red-400`}>
              {paymentError}
            </p>
            <button
              onClick={() => setPaymentError(null)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Chiudi
            </button>
          </div>
        )}
      </div>

      {/* Pulsante indietro */}
      <div className={`w-full max-w-md mx-auto mt-8`}>
        <Button
          onClick={handleBack}
          variant="outline"
          className={`w-full h-16 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-lg text-3xl font-light`}
        >
          {t('back', currentLanguage)}
        </Button>
      </div>
    </div>
  )
}
