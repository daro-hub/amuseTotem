'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AmuseLogo from '@/components/AmuseLogo'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'
import { tabletSizes } from '@/lib/colors'
import { PaymentService, PaymentStatus } from '@/lib/payment-service'

export default function PaymentStatusPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentLanguage } = useLanguage()
  
  const orderId = searchParams.get('orderId')
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [isPolling, setIsPolling] = useState(true)
  const [timeoutWarning, setTimeoutWarning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minuti

  useEffect(() => {
    if (!orderId) {
      console.error('❌ OrderId mancante, redirect alla home')
      router.push('/')
      return
    }

    let pollPromise: Promise<PaymentStatus> | null = null
    
    // Avvia il polling del pagamento
    const startPolling = async () => {
      try {
        console.log('🔄 Avvio polling per orderId:', orderId)
        
        pollPromise = PaymentService.pollPaymentStatus(
          orderId,
          (status) => {
            console.log('📊 Aggiornamento stato pagamento:', status)
            setPaymentStatus(status)
            
            // Se il pagamento è completato, ferma il polling
            if (status.status === 'SUCCESSFUL') {
              setIsPolling(false)
              // Redirect alla thank you page dopo 2 secondi
              setTimeout(() => {
                router.push('/thankyou')
              }, 2000)
            } else if (status.status === 'FAILED' || status.status === 'CANCELLED') {
              setIsPolling(false)
            } else if (status.status === 'TIMEOUT') {
              setIsPolling(false)
              setTimeoutWarning(true)
            }
          },
          5 * 60 * 1000 // 5 minuti timeout
        )

        const finalStatus = await pollPromise
        console.log('✅ Polling completato con stato finale:', finalStatus)
        
      } catch (error) {
        console.error('❌ Errore durante il polling:', error)
        setPaymentStatus({
          orderId,
          status: 'FAILED',
          error: 'Errore di connessione'
        })
        setIsPolling(false)
      }
    }

    startPolling()

    // Timer per il conto alla rovescia
    const countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setTimeoutWarning(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Cleanup
    return () => {
      clearInterval(countdownInterval)
      if (pollPromise) {
        // Il polling si fermerà automaticamente al timeout
        console.log('🧹 Cleanup polling')
      }
    }
  }, [orderId, router])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleRetryPayment = () => {
    // Recupera i dati del pagamento salvati
    const paymentData = PaymentService.getPaymentData()
    if (paymentData) {
      // Genera un nuovo orderId per il retry
      const newOrderId = PaymentService.generateOrderId()
      const newPaymentData = {
        ...paymentData,
        orderId: newOrderId
      }
      
      console.log('🔄 Retry pagamento con nuovo orderId:', newOrderId)
      
      // Apri l'app di pagamento
      PaymentService.openPaymentApp(newPaymentData).then(success => {
        if (success) {
          // Reindirizza alla nuova pagina di stato
          router.push(`/payment-status?orderId=${newOrderId}`)
        } else {
          console.error('❌ Impossibile aprire l\'app di pagamento per il retry')
        }
      })
    } else {
      console.error('❌ Dati di pagamento non trovati per il retry')
      router.push('/')
    }
  }

  const handleBackToHome = () => {
    PaymentService.clearPaymentData()
    router.push('/')
  }

  const handleDownloadApp = () => {
    const downloadUrl = PaymentService.getAndroidAppDownloadUrl()
    window.open(downloadUrl, '_blank')
  }

  const getStatusIcon = () => {
    if (!paymentStatus) return '⏳'
    
    switch (paymentStatus.status) {
      case 'SUCCESSFUL':
        return '✅'
      case 'FAILED':
        return '❌'
      case 'CANCELLED':
        return '🚫'
      case 'TIMEOUT':
        return '⏰'
      default:
        return '⏳'
    }
  }

  const getStatusMessage = () => {
    if (!paymentStatus) {
      return t('payment.openingApp', currentLanguage)
    }
    
    switch (paymentStatus.status) {
      case 'PENDING':
        return t('payment.waitingForPayment', currentLanguage)
      case 'SUCCESSFUL':
        return t('payment.successful', currentLanguage)
      case 'FAILED':
        return t('payment.failed', currentLanguage)
      case 'CANCELLED':
        return t('payment.cancelled', currentLanguage)
      case 'TIMEOUT':
        return t('payment.timeout', currentLanguage)
      default:
        return t('payment.processing', currentLanguage)
    }
  }

  const shouldShowRetryButton = () => {
    return paymentStatus && (
      paymentStatus.status === 'FAILED' || 
      paymentStatus.status === 'CANCELLED' || 
      paymentStatus.status === 'TIMEOUT'
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6">
      {/* Logo */}
      <div className="pt-0 pb-0">
        <AmuseLogo size={tabletSizes.logo.size} m-0 py-0 />
      </div>

      {/* Contenuto centrale */}
      <div className={`flex flex-col items-center space-y-8 w-full ${tabletSizes.spacing.container} mt-8`}>
        
        {/* Stato del pagamento */}
        <div className="text-center space-y-6">
          <div className="text-8xl">{getStatusIcon()}</div>
          
          <h2 className="text-white text-5xl font-bold text-center">
            {getStatusMessage()}
          </h2>
          
          {/* Ordine ID */}
          {orderId && (
            <p className="text-white/60 text-xl">
              ID Ordine: {orderId}
            </p>
          )}
          
          {/* Istruzioni */}
          {paymentStatus?.status === 'PENDING' && (
            <p className="text-white text-2xl font-light text-center max-w-2xl">
              {t('payment.instructions', currentLanguage)}
            </p>
          )}
          
          {/* Conto alla rovescia */}
          {isPolling && timeRemaining > 0 && (
            <div className="text-white/80 text-lg">
              {t('thankYou.timeRemaining', currentLanguage)} {formatTime(timeRemaining)}
            </div>
          )}
          
          {/* Warning timeout */}
          {timeoutWarning && timeRemaining < 60 && timeRemaining > 0 && (
            <div className="text-yellow-400 text-xl font-medium">
              ⚠️ {t('payment.timeout', currentLanguage)}
            </div>
          )}
        </div>

        {/* Animazione di caricamento per stati pending */}
        {isPolling && paymentStatus?.status === 'PENDING' && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}

        {/* Messaggio di errore specifico */}
        {paymentStatus?.error && (
          <div className="text-red-400 text-lg text-center max-w-md">
            {paymentStatus.error}
          </div>
        )}
      </div>

      {/* Pulsanti di azione */}
      <div className="w-full max-w-md mx-auto mt-8 space-y-4">
        
        {/* Pulsante Riprova Pagamento */}
        {shouldShowRetryButton() && (
          <Button
            onClick={handleRetryPayment}
            className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-2xl font-medium"
          >
            {t('payment.retry', currentLanguage)}
          </Button>
        )}

        {/* Pulsante Download App se l'app non è installata */}
        {paymentStatus?.status === 'FAILED' && (
          <Button
            onClick={handleDownloadApp}
            variant="outline"
            className="w-full h-16 bg-transparent border-2 border-green-500 text-green-500 hover:bg-green-500/10 rounded-lg text-xl font-medium"
          >
            {t('payment.downloadApp', currentLanguage)}
          </Button>
        )}

        {/* Pulsante Torna alla Home */}
        <Button
          onClick={handleBackToHome}
          variant="outline"
          className="w-full h-16 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-lg text-xl font-light"
        >
          {t('back', currentLanguage)}
        </Button>
      </div>
    </div>
  )
}
