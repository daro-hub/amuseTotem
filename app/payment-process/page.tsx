'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AmuseLogo from '@/components/AmuseLogo'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'
import { tabletSizes } from '@/lib/colors'

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
    <div className="min-h-screen bg-black flex flex-col items-center justify-between p-6">
      {/* Logo e nome app */}
      <div className="mt-16">
        <AmuseLogo size="md" />
      </div>

      {/* Contenuto centrale */}
      <div className={`flex flex-col items-center space-y-8 w-full ${tabletSizes.spacing.container}`}>
        {/* Istruzioni pagamento */}
        <div className="text-center space-y-4">
          <h2 className={`text-white ${tabletSizes.text.subtitle} font-light`}>
            {t('paymentProcess.title', currentLanguage)}
          </h2>
          <p className={`text-white ${tabletSizes.text.small} font-light`}>
            {t('paymentProcess.instructions', currentLanguage)}
          </p>
        </div>

        {/* Immagine pay.png */}
        <div className="w-48 h-32 flex items-center justify-center">
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
      <div className={`w-full ${tabletSizes.spacing.container}`}>
        <Button
          onClick={handleBack}
          variant="outline"
          className={`w-full bg-transparent border border-white text-white hover:bg-white/5 rounded-lg ${tabletSizes.button.padding} font-light ${tabletSizes.button.text}`}
        >
          {t('back', currentLanguage)}
        </Button>
      </div>
    </div>
  )
}
