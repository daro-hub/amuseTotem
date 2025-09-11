import { sumupConfig, SumUpCheckout, SumUpTransaction } from './sumup-config'

class SumUpService {
  private baseUrl = sumupConfig.baseUrl
  private accessToken = sumupConfig.accessToken

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SumUp API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // Crea un checkout per pagamento
  async createCheckout(data: {
    amount: number
    currency: string
    description: string
    checkout_reference: string
    return_url: string
    cancel_url: string
  }): Promise<SumUpCheckout> {
    return this.makeRequest('/checkouts', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        merchant_code: sumupConfig.merchantCode
      })
    })
  }

  // Ottieni dettagli di un checkout
  async getCheckout(checkoutId: string): Promise<SumUpCheckout> {
    return this.makeRequest(`/checkouts/${checkoutId}`)
  }

  // Ottieni dettagli di una transazione
  async getTransaction(transactionId: string): Promise<SumUpTransaction> {
    return this.makeRequest(`/me/transactions/${transactionId}`)
  }

  // Lista transazioni recenti
  async getTransactions(limit: number = 10): Promise<SumUpTransaction[]> {
    return this.makeRequest(`/me/transactions?limit=${limit}`)
  }

  // Verifica stato terminale
  async getTerminalStatus(): Promise<{
    terminal_id: string
    status: 'ONLINE' | 'OFFLINE' | 'ERROR'
    last_seen: string
  }> {
    return this.makeRequest(`/me/terminals/${sumupConfig.terminalId}`)
  }

  // Crea transazione per terminale (per pagamenti diretti)
  async createTerminalTransaction(data: {
    amount: number
    currency: string
    description: string
    reference: string
  }): Promise<{
    transaction_id: string
    status: 'PENDING' | 'SUCCESSFUL' | 'FAILED'
    checkout_url?: string
  }> {
    return this.makeRequest('/me/transactions', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        terminal_id: sumupConfig.terminalId,
        merchant_code: sumupConfig.merchantCode
      })
    })
  }
}

export const sumupService = new SumUpService()
