'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AmuseLogo from '@/components/AmuseLogo'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMuseum } from '@/contexts/MuseumContext'
import { t } from '@/lib/translations'
import { tabletSizes } from '@/lib/colors'
import { typography } from '@/lib/typography'
import { useSumUpPayment } from '@/hooks/useSumUpPayment'
import SumUpStatus from '@/components/SumUpStatus'

export default function PaymentProcess () {
  const router = useRouter()
  const { currentLanguage } = useLanguage()
  const { museumData, quantity, totalAmount } = useMuseum()
  const { 
    isProcessing, 
    isConnected, 
    error, 
    processPayment, 
    checkConnection, 
    clearError 
  } = useSumUpPayment()

  useEffect(() => {
    // Verifica connessione SumUp al caricamento
    checkConnection()
  }, [checkConnection])

  const handlePayment = async () => {
    if (!museumData || !quantity || !totalAmount) {
      console.error('❌ Dati mancanti per il pagamento')
      return
    }

    try {
      const paymentRequest = {
        amount: totalAmount,
        currency: 'EUR',
        description: `Biglietti ${museumData.museum_name} - ${quantity}x`
      }

      console.log('🔄 Avviando pagamento SumUp:', paymentRequest)
      
      const result = await processPayment(paymentRequest)
      
      if (result.success) {
        console.log('✅ Pagamento completato:', result)
        router.push('/thank-you')
      } else {
        console.error('❌ Pagamento fallito:', result.error)
      }
    } catch (err) {
      console.error('❌ Errore durante il pagamento:', err)
    }
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
          
          {/* Stato connessione SumUp */}
          <SumUpStatus
            isConnected={isConnected}
            isProcessing={isProcessing}
            error={error}
            onRetry={checkConnection}
          />
        </div>

        {/* Immagine pay.png */}
        <div className="w-80 h-48 flex items-center justify-center">
          <img 
            src="/pay.png" 
            alt="Payment" 
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Pulsante pagamento */}
        <div className="w-full max-w-md">
          <Button
            onClick={handlePayment}
            disabled={!isConnected || isProcessing}
            className={`w-full h-16 bg-white text-black hover:bg-gray-200 rounded-lg text-3xl font-light ${
              !isConnected ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>{t('sumup.processing', currentLanguage)}</span>
              </div>
            ) : (
              t('sumup.payWithSumUp', currentLanguage)
            )}
          </Button>
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
