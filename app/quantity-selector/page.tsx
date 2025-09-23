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
    <div className="h-[100dvh] page-container no-scroll-page bg-black flex flex-col items-center p-6 pt-0 overflow-hidden">
      {/* Header con logo, titolo e sottotitolo - Allineato in alto */}
      <div className="flex flex-col items-center pt-2 pb-2 flex-shrink-0">
        <AmuseLogo size={tabletSizes.logo.size} />
        <div className="text-center mt-1">
          <h2 className="text-white text-5xl font-bold text-center">
            {t('selectQuantity', currentLanguage)}
          </h2>
          <p className="text-white text-3xl font-light text-center mt-2">
            {t('quantityDescription', currentLanguage)}
          </p>
        </div>
      </div>

      {/* Contenuto centrale - Centrato orizzontalmente */}
      <div className={`flex flex-col items-center space-y-6 w-full max-w-2xl mx-auto flex-1 justify-center`}>

        {/* Sezione selezione quantità */}
        <div className="w-full">
          
          {/* Selettore quantità */}
          <div className="flex items-center justify-center space-x-16">
            <button
              onClick={handleDecrease}
              className="w-28 h-28 border-2 border-white rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <span className="text-white text-6xl font-bold">-</span>
            </button>
            
            <div className={`text-white text-8xl font-bold min-w-[8rem] text-center`}>
              {quantity}
            </div>
            
            <button
              onClick={handleIncrease}
              className="w-28 h-28 border-2 border-white rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <span className="text-white text-6xl font-bold">+</span>
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
