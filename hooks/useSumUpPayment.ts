'use client'

import { useState, useCallback } from 'react'
import { sumupService, SumUpPaymentRequest, SumUpPaymentResponse } from '@/lib/sumup-service'

export interface UseSumUpPaymentReturn {
  isProcessing: boolean
  isConnected: boolean
  error: string | null
  processPayment: (request: SumUpPaymentRequest) => Promise<SumUpPaymentResponse>
  checkConnection: () => Promise<void>
  clearError: () => void
}

export function useSumUpPayment(): UseSumUpPaymentReturn {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processPayment = useCallback(async (request: SumUpPaymentRequest): Promise<SumUpPaymentResponse> => {
    setIsProcessing(true)
    setError(null)

    try {
      console.log('🔄 Iniziando pagamento SumUp...')
      
      // Verifica connessione prima del pagamento
      const connected = await sumupService.checkDeviceStatus()
      if (!connected) {
        throw new Error('SumUp Air non connesso')
      }

      // Processa il pagamento
      const result = await sumupService.processPayment(request)
      
      if (result.success) {
        console.log('✅ Pagamento SumUp completato:', result)
        setIsConnected(true)
      } else {
        console.error('❌ Pagamento SumUp fallito:', result.error)
        setError(result.error || 'Pagamento fallito')
      }

      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto'
      console.error('❌ Errore pagamento SumUp:', errorMessage)
      setError(errorMessage)
      setIsConnected(false)
      
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const checkConnection = useCallback(async () => {
    try {
      const connected = await sumupService.checkDeviceStatus()
      setIsConnected(connected)
      
      if (connected) {
        console.log('✅ SumUp Air connesso')
        setError(null)
      } else {
        console.log('❌ SumUp Air non connesso')
        setError('SumUp Air non disponibile')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore verifica connessione'
      console.error('❌ Errore verifica SumUp:', errorMessage)
      setError(errorMessage)
      setIsConnected(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    isProcessing,
    isConnected,
    error,
    processPayment,
    checkConnection,
    clearError
  }
}
