import { NextRequest, NextResponse } from 'next/server'
import { sumupService } from '@/lib/sumup-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, description, merchantCode } = body

    console.log('🔄 Ricevuta richiesta pagamento SumUp:', body)

    // Valida i dati
    if (!amount || !currency || !description) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dati mancanti: amount, currency, description sono obbligatori' 
        },
        { status: 400 }
      )
    }

    // Processa il pagamento
    const result = await sumupService.processPayment({
      amount: parseFloat(amount),
      currency,
      description,
      merchantCode
    })

    console.log('✅ Risultato pagamento SumUp:', result)

    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Errore API pagamento SumUp:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Errore interno del server' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Verifica stato del dispositivo
    const isConnected = await sumupService.checkDeviceStatus()
    
    return NextResponse.json({
      success: true,
      connected: isConnected,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Errore verifica stato SumUp:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        connected: false,
        error: error instanceof Error ? error.message : 'Errore verifica stato' 
      },
      { status: 500 }
    )
  }
}
