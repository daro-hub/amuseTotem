'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AmuseLogo from '@/components/AmuseLogo'
import NavigationButtons from '@/components/NavigationButtons'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'
import { tabletSizes } from '@/lib/colors'
import { typography } from '@/lib/typography'

export default function PaymentProcess () {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const { currentLanguage } = useLanguage()

  useEffect(() => {
    // Simula il processo di pagamento
    const timer = setTimeout(() => {
      setIsProcessing(true)
      // Dopo 3 secondi, vai alla thank you page
      setTimeout(() => {
        router.push('/thank-you')
      }, 3000)
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  const handleBack = () => {
    router.push('/payment-confirm')
  }

  return (
    <div className="h-[100dvh] page-container bg-black flex flex-col items-center p-6 overflow-hidden">
      {/* Header con logo, titolo e sottotitolo - Allineato in alto */}
      <div className="flex flex-col items-center pt-2 pb-2 flex-shrink-0">
        <AmuseLogo size={tabletSizes.logo.size} />
        <div className="text-center mt-1">
          <h2 className="text-white text-4xl font-bold text-center">
            {t('paymentProcess.title', currentLanguage)}
          </h2>
          <p className="text-white text-2xl font-light text-center mt-2">
            {t('paymentProcess.instructions', currentLanguage)}
          </p>
        </div>
      </div>

      {/* Contenuto centrale */}
      <div className={`flex flex-col items-center space-y-6 w-full ${tabletSizes.spacing.container} mt-0 flex-1 justify-center`}>

        {/* Immagine pay.png */}
        <div className="w-64 h-40 flex items-center justify-center">
          <img 
            src="/pay.png" 
            alt="Payment" 
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Indicatore di caricamento */}
        {isProcessing && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>

      {/* Pulsante indietro */}
      <NavigationButtons
        onBack={handleBack}
      />
    </div>
  )
}
