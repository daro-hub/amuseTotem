'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'

interface SumUpStatusProps {
  isConnected: boolean
  isProcessing: boolean
  error: string | null
  onRetry?: () => void
}

export default function SumUpStatus({ 
  isConnected, 
  isProcessing, 
  error, 
  onRetry 
}: SumUpStatusProps) {
  const [showDetails, setShowDetails] = useState(false)
  const { currentLanguage } = useLanguage()

  return (
    <div className="text-center space-y-4">
      {/* Stato principale */}
      <div className="flex items-center justify-center space-x-3">
        {isConnected ? (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-2xl font-medium">
              {t('sumup.connected', currentLanguage)}
            </span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-red-400 text-2xl font-medium">
              {t('sumup.disconnected', currentLanguage)}
            </span>
          </div>
        )}
        
        {isProcessing && (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white text-xl">
              {t('sumup.processing', currentLanguage)}
            </span>
          </div>
        )}
      </div>

      {/* Dettagli errore */}
      {error && (
        <div className="bg-red-900/20 border border-red-400 rounded-lg p-4">
          <p className="text-red-400 text-lg font-medium mb-2">
            Errore: {error}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {t('sumup.retry', currentLanguage)}
            </button>
          )}
        </div>
      )}

      {/* Dettagli tecnici */}
      <div className="text-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-400 text-sm hover:text-white underline"
        >
          {showDetails ? t('sumup.hideDetails', currentLanguage) : t('sumup.showDetails', currentLanguage)}
        </button>
        
        {showDetails && (
          <div className="mt-2 text-xs text-gray-400 space-y-1">
            <p>{t('sumup.deviceId', currentLanguage)} 110014329170</p>
            <p>{t('sumup.status', currentLanguage)} {isConnected ? t('sumup.online', currentLanguage) : t('sumup.offline', currentLanguage)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
