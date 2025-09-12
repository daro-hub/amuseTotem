'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Download, RotateCcw } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'
import { PaymentService } from '@/lib/payment-service'

interface PaymentErrorHandlerProps {
  error: string
  orderId?: string
  onRetry?: () => void
  showDownloadApp?: boolean
  className?: string
}

export function PaymentErrorHandler({
  error,
  orderId,
  onRetry,
  showDownloadApp = false,
  className = ''
}: PaymentErrorHandlerProps) {
  const { currentLanguage } = useLanguage()
  const [isRetrying, setIsRetrying] = useState(false)

  const handleRetry = async () => {
    if (!onRetry) return
    
    setIsRetrying(true)
    try {
      await onRetry()
    } catch (error) {
      console.error('❌ Errore durante il retry:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  const handleDownloadApp = () => {
    const downloadUrl = PaymentService.getAndroidAppDownloadUrl()
    window.open(downloadUrl, '_blank')
  }

  const getErrorIcon = () => {
    if (error.includes('timeout') || error.includes('Timeout')) {
      return '⏰'
    }
    if (error.includes('cancelled') || error.includes('Cancelled')) {
      return '🚫'
    }
    if (error.includes('app') || error.includes('installata')) {
      return '📱'
    }
    return '❌'
  }

  const getErrorTitle = () => {
    if (error.includes('timeout') || error.includes('Timeout')) {
      return t('payment.timeout', currentLanguage)
    }
    if (error.includes('cancelled') || error.includes('Cancelled')) {
      return t('payment.cancelled', currentLanguage)
    }
    if (error.includes('app') || error.includes('installata')) {
      return t('payment.appNotInstalled', currentLanguage)
    }
    return t('payment.failed', currentLanguage)
  }

  const getErrorDescription = () => {
    if (error.includes('timeout')) {
      return 'Il tempo per completare il pagamento è scaduto. Riprova con un nuovo pagamento.'
    }
    if (error.includes('cancelled')) {
      return 'Il pagamento è stato annullato. Puoi riprovare quando sei pronto.'
    }
    if (error.includes('app')) {
      return 'L\'app di pagamento AmuseTotemBridge non sembra essere installata. Scaricala per procedere.'
    }
    if (error.includes('connection') || error.includes('connessione')) {
      return 'Problema di connessione. Verifica la tua connessione internet e riprova.'
    }
    return 'Si è verificato un errore durante il pagamento. Riprova o contatta l\'assistenza.'
  }

  return (
    <div className={`bg-red-950/50 border border-red-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* Icona errore */}
        <div className="text-4xl flex-shrink-0">
          {getErrorIcon()}
        </div>
        
        {/* Contenuto errore */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-red-300 text-xl font-semibold mb-2">
              {getErrorTitle()}
            </h3>
            <p className="text-red-200 text-sm leading-relaxed">
              {getErrorDescription()}
            </p>
            
            {/* Dettagli tecnici dell'errore */}
            {orderId && (
              <p className="text-red-400/70 text-xs mt-2">
                ID Ordine: {orderId}
              </p>
            )}
            
            <details className="mt-2">
              <summary className="text-red-400/70 text-xs cursor-pointer hover:text-red-400">
                Dettagli tecnici
              </summary>
              <p className="text-red-400/60 text-xs mt-1 font-mono">
                {error}
              </p>
            </details>
          </div>
          
          {/* Pulsanti azioni */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Pulsante Riprova */}
            {onRetry && (
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {isRetrying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Riprovando...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    {t('payment.retry', currentLanguage)}
                  </>
                )}
              </Button>
            )}
            
            {/* Pulsante Download App */}
            {showDownloadApp && (
              <Button
                onClick={handleDownloadApp}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-600/10 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t('payment.downloadApp', currentLanguage)}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Suggerimenti aggiuntivi */}
      <div className="mt-4 pt-4 border-t border-red-800/50">
        <div className="text-red-300/80 text-sm">
          <h4 className="font-medium mb-2">💡 Suggerimenti:</h4>
          <ul className="space-y-1 text-xs">
            <li>• Assicurati che l'app AmuseTotemBridge sia aggiornata</li>
            <li>• Verifica che il lettore di carte sia connesso e funzionante</li>
            <li>• Prova a riavviare l'app di pagamento se il problema persiste</li>
            <li>• Contatta l'assistenza se l'errore si ripete più volte</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PaymentErrorHandler
