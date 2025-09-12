import { NextRequest, NextResponse } from 'next/server'

/**
 * Endpoint di test per simulare i callback dell'app Android AmuseTotemBridge
 * Utile per testare il flusso di pagamento senza l'app fisica
 */

export async function POST(request: NextRequest) {
  try {
    const { orderId, status = 'SUCCESSFUL', delay = 2000 } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId è richiesto' },
        { status: 400 }
      )
    }

    console.log(`🧪 [TEST] Simulando callback per orderId: ${orderId} con status: ${status}`)

    // Simula un delay come farebbe l'app reale
    await new Promise(resolve => setTimeout(resolve, delay))

    // Prepara il payload del callback come lo invierebbe l'app Android
    const callbackPayload = {
      orderId,
      status,
      txCode: status === 'SUCCESSFUL' ? `TX-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : '',
      amount: '15.00' // Importo di test
    }

    console.log(`🧪 [TEST] Inviando callback payload:`, callbackPayload)

    // Invia il callback al nostro endpoint reale
    const callbackResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sumup/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(callbackPayload)
    })

    const callbackResult = await callbackResponse.json()

    if (!callbackResponse.ok) {
      console.error('🧪 [TEST] Errore nel callback:', callbackResult)
      return NextResponse.json({
        success: false,
        error: 'Errore nel callback',
        details: callbackResult
      }, { status: 500 })
    }

    console.log(`🧪 [TEST] Callback completato con successo:`, callbackResult)

    return NextResponse.json({
      success: true,
      message: `Test callback completato per ordine ${orderId}`,
      status,
      txCode: callbackPayload.txCode,
      callbackResult
    })

  } catch (error) {
    console.error('🧪 [TEST] Errore nel test endpoint:', error)
    return NextResponse.json(
      { error: 'Errore interno del server durante il test' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  return NextResponse.json({
    message: 'Endpoint di test per simulare i callback SumUp',
    usage: {
      method: 'POST',
      body: {
        orderId: 'string (required)',
        status: 'SUCCESSFUL | FAILED | CANCELLED (default: SUCCESSFUL)',
        delay: 'number in ms (default: 2000)'
      },
      examples: [
        {
          description: 'Simula pagamento riuscito',
          payload: { orderId: 'ORDER-123', status: 'SUCCESSFUL' }
        },
        {
          description: 'Simula pagamento fallito',
          payload: { orderId: 'ORDER-123', status: 'FAILED' }
        },
        {
          description: 'Simula pagamento annullato',
          payload: { orderId: 'ORDER-123', status: 'CANCELLED' }
        }
      ]
    }
  })
}
