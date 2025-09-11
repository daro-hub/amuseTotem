"use client"

import { useState, useEffect, useCallback } from 'react'
import { sumupService } from '@/lib/sumup-service'
import { paymentStates, PaymentState } from '@/lib/sumup-config'

interface UseSumUpTerminalReturn {
  paymentState: PaymentState
  currentTransaction: string | null
  error: string | null
  isTerminalConnected: boolean
  startPayment: (amount: number, description: string) => Promise<void>
  cancelPayment: () => void
  checkTerminalStatus: () => Promise<void>
}

export function useSumUpTerminal(): UseSumUpTerminalReturn {
  const [paymentState, setPaymentState] = useState<PaymentState>(paymentStates.READY)
  const [currentTransaction, setCurrentTransaction] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isTerminalConnected, setIsTerminalConnected] = useState(false)

  // Verifica stato terminale
  const checkTerminalStatus = useCallback(async () => {
    try {
      const status = await sumupService.getTerminalStatus()
      setIsTerminalConnected(status.status === 'ONLINE')
      setError(null)
    } catch (err) {
      console.error('Errore verifica terminale:', err)
      setIsTerminalConnected(false)
      setError('Terminale non disponibile')
    }
  }, [])

  // Avvia pagamento
  const startPayment = useCallback(async (amount: number, description: string) => {
    try {
      setError(null)
      setPaymentState(paymentStates.WAITING_FOR_CARD)

      // Crea transazione
      const transaction = await sumupService.createTerminalTransaction({
        amount: Math.round(amount * 100), // Converti in centesimi
        currency: 'EUR',
        description,
        reference: `ticket-${Date.now()}`
      })

      setCurrentTransaction(transaction.transaction_id)
      setPaymentState(paymentStates.PROCESSING)

      // Polling per verificare stato transazione
      const pollTransaction = async () => {
        try {
          const transactionDetails = await sumupService.getTransaction(transaction.transaction_id)
          
          switch (transactionDetails.status) {
            case 'SUCCESSFUL':
              setPaymentState(paymentStates.SUCCESS)
              break
            case 'FAILED':
              setPaymentState(paymentStates.FAILED)
              setError('Pagamento fallito')
              break
            case 'CANCELLED':
              setPaymentState(paymentStates.CANCELLED)
              setError('Pagamento annullato')
              break
            case 'PENDING':
              // Continua polling
              setTimeout(pollTransaction, 2000)
              break
          }
        } catch (err) {
          console.error('Errore polling transazione:', err)
          setPaymentState(paymentStates.FAILED)
          setError('Errore durante il pagamento')
        }
      }

      // Avvia polling dopo 2 secondi
      setTimeout(pollTransaction, 2000)

    } catch (err) {
      console.error('Errore avvio pagamento:', err)
      setPaymentState(paymentStates.FAILED)
      setError('Impossibile avviare il pagamento')
    }
  }, [])

  // Annulla pagamento
  const cancelPayment = useCallback(() => {
    setPaymentState(paymentStates.CANCELLED)
    setCurrentTransaction(null)
    setError('Pagamento annullato')
  }, [])

  // Reset stato
  const resetPayment = useCallback(() => {
    setPaymentState(paymentStates.READY)
    setCurrentTransaction(null)
    setError(null)
  }, [])

  // Verifica stato terminale al mount
  useEffect(() => {
    checkTerminalStatus()
    
    // Verifica ogni 30 secondi
    const interval = setInterval(checkTerminalStatus, 30000)
    
    return () => clearInterval(interval)
  }, [checkTerminalStatus])

  // Auto-reset dopo successo o errore
  useEffect(() => {
    if (paymentState === paymentStates.SUCCESS || paymentState === paymentStates.FAILED) {
      const timer = setTimeout(resetPayment, 5000)
      return () => clearTimeout(timer)
    }
  }, [paymentState, resetPayment])

  return {
    paymentState,
    currentTransaction,
    error,
    isTerminalConnected,
    startPayment,
    cancelPayment,
    checkTerminalStatus
  }
}
