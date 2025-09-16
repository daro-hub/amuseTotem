'use client'

// Interfaccia per i dati di pagamento
export interface PaymentData {
  orderId: string
  amount: number
  currency: string
  museumCode?: string
  tickets?: number
  email?: string
}

// Interfaccia per lo stato del pagamento
export interface PaymentStatus {
  orderId: string
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED' | 'TIMEOUT'
  txCode?: string
  amount?: string
  timestamp?: number
  error?: string
}

export class PaymentService {
  /**
   * Genera un ID ordine univoco
   */
  static generateOrderId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `ORDER-${timestamp}-${random.toUpperCase()}`
  }

  /**
   * Formatta un importo per il pagamento (sempre 2 decimali)
   */
  static formatAmount(amount: number): string {
    return amount.toFixed(2)
  }

  /**
   * Simula un pagamento (comportamento originale)
   */
  static async processPayment(paymentData: PaymentData): Promise<boolean> {
    try {
      console.log('🚀 Processamento pagamento:', paymentData)
      
      // Salva i dati del pagamento localmente
      this.savePaymentData(paymentData)

      // Simula un delay di pagamento (2-3 secondi)
      const delay = Math.random() * 1000 + 2000 // 2-3 secondi
      await new Promise(resolve => setTimeout(resolve, delay))

      console.log('✅ Pagamento processato con successo')
      return true

    } catch (error) {
      console.error('❌ Errore nel processamento del pagamento:', error)
      return false
    }
  }

  /**
   * Salva i dati del pagamento localmente
   */
  static savePaymentData(paymentData: PaymentData): void {
    try {
      localStorage.setItem('currentPayment', JSON.stringify(paymentData))
    } catch (error) {
      console.error('❌ Errore nel salvare i dati di pagamento:', error)
    }
  }

  /**
   * Recupera i dati del pagamento salvati localmente
   */
  static getPaymentData(): PaymentData | null {
    try {
      const data = localStorage.getItem('currentPayment')
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('❌ Errore nel recuperare i dati di pagamento:', error)
      return null
    }
  }

  /**
   * Cancella i dati del pagamento salvati localmente
   */
  static clearPaymentData(): void {
    try {
      localStorage.removeItem('currentPayment')
    } catch (error) {
      console.error('❌ Errore nel cancellare i dati di pagamento:', error)
    }
  }
}