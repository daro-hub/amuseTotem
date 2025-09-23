'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'

function PaymentCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentLanguage } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const processPayment = async () => {
      const status = searchParams.get('smp-status')
      const message = searchParams.get('smp-message')
      const txCode = searchParams.get('smp-tx-code')
      const failureCause = searchParams.get('smp-failure-cause')

      console.log('💳 Payment callback received:', {
        status,
        message,
        txCode,
        failureCause
      })

      // Simula un breve caricamento
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (status === 'success') {
        // Salva i dati del pagamento riuscito
        const paymentData = {
          status: 'success',
          txCode,
          message,
          timestamp: new Date().toISOString()
        }
        localStorage.setItem('paymentData', JSON.stringify(paymentData))
        
        // Vai alla thank-you page
        router.push('/thank-you')
      } else {
        // Salva i dati del pagamento fallito
        const paymentData = {
          status: 'failed',
          txCode,
          message,
          failureCause,
          timestamp: new Date().toISOString()
        }
        localStorage.setItem('paymentData', JSON.stringify(paymentData))
        
        // Vai alla pagina di errore
        router.push('/payment-failed')
      }
    }

    processPayment()
  }, [searchParams, router])

  return (
    <div className="h-[100dvh] bg-black flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
        <h2 className="text-white text-4xl font-bold">
          {t('processingPayment', currentLanguage)}
        </h2>
        <p className="text-white text-2xl">
          {t('pleaseWait', currentLanguage)}
        </p>
      </div>
    </div>
  )
}

export default function PaymentCallback() {
  return (
    <Suspense fallback={
      <div className="h-[100dvh] bg-black flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <h2 className="text-white text-4xl font-bold">Loading...</h2>
        </div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}
