'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AmuseLogo from '@/components/AmuseLogo'
import NavigationButtons from '@/components/NavigationButtons'
import { tabletSizes } from '@/lib/colors'
import { useLanguage } from '@/contexts/LanguageContext'
import { useMuseum } from '@/contexts/MuseumContext'
import { t } from '@/lib/translations'
import { typography } from '@/lib/typography'

export default function PaymentConfirm () {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { currentLanguage } = useLanguage()
  const { ticketPrice, currency, mode } = useMuseum()

  useEffect(() => {
    const savedQuantity = localStorage.getItem('ticketQuantity')
    if (savedQuantity) {
      setQuantity(parseInt(savedQuantity))
    }
  }, [])

  const handlePay = () => {
    console.log('🔍 Debug payment-confirm:', { mode, ticketPrice, currency })
    
    // Se in modalità test, vai direttamente alla thank-you page
    if (mode === 'test') {
      console.log('🧪 Modalità test: bypassing SumUp, going to thank-you page')
      // Simula un pagamento riuscito salvando i dati nel localStorage
      const paymentData = {
        status: 'success',
        txCode: 'TEST-' + Date.now(),
        message: 'Test payment successful',
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('paymentData', JSON.stringify(paymentData))
      router.push('/thank-you')
      return
    }

    // Modalità normale (museo/chiesa): usa SumUp
    const total = (quantity * ticketPrice).toFixed(2)
    
    // Crea il link SumUp
    const sumupUrl = `sumupmerchant://pay/1.0?affiliate-key=sup_afk_zQ4j4OTduBWxUO7g32DQkVkfdgurbTQy&app-id=com.sumupbridge.app&total=${total}&currency=${currency}&title=AmuseApp Audioguide&receipt-mobilephone=+3531234567890&receipt-email=customer@mail.com&callback=${encodeURIComponent(window.location.origin + '/payment-callback')}`
    
    // Apri il link SumUp
    window.location.href = sumupUrl
  }

  const handleBack = () => {
    router.push('/quantity-selector')
  }

  return (
    <div className="h-[100dvh] page-container bg-black flex flex-col items-center p-6 overflow-hidden">
      {/* Header con logo, titolo e sottotitolo - Allineato in alto */}
      <div className="flex flex-col items-center pt-2 pb-2 flex-shrink-0">
        <AmuseLogo size={tabletSizes.logo.size} />
        <div className="text-center mt-1">
          <h2 className="text-white text-5xl font-bold text-center">
            {t('paymentConfirm.title', currentLanguage)}
          </h2>
          <p className="text-white text-3xl font-light text-center mt-2">
            {t('paymentConfirm.description', currentLanguage)}
          </p>
        </div>
      </div>

      {/* Contenuto centrale - Riepilogo al centro */}
      <div className={`flex flex-col items-center space-y-6 w-full ${tabletSizes.spacing.container} mt-0 flex-1 justify-center`}>
        {/* Icona biglietto e dettagli */}
        <div className="flex items-center space-x-8 mb-6">
          <div className="w-24 h-24">
            <svg viewBox="0 0 24 24" className="w-full h-full text-white" fill="currentColor">
              <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2 0v12h16V6H4zm2 2h12v2H6V8zm0 4h8v2H6v-2z"/>
            </svg>
          </div>
          <div className="flex flex-col space-y-3">
            <span className="text-white text-5xl font-bold">
              {t('paymentConfirm.quantity', currentLanguage)} {quantity}
            </span>
            <span className="text-white text-5xl font-bold">
              {t('paymentConfirm.total', currentLanguage)} {currency} {quantity * ticketPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Pulsanti */}
      <NavigationButtons
        onProceed={handlePay}
        onBack={handleBack}
        proceedText={t('paymentConfirm.pay', currentLanguage)}
      />
    </div>
  )
}
