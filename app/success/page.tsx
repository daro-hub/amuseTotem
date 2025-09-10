"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, CheckCircle } from "lucide-react"
import QRCodeDisplay from "@/components/QRCodeDisplay"
import { buttonStyles } from "@/lib/colors"

export default function Success() {
  const [purchaseData, setPurchaseData] = useState<any>(null)
  const router = useRouter()

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const data = localStorage.getItem("purchaseData")
    if (data) {
      const parsed = JSON.parse(data)
      setPurchaseData(parsed)
    }
  }, [])

  const handleNewPurchase = () => {
    localStorage.removeItem("purchaseData")
    router.push("/")
  }

  const handlePurchaseCompleted = () => {
    localStorage.removeItem("purchaseData")
    router.push("/")
  }

  if (!purchaseData) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8ac926] mx-auto mb-4"></div>
          <p className="text-2xl text-white">Caricamento...</p>
        </div>
      </div>
    )
  }

  // Verifica che qrCodes esista e sia un array
  if (!purchaseData.qrCodes || !Array.isArray(purchaseData.qrCodes)) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-white">Errore nel caricamento dei biglietti</p>
          <button
            onClick={handleNewPurchase}
            className="mt-4 bg-[#fb5607] text-white text-xl font-bold py-3 px-6 rounded-full hover:bg-[#e64a00] transition-all duration-300"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <QRCodeDisplay
        qrCodes={purchaseData.qrCodes}
        museumCode={purchaseData.museumCode}
        itineraryTitle={purchaseData.itinerary}
        tickets={purchaseData.tickets}
        total={purchaseData.total}
        email={purchaseData.email}
      />
      
      {/* Pulsanti di azione */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex gap-6">
          <button onClick={handleNewPurchase} className={`${buttonStyles.danger} flex items-center gap-3`}>
            <Home className="w-6 h-6" />
            Nuovo Acquisto
          </button>
          <button onClick={handlePurchaseCompleted} className={`${buttonStyles.secondary} flex items-center gap-3`}>
            <CheckCircle className="w-6 h-6" />
            Acquisto Completato
          </button>
        </div>
      </div>
    </div>
  )
}
