"use client"

import { useState, useEffect, useCallback } from 'react'
import { sumupService } from '@/lib/sumup-service'
import { paymentStates, PaymentState, sumupConfig } from '@/lib/sumup-config'

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
      console.log('🔍 Verificando connessione terminale...')
      
      // Per ora assumiamo che il terminale sia connesso se l'app SumUp è in esecuzione
      // In futuro potremo implementare una verifica più sofisticata
      
      // Test semplice: verifica se possiamo fare una chiamata API base
      const response = await fetch('https://api.sumup.com/v0.1/me', {
        headers: {
          'Authorization': `Bearer ${sumupConfig.accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        console.log('✅ API SumUp accessibile')
        setIsTerminalConnected(true)
        setError(null)
      } else {
        console.log('❌ API SumUp non accessibile')
        setIsTerminalConnected(false)
        setError('Verifica credenziali SumUp')
      }
    } catch (err) {
      console.error('❌ Errore verifica terminale:', err)
      setIsTerminalConnected(false)
      setError('Terminale non disponibile - Verifica connessione Bluetooth e app SumUp')
    }
  }, [])

  // Avvia pagamento
  const startPayment = useCallback(async (amount: number, description: string) => {
    try {
      setError(null)
      setPaymentState(paymentStates.WAITING_FOR_CARD)

      // Crea checkout
      const checkout = await sumupService.createTerminalTransaction({
        amount: Math.round(amount * 100), // Converti in centesimi
        currency: 'EUR',
        description,
        reference: `ticket-${Date.now()}`
      })

      setCurrentTransaction(checkout.transaction_id)
      console.log('✅ Checkout creato:', checkout)

      // Se c'è un checkout_url, apri in nuova finestra per il pagamento
      if (checkout.checkout_url) {
        console.log('🔗 Apertura checkout URL:', checkout.checkout_url)
        
        // Per terminale fisico, potremmo voler gestire il pagamento direttamente qui
        // Per ora mostriamo il link
        setPaymentState(paymentStates.PROCESSING)
        
        // Simula un pagamento riuscito dopo 5 secondi per test
        setTimeout(() => {
          console.log('✅ Simulando pagamento completato...')
          setPaymentState(paymentStates.SUCCESS)
        }, 5000)
        
      } else {
        setPaymentState(paymentStates.FAILED)
        setError('Nessun URL di checkout ricevuto')
      }

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
