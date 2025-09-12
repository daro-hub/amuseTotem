import { NextRequest, NextResponse } from 'next/server'

// Interfaccia per i dati dell'ordine
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

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()
    console.log('📝 Creando nuovo ordine:', paymentData)

    // Validazione dei dati richiesti
    if (!paymentData.orderId || !paymentData.amount || !paymentData.currency) {
      console.error('❌ Dati ordine invalidi:', paymentData)
      return NextResponse.json(
        { error: 'orderId, amount e currency sono richiesti' },
        { status: 400 }
      )
    }

    // Verifica che l'ordine non esista già
    if (orders.has(paymentData.orderId)) {
      console.error('❌ Ordine già esistente:', paymentData.orderId)
      return NextResponse.json(
        { error: 'Ordine già esistente' },
        { status: 409 }
      )
    }

    // Crea il nuovo ordine
    const order: OrderData = {
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      timestamp: Date.now(),
      status: 'PENDING',
      museumCode: paymentData.museumCode,
      tickets: paymentData.tickets,
      email: paymentData.email
    }

    // Salva l'ordine
    orders.set(order.orderId, order)
    console.log('✅ Ordine creato con successo:', order)

    return NextResponse.json({
      success: true,
      message: 'Ordine creato con successo',
      orderId: order.orderId,
      status: order.status
    })

  } catch (error) {
    console.error('❌ Errore nella creazione dell\'ordine:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// Export della funzione per poterla usare da altri moduli
export function createOrderInMemory(orderData: Omit<OrderData, 'timestamp' | 'status'>): OrderData {
  const order: OrderData = {
    ...orderData,
    timestamp: Date.now(),
    status: 'PENDING'
  }
  
  orders.set(order.orderId, order)
  console.log('📝 Ordine creato in memoria:', order)
  
  return order
}

export function getOrderFromMemory(orderId: string): OrderData | undefined {
  return orders.get(orderId)
}

export function updateOrderInMemory(orderId: string, updates: Partial<OrderData>): OrderData | null {
  const existingOrder = orders.get(orderId)
  if (!existingOrder) {
    return null
  }

  const updatedOrder = { ...existingOrder, ...updates }
  orders.set(orderId, updatedOrder)
  return updatedOrder
}
