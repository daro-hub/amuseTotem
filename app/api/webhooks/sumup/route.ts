import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('SumUp Webhook received:', body)
    
    // Verifica che sia una richiesta valida da SumUp
    const { event, data } = body
    
    if (!event || !data) {
      return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 })
    }
    
    // Gestisci diversi tipi di eventi
    switch (event) {
      case 'transaction.completed':
        console.log('Transaction completed:', data.transaction_id)
        // Qui potresti aggiornare il database o inviare notifiche
        break
        
      case 'transaction.failed':
        console.log('Transaction failed:', data.transaction_id)
        break
        
      case 'transaction.cancelled':
        console.log('Transaction cancelled:', data.transaction_id)
        break
        
      default:
        console.log('Unknown event:', event)
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'SumUp webhook endpoint' })
}
