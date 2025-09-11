'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AmuseLogo from '@/components/AmuseLogo'
import { buttonStyles, tabletSizes } from '@/lib/colors'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'
import { typography } from '@/lib/typography'

export default function PaymentConfirm () {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { currentLanguage } = useLanguage()

  useEffect(() => {
    const savedQuantity = localStorage.getItem('ticketQuantity')
    if (savedQuantity) {
      setQuantity(parseInt(savedQuantity))
    }
  }, [])

  const handlePay = () => {
    router.push('/payment-process')
  }

  const handleBack = () => {
    router.push('/quantity-selector')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6">
      {/* Logo e nome app */}
      <div className="pt-0 pb-0">
        <AmuseLogo size={tabletSizes.logo.size} m-0 py-0 />
      </div>

      {/* Contenuto centrale */}
      <div className={`flex flex-col items-center space-y-8 w-full ${tabletSizes.spacing.container} mt-0`}>
        <h2 className="text-white text-6xl font-bold text-center">
          {t('paymentConfirm.title', currentLanguage)}
        </h2>
        
        <p className="text-white text-3xl font-light text-center">
          {t('paymentConfirm.description', currentLanguage)}
        </p>

        {/* Icona biglietto e dettagli */}
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20">
            <svg viewBox="0 0 24 24" className="w-full h-full text-white" fill="currentColor">
              <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2 0v12h16V6H4zm2 2h12v2H6V8zm0 4h8v2H6v-2z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className={`text-white ${typography.subtitle.classes} font-light`}>
              {t('paymentConfirm.quantity', currentLanguage)} {quantity}
            </span>
            <span className={`text-white ${typography.subtitle.classes} font-light`}>
              {t('paymentConfirm.total', currentLanguage)} €{quantity * 15}
            </span>
          </div>
        </div>
      </div>

      {/* Pulsanti */}
      <div className={`w-full max-w-md mx-auto space-y-4`}>
        <Button
          onClick={handlePay}
          className={`w-full h-16 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-3xl font-light`}
        >
          {t('paymentConfirm.pay', currentLanguage)}
        </Button>
        <Button
          onClick={handleBack}
          className={`w-full h-16 border-2 border-white text-white hover:bg-white/10 rounded-lg text-3xl font-light`}
        >
          {t('back', currentLanguage)}
        </Button>
      </div>
    </div>
  )
}
