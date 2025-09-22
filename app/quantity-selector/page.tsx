'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AmuseLogo from '@/components/AmuseLogo'
import NavigationButtons from '@/components/NavigationButtons'
import { tabletSizes } from '@/lib/colors'
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
    <div className="h-screen bg-black flex flex-col items-center p-6 pt-0 overflow-hidden">
      {/* Header con logo e titolo - Allineato in alto */}
      <div className="flex flex-col items-center pt-2 pb-2 flex-shrink-0">
        <AmuseLogo size={tabletSizes.logo.size} />
        <div className="text-center mt-1">
          <h2 className="text-white text-4xl font-bold text-center">
            {t('selectQuantity', currentLanguage)}
          </h2>
        </div>
      </div>

      {/* Contenuto centrale - Centrato orizzontalmente */}
      <div className={`flex flex-col items-center space-y-6 w-full max-w-2xl mx-auto flex-1 justify-center`}>
        {/* Testo descrittivo */}
        <p className="text-white text-2xl font-light text-center">
          {t('quantityDescription', currentLanguage)}
        </p>

        {/* Sezione selezione quantità */}
        <div className="w-full">
          
          {/* Selettore quantità */}
          <div className="flex items-center justify-center space-x-8">
            <button
              onClick={handleDecrease}
              className="w-16 h-16 border-2 border-white rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <span className="text-white text-2xl font-light">-</span>
            </button>
            
            <div className={`text-white text-4xl font-bold min-w-[4rem] text-center`}>
              {quantity}
            </div>
            
            <button
              onClick={handleIncrease}
              className="w-16 h-16 border-2 border-white rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <span className="text-white text-2xl font-light">+</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pulsanti - Fissi in basso */}
      <NavigationButtons
        onProceed={handleProceed}
        onBack={handleBack}
      />
    </div>
  )
}
