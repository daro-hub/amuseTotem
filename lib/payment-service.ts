'use client'

// Interfaccia per i dati di pagamento
export interface PaymentData {
  orderId: string
  amount: string
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
  private static readonly DEEP_LINK_SCHEME = 'myapp://checkout'
  private static readonly CALLBACK_URL = 'https://amuse-totem.vercel.app/sumup/callback'
  private static readonly POLL_INTERVAL = 2000 // 2 secondi
  private static readonly PAYMENT_TIMEOUT = 5 * 60 * 1000 // 5 minuti

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
   * Costruisce il deep link per l'app Android
   */
  static buildDeepLink(paymentData: PaymentData): string {
    const params = new URLSearchParams({
      amount: paymentData.amount,
      currency: paymentData.currency,
      orderId: paymentData.orderId
    })

    return `${this.DEEP_LINK_SCHEME}?${params.toString()}`
  }

  /**
   * Apre il deep link verso l'app Android
   */
  static async openPaymentApp(paymentData: PaymentData): Promise<boolean> {
    try {
      const deepLink = this.buildDeepLink(paymentData)
      console.log('🔗 Aprendo deep link:', deepLink)

      // Salva i dati del pagamento localmente
      this.savePaymentData(paymentData)

      // Crea l'ordine nel backend
      await this.createOrder(paymentData)

      // Prova ad aprire il deep link
      if (typeof window !== 'undefined') {
        window.location.href = deepLink
        return true
      }

      return false
    } catch (error) {
      console.error('❌ Errore nell\'aprire l\'app di pagamento:', error)
      return false
    }
  }

  /**
   * Crea un ordine nel backend
   */
  static async createOrder(paymentData: PaymentData): Promise<void> {
    try {
      const response = await fetch('/api/sumup/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      if (!response.ok) {
        throw new Error(`Errore nella creazione dell'ordine: ${response.status}`)
      }

      console.log('✅ Ordine creato con successo:', paymentData.orderId)
    } catch (error) {
      console.error('❌ Errore nella creazione dell\'ordine:', error)
      throw error
    }
  }

  /**
   * Verifica lo stato di un pagamento
   */
  static async checkPaymentStatus(orderId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`/api/sumup/callback?orderId=${orderId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            orderId,
            status: 'PENDING',
            error: 'Ordine non trovato'
          }
        }
        throw new Error(`Errore nel controllo stato: ${response.status}`)
      }

      const data = await response.json()
      return {
        orderId,
        status: data.order.status,
        txCode: data.order.txCode,
        amount: data.order.amount,
        timestamp: data.order.timestamp
      }
    } catch (error) {
      console.error('❌ Errore nel controllo stato pagamento:', error)
      return {
        orderId,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Errore sconosciuto'
      }
    }
  }

  /**
   * Polling dello stato del pagamento
   */
  static async pollPaymentStatus(
    orderId: string,
    onStatusUpdate: (status: PaymentStatus) => void,
    timeout: number = this.PAYMENT_TIMEOUT
  ): Promise<PaymentStatus> {
    return new Promise((resolve) => {
      const startTime = Date.now()
      
      const checkStatus = async () => {
        const elapsed = Date.now() - startTime
        
        // Timeout raggiunto
        if (elapsed >= timeout) {
          const timeoutStatus: PaymentStatus = {
            orderId,
            status: 'TIMEOUT',
            error: 'Timeout del pagamento raggiunto'
          }
          onStatusUpdate(timeoutStatus)
          resolve(timeoutStatus)
          return
        }

        // Controlla lo stato
        const status = await this.checkPaymentStatus(orderId)
        onStatusUpdate(status)

        // Se il pagamento è completato (successo o fallimento), stop polling
        if (status.status === 'SUCCESSFUL' || status.status === 'FAILED' || status.status === 'CANCELLED') {
          resolve(status)
          return
        }

        // Continua il polling
        setTimeout(checkStatus, this.POLL_INTERVAL)
      }

      checkStatus()
    })
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

  /**
   * Rileva se l'app Android è installata (best effort)
   */
  static async isAndroidAppInstalled(): Promise<boolean> {
    // Questa è una detection best-effort
    // In realtà è difficile rilevare se un'app è installata dal web
    try {
      if (typeof window === 'undefined') return false
      
      // Prova a verificare se il sistema operativo è Android
      const isAndroid = /Android/i.test(navigator.userAgent)
      
      // Per ora restituisce true se siamo su Android
      // In futuro si potrebbe implementare una detection più sofisticata
      return isAndroid
    } catch (error) {
      console.error('❌ Errore nella detection dell\'app Android:', error)
      return false
    }
  }

  /**
   * Ottiene l'URL per il download dell'app Android
   */
  static getAndroidAppDownloadUrl(): string {
    // URL placeholder - sostituire con l'URL reale del Play Store
    return 'https://play.google.com/store/apps/details?id=com.amusetotem.bridge'
  }
}
