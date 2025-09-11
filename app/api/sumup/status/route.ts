import { NextRequest, NextResponse } from 'next/server'
import { sumupService } from '@/lib/sumup-service'

export async function GET() {
  try {
    console.log('🔄 Verificando stato SumUp Air...')
    
    // Verifica stato del dispositivo
    const isConnected = await sumupService.checkDeviceStatus()
    
    console.log(`✅ Stato SumUp Air: ${isConnected ? 'Connesso' : 'Non connesso'}`)
    
    return NextResponse.json({
      success: true,
      connected: isConnected,
      deviceId: '110014329170',
      tabletIp: '172.20.10.2',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Errore verifica stato SumUp:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        connected: false,
        error: error instanceof Error ? error.message : 'Errore verifica stato',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
