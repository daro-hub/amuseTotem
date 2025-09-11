// SumUp Payment Service
// Gestisce l'integrazione con SumUp Air per i pagamenti

export interface SumUpPaymentRequest {
  amount: number
  currency: string
  description: string
  merchantCode?: string
}

export interface SumUpPaymentResponse {
  success: boolean
  transactionId?: string
  amount?: number
  currency?: string
  timestamp?: string
  error?: string
}

export interface SumUpConfig {
  apiKey: string
  deviceId: string
  tabletIp: string
  tabletPort?: number
}

class SumUpService {
  private config: SumUpConfig

  constructor(config: SumUpConfig) {
    this.config = config
  }

  /**
   * Invia una richiesta di pagamento al SumUp Air tramite API locale
   */
  async processPayment(request: SumUpPaymentRequest): Promise<SumUpPaymentResponse> {
    try {
      console.log('🔄 Iniziando pagamento SumUp:', request)

      // Usa l'endpoint API locale che gestirà la comunicazione con il tablet
      const response = await fetch('/api/sumup/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency,
          description: request.description,
          merchantCode: this.config.merchantCode || request.merchantCode
        })
      })

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Risposta pagamento SumUp:', result)

      return {
        success: result.success || false,
        transactionId: result.transactionId,
        amount: result.amount,
        currency: result.currency,
        timestamp: result.timestamp,
        error: result.error
      }

    } catch (error) {
      console.error('❌ Errore pagamento SumUp:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      }
    }
  }

  /**
   * Verifica lo stato del SumUp Air
   */
  async checkDeviceStatus(): Promise<boolean> {
    try {
      // Usa l'endpoint API locale per verificare lo stato
      const response = await fetch('/api/sumup/status', {
        method: 'GET'
      })

      if (!response.ok) {
        return false
      }

      const result = await response.json()
      return result.connected || false
    } catch (error) {
      console.error('❌ Errore verifica stato SumUp:', error)
      return false
    }
  }

  /**
   * Formatta l'importo per SumUp (in centesimi)
   */
  formatAmount(amount: number): number {
    return Math.round(amount * 100)
  }

  /**
   * Formatta l'importo per visualizzazione
   */
  formatAmountForDisplay(amount: number): string {
    return (amount / 100).toFixed(2)
  }
}

// Configurazione SumUp per il museo
export const sumupConfig: SumUpConfig = {
  apiKey: 'sup_sk_ETR1hNySrFcE6Ycm0f9ZWBuVmbusF0RIp',
  deviceId: '110014329170',
  tabletIp: '172.20.10.2',
  tabletPort: 3000
}

// Istanza del servizio SumUp
export const sumupService = new SumUpService(sumupConfig)

export default SumUpService
