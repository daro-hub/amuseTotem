import { NextRequest, NextResponse } from 'next/server'

// Interfaccia per il payload del callback dall'app Android
interface SumUpCallbackPayload {
  orderId: string
  status: 'SUCCESSFUL' | 'FAILED' | 'CANCELLED'
  txCode: string
  amount: string
}

// Interfaccia per i dati dell'ordine memorizzati
interface OrderData {
  orderId: string
  amount: string
  currency: string
  timestamp: number
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED'
  txCode?: string
  museumCode?: string
  tickets?: number
  email?: string
}

// Store temporaneo per gli ordini (in produzione usare database)
const orders = new Map<string, OrderData>()

// Importa le funzioni per gestire gli ordini dall'endpoint create-order
import { updateOrderInMemory, getOrderFromMemory } from '../create-order/route'

export async function POST(request: NextRequest) {
  try {
    const payload: SumUpCallbackPayload = await request.json()
    console.log('🔔 Ricevuto callback SumUp:', payload)

    // Validazione del payload
    if (!payload.orderId || !payload.status || !payload.amount) {
      console.error('❌ Payload callback invalido:', payload)
      return NextResponse.json(
        { error: 'Payload invalido: orderId, status e amount sono richiesti' },
        { status: 400 }
      )
    }

    // Verifica che l'ordine esista
    const existingOrder = getOrderFromMemory(payload.orderId)
    if (!existingOrder) {
      console.error('❌ Ordine non trovato:', payload.orderId)
      return NextResponse.json(
        { error: 'Ordine non trovato' },
        { status: 404 }
      )
    }

    // Verifica che l'importo corrisponda
    if (existingOrder.amount !== payload.amount) {
      console.error('❌ Importo non corrispondente:', {
        expected: existingOrder.amount,
        received: payload.amount
      })
      return NextResponse.json(
        { error: 'Importo non corrispondente' },
        { status: 400 }
      )
    }

    // Aggiorna lo stato dell'ordine
    const updatedOrder = updateOrderInMemory(payload.orderId, {
      status: payload.status,
      txCode: payload.txCode
    })

    if (!updatedOrder) {
      console.error('❌ Errore nell\'aggiornamento dell\'ordine')
      return NextResponse.json(
        { error: 'Errore nell\'aggiornamento dell\'ordine' },
        { status: 500 }
      )
    }

    console.log('✅ Ordine aggiornato:', updatedOrder)

    // Se il pagamento è avvenuto con successo, genera i ticket
    if (payload.status === 'SUCCESSFUL') {
      console.log('🎫 Pagamento riuscito, l\'ordine sarà processato per la generazione ticket')
      
      // Qui potresti inviare una notifica WebSocket o simile
      // per aggiornare il frontend in tempo reale
    }

    return NextResponse.json({
      success: true,
      message: 'Callback ricevuto e processato',
      orderId: payload.orderId,
      status: payload.status
    })

  } catch (error) {
    console.error('❌ Errore nel processare callback SumUp:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Endpoint per verificare lo stato di un ordine
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get('orderId')

  if (!orderId) {
    return NextResponse.json(
      { error: 'orderId è richiesto' },
      { status: 400 }
    )
  }

  const order = getOrderFromMemory(orderId)
  if (!order) {
    return NextResponse.json(
      { error: 'Ordine non trovato' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    order
  })
}

// Funzione helper per pulire ordini vecchi (opzionale)
export function cleanupOldOrders(maxAgeMs: number = 24 * 60 * 60 * 1000) {
  const now = Date.now()
  for (const [orderId, order] of orders.entries()) {
    if (now - order.timestamp > maxAgeMs) {
      orders.delete(orderId)
      console.log('🧹 Ordine vecchio rimosso:', orderId)
    }
  }
}
