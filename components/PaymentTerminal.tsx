"use client"

import { useSumUpTerminal } from '@/hooks/useSumUpTerminal'
import { paymentStates } from '@/lib/sumup-config'
import { typography } from '@/lib/typography'

interface PaymentTerminalProps {
  amount: number
  description: string
  onSuccess: () => void
  onError: (error: string) => void
  onCancel: () => void
}

export function PaymentTerminal({ 
  amount, 
  description, 
  onSuccess, 
  onError, 
  onCancel 
}: PaymentTerminalProps) {
  const {
    paymentState,
    currentTransaction,
    error,
    isTerminalConnected,
    startPayment,
    cancelPayment,
    checkTerminalStatus
  } = useSumUpTerminal()

  const handleStartPayment = async () => {
    if (!isTerminalConnected) {
      onError('Terminale non connesso. Verifica la connessione Bluetooth.')
      return
    }

    await startPayment(amount, description)
  }

  const handleCancel = () => {
    cancelPayment()
    onCancel()
  }

  // Gestisci successo
  if (paymentState === paymentStates.SUCCESS) {
    onSuccess()
  }

  // Gestisci errore
  if (error && paymentState === paymentStates.FAILED) {
    onError(error)
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Stato terminale */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          isTerminalConnected ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span className={`${typography.body.classes} ${
          isTerminalConnected ? 'text-green-400' : 'text-red-400'
        }`}>
          {isTerminalConnected ? 'Terminale Connesso' : 'Terminale Disconnesso'}
        </span>
      </div>

      {/* Importo */}
      <div className="text-center">
        <h3 className={`${typography.subtitle.classes} text-white`}>
          Importo da Pagare
        </h3>
        <p className={`${typography.title.classes} text-white font-bold`}>
          €{amount.toFixed(2)}
        </p>
        <p className={`${typography.body.classes} text-gray-300`}>
          {description}
        </p>
      </div>

      {/* Stati di pagamento */}
      {paymentState === paymentStates.READY && (
        <div className="text-center space-y-4">
          <button
            onClick={handleStartPayment}
            disabled={!isTerminalConnected}
            className={`px-8 py-4 rounded-lg font-medium transition-all ${
              isTerminalConnected
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
          >
            Avvia Pagamento
          </button>
          
          {!isTerminalConnected && (
            <div className="space-y-2">
              <button
                onClick={checkTerminalStatus}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Verifica Connessione
              </button>
              <p className="text-xs text-gray-400">
                Assicurati che l'app SumUp sia aperta e il terminale connesso via Bluetooth
              </p>
            </div>
          )}
        </div>
      )}

      {paymentState === paymentStates.WAITING_FOR_CARD && (
        <div className="text-center space-y-4">
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full animate-bounce mb-4" />
            <h3 className={`${typography.subtitle.classes} text-white`}>
              Avvicina la Carta al Terminale
            </h3>
            <p className={`${typography.body.classes} text-gray-300`}>
              Inserisci la carta o usa il pagamento contactless
            </p>
          </div>
          
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Annulla Pagamento
          </button>
        </div>
      )}

      {paymentState === paymentStates.PROCESSING && (
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
          <h3 className={`${typography.subtitle.classes} text-white`}>
            Elaborazione Pagamento...
          </h3>
          <p className={`${typography.body.classes} text-gray-300`}>
            Attendi conferma dal terminale
          </p>
        </div>
      )}

      {paymentState === paymentStates.SUCCESS && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className={`${typography.subtitle.classes} text-green-400`}>
            Pagamento Riuscito!
          </h3>
          <p className={`${typography.body.classes} text-gray-300`}>
            Transazione: {currentTransaction}
          </p>
        </div>
      )}

      {paymentState === paymentStates.FAILED && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className={`${typography.subtitle.classes} text-red-400`}>
            Pagamento Fallito
          </h3>
          <p className={`${typography.body.classes} text-gray-300`}>
            {error || 'Si è verificato un errore durante il pagamento'}
          </p>
          <button
            onClick={handleStartPayment}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Riprova
          </button>
        </div>
      )}

      {paymentState === paymentStates.CANCELLED && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-yellow-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className={`${typography.subtitle.classes} text-yellow-400`}>
            Pagamento Annullato
          </h3>
          <button
            onClick={handleStartPayment}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Riprova
          </button>
        </div>
      )}
    </div>
  )
}
