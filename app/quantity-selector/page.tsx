'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AmuseLogo from '@/components/AmuseLogo'
import { buttonStyles, tabletSizes } from '@/lib/colors'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMuseum } from '@/contexts/MuseumContext'
import { t } from '@/lib/translations'
import { typography, gradients } from '@/lib/typography'

export default function QuantitySelector () {
  const router = useRouter()
  const { currentLanguage } = useLanguage()
  const { quantity, setQuantity, setTotalAmount } = useMuseum()

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncrease = () => {
    setQuantity(quantity + 1)
  }

  const handleProceed = () => {
    // Calcola l'importo totale (€5.00 per biglietto)
    const totalAmount = quantity * 5.00
    setTotalAmount(totalAmount)
    
    // Salva la quantità nel localStorage per compatibilità
    localStorage.setItem('ticketQuantity', quantity.toString())
    router.push('/payment-confirm')
  }

  const handleBack = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-6 pt-0">
      {/* Header con logo e titolo - Allineato in alto */}
      <div className="flex flex-col items-center pt-0 pb-4">
        <AmuseLogo size={tabletSizes.logo.size} />
        <div className="text-center mt-0">
          <h2 className="text-white text-6xl font-bold text-center">
            {t('selectQuantity', currentLanguage)}
          </h2>
        </div>
      </div>

      {/* Contenuto centrale - Centrato orizzontalmente */}
      <div className={`flex flex-col items-center space-y-10 w-full max-w-4xl mx-auto flex-1 justify-center `}>
        {/* Testo descrittivo */}
        <p className="text-white text-3xl font-light text-center">
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

      {/* Pulsanti - Centrati orizzontalmente */}
      <div className={`w-full max-w-md mx-auto space-y-4 mt-8`}>
        <Button
          onClick={handleProceed}
          className={`w-full h-16 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-3xl font-light`}
        >
          {t('proceed', currentLanguage)}
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
