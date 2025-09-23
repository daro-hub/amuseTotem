'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import AmuseLogo from '@/components/AmuseLogo'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'
import { tabletSizes } from '@/lib/colors'

function PaymentTestContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentLanguage } = useLanguage()
  
  const orderId = searchParams.get('orderId')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const simulateCallback = async (status: 'SUCCESSFUL' | 'FAILED' | 'CANCELLED') => {
    if (!orderId) {
      alert('OrderId mancante! Vai prima a /payment-status?orderId=ORDER-XXX')
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      const response = await fetch('/api/sumup/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status,
          delay: 2000
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Test ${status} completato con successo!`)
        console.log('Test result:', result)
        
        // Se il test è SUCCESSFUL, reindirizza alla thank-you page
        if (status === 'SUCCESSFUL') {
          setTimeout(() => {
            router.push('/thank-you')
          }, 3000)
        }
      } else {
        setTestResult(`❌ Errore nel test: ${result.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Errore di connessione: ${error}`)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="h-[100dvh] page-container bg-black flex flex-col items-center p-6 overflow-hidden">
      {/* Header con logo, titolo e sottotitolo - Allineato in alto */}
      <div className="flex flex-col items-center pt-2 pb-2 flex-shrink-0">
        <AmuseLogo size={tabletSizes.logo.size} />
        <div className="text-center mt-1">
          <h2 className="text-white text-4xl font-bold text-center">
            Test Pagamento SumUp
          </h2>
          <p className="text-white text-2xl font-light text-center mt-2">
            Simula i callback dell'app Android per testare il flusso
          </p>
        </div>
      </div>

      {/* Contenuto centrale */}
      <div className={`flex flex-col items-center space-y-8 w-full ${tabletSizes.spacing.container} mt-0 flex-1 justify-center`}>
        
        <div className="text-center space-y-6">
          <div className="text-8xl">🧪</div>

        {/* OrderId */}
        {orderId && (
          <div className="bg-blue-950/50 border border-blue-800 rounded-lg p-4">
            <p className="text-blue-300 text-lg">
              OrderId: <span className="font-mono text-blue-200">{orderId}</span>
            </p>
          </div>
        )}

        {/* Pulsanti di test */}
        <div className="flex flex-col space-y-4 w-full max-w-md">
          <Button
            onClick={() => simulateCallback('SUCCESSFUL')}
            disabled={isTesting || !orderId}
            className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xl font-light"
          >
            {isTesting ? '⏳ Testando...' : '✅ Simula SUCCESSFUL'}
          </Button>

          <Button
            onClick={() => simulateCallback('FAILED')}
            disabled={isTesting || !orderId}
            className="w-full h-16 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xl font-light"
          >
            {isTesting ? '⏳ Testando...' : '❌ Simula FAILED'}
          </Button>

          <Button
            onClick={() => simulateCallback('CANCELLED')}
            disabled={isTesting || !orderId}
            className="w-full h-16 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-xl font-light"
          >
            {isTesting ? '⏳ Testando...' : '🚫 Simula CANCELLED'}
          </Button>
        </div>

        {/* Risultato del test */}
        {testResult && (
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 w-full max-w-md">
            <p className="text-white text-lg text-center">{testResult}</p>
          </div>
        )}

        {/* Istruzioni */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 w-full max-w-2xl">
          <h3 className="text-white text-xl font-bold mb-2">Istruzioni:</h3>
          <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
            <li>Vai prima a <code className="bg-gray-800 px-2 py-1 rounded">/payment-status?orderId=ORDER-XXX</code></li>
            <li>Usa i pulsanti sopra per simulare i callback</li>
            <li>Controlla la console per i log dettagliati</li>
            <li>Il test SUCCESSFUL ti porterà alla thank-you page</li>
          </ol>
        </div>
        </div>

        {/* Pulsante torna alla home */}
        <div className="w-full max-w-md">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full h-16 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-lg text-xl font-light"
          >
            🏠 Torna alla Home
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentTestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="text-white text-2xl">Caricamento...</div>
      </div>
    }>
      <PaymentTestContent />
    </Suspense>
  )
}