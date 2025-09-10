'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AmuseLogo from '@/components/AmuseLogo'
import { buttonStyles, tabletSizes } from '@/lib/colors'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'
import { typography, gradients } from '@/lib/typography'

export default function QuantitySelector () {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { currentLanguage } = useLanguage()

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncrease = () => {
    setQuantity(quantity + 1)
  }

  const handleProceed = () => {
    // Salva la quantità nel localStorage o context
    localStorage.setItem('ticketQuantity', quantity.toString())
    router.push('/payment-confirm')
  }

  const handleBack = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col p-6">
      {/* Header con logo e titolo - Allineato in alto */}
      <div className="flex items-center justify-center pt-8 pb-12">
        <div className="flex items-center gap-6">
          <AmuseLogo size={tabletSizes.logo.size} theme="dark" />
          <div className="text-center">
            <h1 className={`${typography.title.classes} ${gradients.primary}`}>
              {t('selectQuantity', currentLanguage)}
            </h1>
          </div>
        </div>
      </div>

      {/* Contenuto centrale */}
      <div className={`flex flex-col items-center space-y-12 w-full ${tabletSizes.spacing.container} flex-1 justify-center`}>
        {/* Testo descrittivo */}
        <p className={`text-white ${typography.body.classes} text-center`}>
          {t('quantityDescription', currentLanguage)}
        </p>

        {/* Sezione selezione quantità */}
        <div className="w-full">
          
          {/* Selettore quantità */}
          <div className="flex items-center justify-center space-x-12">
            <button
              onClick={handleDecrease}
              className="w-20 h-20 border-2 border-white rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <span className="text-white text-3xl font-light">-</span>
            </button>
            
            <div className={`text-white ${typography.title.classes} min-w-[6rem] text-center`}>
              {quantity}
            </div>
            
            <button
              onClick={handleIncrease}
              className="w-20 h-20 border-2 border-white rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <span className="text-white text-3xl font-light">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pulsanti */}
      <div className={`w-full ${tabletSizes.spacing.container} space-y-4`}>
        <Button
          onClick={handleProceed}
                      className={`w-full bg-teal-800 hover:bg-teal-700 text-white rounded-lg ${tabletSizes.button.padding} font-light ${tabletSizes.button.text}`}
        >
          {t('proceed', currentLanguage)}
        </Button>
        <Button
          onClick={handleBack}
          className={`w-full ${buttonStyles.outline} ${tabletSizes.button.padding} ${tabletSizes.button.text}`}
        >
          {t('back', currentLanguage)}
        </Button>
      </div>
    </div>
  )
}
