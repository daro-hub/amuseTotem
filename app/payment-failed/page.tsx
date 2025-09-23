'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMuseum } from '@/contexts/MuseumContext'
import { t } from '@/lib/translations'
import NavigationButtons from '@/components/NavigationButtons'
import AmuseLogo from '@/components/AmuseLogo'
import { tabletSizes } from '@/lib/colors'

export default function PaymentFailed() {
  const router = useRouter()
  const { currentLanguage } = useLanguage()
  const { ticketPrice, currency, mode } = useMuseum()
  const [countdown, setCountdown] = useState(10)
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    // Carica i dati del pagamento fallito
    const savedPaymentData = localStorage.getItem('paymentData')
    if (savedPaymentData) {
      setPaymentData(JSON.parse(savedPaymentData))
    }
  }, [])

  useEffect(() => {
    // Timer di 10 secondi per tornare al language selector
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleRetryPayment = () => {
    // Se in modalità test, vai direttamente alla thank-you page
    if (mode === 'test') {
      console.log('🧪 Modalità test: bypassing SumUp retry, going to thank-you page')
      // Simula un pagamento riuscito salvando i dati nel localStorage
      const paymentData = {
        status: 'success',
        txCode: 'TEST-RETRY-' + Date.now(),
        message: 'Test payment retry successful',
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('paymentData', JSON.stringify(paymentData))
      router.push('/thank-you')
      return
    }

    // Modalità normale (museo/chiesa): usa SumUp
    const quantity = localStorage.getItem('ticketQuantity') || '1'
    const total = (parseInt(quantity) * ticketPrice).toFixed(2)
    
    // Crea il link SumUp
    const sumupUrl = `sumupmerchant://pay/1.0?affiliate-key=sup_afk_zQ4j4OTduBWxUO7g32DQkVkfdgurbTQy&app-id=com.sumupbridge.app&total=${total}&currency=${currency}&title=AmuseApp Audioguide&receipt-mobilephone=+3531234567890&receipt-email=customer@mail.com&callback=${encodeURIComponent(window.location.origin + '/payment-callback')}`
    
    // Apri il link SumUp
    window.location.href = sumupUrl
  }

  const handleCancel = () => {
    router.push('/')
  }

  return (
    <div className="h-[100dvh] page-container no-scroll-page bg-black flex flex-col items-center p-6 overflow-hidden">
      {/* Header con logo, titolo e sottotitolo - Allineato in alto */}
      <div className="flex flex-col items-center pt-2 pb-2 flex-shrink-0">
        <AmuseLogo size={tabletSizes.logo.size} />
        <div className="text-center mt-1">
          <h2 className="text-white text-4xl font-bold text-center">
            {t('paymentFailed.title', currentLanguage)}
          </h2>
          <p className="text-white text-2xl font-light text-center mt-2">
            {t('paymentFailed.message', currentLanguage)}
          </p>
        </div>
      </div>

      {/* Contenuto centrale */}
      <div className="flex flex-col items-center space-y-6 w-full max-w-2xl mx-auto flex-1 justify-center">
        {/* Icona errore */}
        <div className="text-8xl">❌</div>

        {/* Dettagli errore */}
        {paymentData && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 w-full">
            <p className="text-red-300 text-lg text-center">
              {paymentData.message || t('paymentFailed.unknownError', currentLanguage)}
            </p>
            {paymentData.txCode && (
              <p className="text-red-400 text-sm text-center mt-2">
                {t('paymentFailed.transactionCode', currentLanguage)}: {paymentData.txCode}
              </p>
            )}
          </div>
        )}

        {/* Timer */}
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 w-full">
          <p className="text-yellow-300 text-lg text-center">
            {t('paymentFailed.autoRedirect', currentLanguage)} {countdown}s
          </p>
        </div>
      </div>

      {/* Pulsanti */}
      <NavigationButtons
        onProceed={handleRetryPayment}
        onBack={handleCancel}
        proceedText={t('paymentFailed.retry', currentLanguage)}
        backText={t('paymentFailed.cancel', currentLanguage)}
      />
    </div>
  )
}
