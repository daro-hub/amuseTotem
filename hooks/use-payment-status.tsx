'use client'

import { useState, useEffect, useCallback } from 'react'
import { PaymentService, PaymentStatus } from '@/lib/payment-service'

interface UsePaymentStatusOptions {
  orderId: string
  autoStart?: boolean
  timeout?: number
  pollInterval?: number
  onStatusUpdate?: (status: PaymentStatus) => void
  onSuccess?: (status: PaymentStatus) => void
  onError?: (status: PaymentStatus) => void
}

interface UsePaymentStatusReturn {
  status: PaymentStatus | null
  isPolling: boolean
  error: string | null
  timeRemaining: number
  startPolling: () => void
  stopPolling: () => void
  retry: () => Promise<void>
}

export function usePaymentStatus({
  orderId,
  autoStart = false,
  timeout = 5 * 60 * 1000, // 5 minuti
  pollInterval = 2000, // 2 secondi
  onStatusUpdate,
  onSuccess,
  onError
}: UsePaymentStatusOptions): UsePaymentStatusReturn {
  
  const [status, setStatus] = useState<PaymentStatus | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(timeout / 1000)
  const [startTime, setStartTime] = useState<number | null>(null)

  // Timer per il countdown
  useEffect(() => {
    if (!isPolling || !startTime) return

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, Math.ceil((timeout - elapsed) / 1000))
      setTimeRemaining(remaining)

      if (remaining === 0) {
        setIsPolling(false)
        const timeoutStatus: PaymentStatus = {
          orderId,
          status: 'TIMEOUT',
          error: 'Timeout del pagamento raggiunto'
        }
        setStatus(timeoutStatus)
        onStatusUpdate?.(timeoutStatus)
        onError?.(timeoutStatus)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPolling, startTime, timeout, orderId, onStatusUpdate, onError])

  // Funzione per avviare il polling
  const startPolling = useCallback(async () => {
    if (isPolling) return

    console.log('🔄 Avvio polling per orderId:', orderId)
    setIsPolling(true)
    setError(null)
    setStartTime(Date.now())
    setTimeRemaining(timeout / 1000)

    try {
      const finalStatus = await PaymentService.pollPaymentStatus(
        orderId,
        (statusUpdate) => {
          console.log('📊 Aggiornamento stato pagamento:', statusUpdate)
          setStatus(statusUpdate)
          onStatusUpdate?.(statusUpdate)

          // Gestisci gli stati finali
          if (statusUpdate.status === 'SUCCESSFUL') {
            setIsPolling(false)
            onSuccess?.(statusUpdate)
          } else if (statusUpdate.status === 'FAILED' || statusUpdate.status === 'CANCELLED') {
            setIsPolling(false)
            onError?.(statusUpdate)
          }
        },
        timeout
      )

      console.log('✅ Polling completato con stato finale:', finalStatus)
      setIsPolling(false)

    } catch (err) {
      console.error('❌ Errore durante il polling:', err)
      const errorStatus: PaymentStatus = {
        orderId,
        status: 'FAILED',
        error: err instanceof Error ? err.message : 'Errore sconosciuto'
      }
      setStatus(errorStatus)
      setError(errorStatus.error || 'Errore sconosciuto')
      setIsPolling(false)
      onError?.(errorStatus)
    }
  }, [orderId, isPolling, timeout, onStatusUpdate, onSuccess, onError])

  // Funzione per fermare il polling
  const stopPolling = useCallback(() => {
    console.log('⏹️ Fermando polling per orderId:', orderId)
    setIsPolling(false)
    setStartTime(null)
  }, [orderId])

  // Funzione per riprovare il pagamento
  const retry = useCallback(async () => {
    console.log('🔄 Retry pagamento per orderId:', orderId)
    
    // Recupera i dati del pagamento salvati
    const paymentData = PaymentService.getPaymentData()
    if (!paymentData) {
      setError('Dati di pagamento non trovati per il retry')
      return
    }

    // Genera un nuovo orderId per il retry
    const newOrderId = PaymentService.generateOrderId()
    const newPaymentData = {
      ...paymentData,
      orderId: newOrderId
    }

    try {
      const success = await PaymentService.openPaymentApp(newPaymentData)
      if (!success) {
        setError('Impossibile aprire l\'app di pagamento per il retry')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto durante il retry'
      setError(errorMessage)
      console.error('❌ Errore durante il retry:', err)
    }
  }, [orderId])

  // Auto-start se richiesto
  useEffect(() => {
    if (autoStart && orderId && !isPolling) {
      startPolling()
    }
  }, [autoStart, orderId, isPolling, startPolling])

  return {
    status,
    isPolling,
    error,
    timeRemaining,
    startPolling,
    stopPolling,
    retry
  }
}

export default usePaymentStatus
