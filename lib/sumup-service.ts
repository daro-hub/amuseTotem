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
}

class SumUpService {
  private config: SumUpConfig

  constructor(config: SumUpConfig) {
    this.config = config
  }

  /**
   * Invia una richiesta di pagamento direttamente alle API SumUp
   */
  async processPayment(request: SumUpPaymentRequest): Promise<SumUpPaymentResponse> {
    try {
      console.log('🔄 Iniziando pagamento SumUp:', request)

      // Chiama direttamente le API SumUp
      const response = await fetch('https://api.sumup.com/v0.1/me/checkouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          checkout_reference: `TXN_${Date.now()}`,
          amount: this.formatAmount(request.amount),
          currency: request.currency,
          description: request.description,
          merchant_code: this.config.merchantCode || request.merchantCode
        })
      })

      if (!response.ok) {
        throw new Error(`Errore API SumUp: ${response.status}`)
      }

      const result = await response.json()
      console.log('✅ Risposta pagamento SumUp:', result)

      return {
        success: true,
        transactionId: result.id,
        amount: request.amount,
        currency: request.currency,
        timestamp: new Date().toISOString()
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
   * Verifica lo stato del SumUp Air tramite API SumUp
   */
  async checkDeviceStatus(): Promise<boolean> {
    try {
      // Verifica lo stato del merchant tramite API SumUp
      const response = await fetch('https://api.sumup.com/v0.1/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      })

      if (!response.ok) {
        return false
      }

      const result = await response.json()
      console.log('✅ Stato SumUp verificato:', result)
      return true
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
  deviceId: '110014329170'
}

// Istanza del servizio SumUp
export const sumupService = new SumUpService(sumupConfig)

export default SumUpService
