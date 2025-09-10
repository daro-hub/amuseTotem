'use client'

// Servizio per la gestione dei biglietti
export interface TicketData {
  id: string
  type: string
  price: number
  quantity: number
  total: number
  validFrom: Date
  validUntil: Date
  qrCode?: string
}

export interface PurchaseData {
  tickets: TicketData[]
  total: number
  currency: string
  customerEmail?: string
  paymentMethod?: string
  timestamp: Date
}

class TicketService {
  private storageKey = 'amuse_tickets'

  // Salva i dati del biglietto
  saveTicketData(data: PurchaseData): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Errore nel salvare i dati del biglietto:', error)
    }
  }

  // Recupera i dati del biglietto
  getTicketData(): PurchaseData | null {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Errore nel recuperare i dati del biglietto:', error)
      return null
    }
  }

  // Cancella i dati del biglietto
  clearTicketData(): void {
    try {
      localStorage.removeItem(this.storageKey)
    } catch (error) {
      console.error('Errore nel cancellare i dati del biglietto:', error)
    }
  }

  // Genera un codice QR usando l'API reale
  async generateQRCode(museumCode: string): Promise<string> {
    try {
      console.log('🎫 Generando QR code per museum_code:', museumCode)
      
      const apiUrl = 'https://xejn-1dw8-r0nq.f2.xano.io/api:B_gGZXzt/totem/tickets'
      const payload = { museum_code: museumCode }
      
      console.log('🔗 API URL:', apiUrl)
      console.log('📦 Payload:', payload)
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error Response:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('📊 API Response data:', data)
      
      const ticketCode = data.ticket_code
      console.log('🎫 Generated ticket_code:', ticketCode)
      
      // Assembla l'URL come specificato
      const qrUrl = `https://web.amuseapp.art/check-in?code=${ticketCode}&museumId=${museumCode}`
      console.log('🔗 Generated QR URL:', qrUrl)
      
      return qrUrl
    } catch (error) {
      console.error('❌ Errore nella generazione del QR code:', error)
      // Fallback per errori
      const fallbackUrl = `https://web.amuseapp.art/check-in?code=ERROR&museumId=${museumCode}`
      console.log('🔄 Using fallback URL:', fallbackUrl)
      return fallbackUrl
    }
  }

  // Valida un biglietto
  validateTicket(ticketId: string): boolean {
    // Logica di validazione del biglietto
    return ticketId.length > 0
  }

  // Calcola il prezzo totale
  calculateTotal(tickets: TicketData[]): number {
    return tickets.reduce((total, ticket) => total + ticket.total, 0)
  }
}

// Funzione per generare multiple tickets usando l'API reale
export const generateMultipleTickets = async (count: number, museumCode: string, basePrice: number = 15): Promise<TicketData[]> => {
  console.log('🎫 Generando multiple tickets:', { count, museumCode, basePrice })
  
  const tickets: TicketData[] = []
  const ticketService = new TicketService()
  
  for (let i = 0; i < count; i++) {
    console.log(`🎫 Generando ticket ${i + 1}/${count}`)
    
    const ticketId = `TICKET-${Date.now()}-${i + 1}`
    console.log('🎫 Ticket ID:', ticketId)
    
    const qrCodeUrl = await ticketService.generateQRCode(museumCode)
    console.log('🎫 QR Code URL per ticket', i + 1, ':', qrCodeUrl)
    
    const ticket: TicketData = {
      id: ticketId,
      type: 'Standard',
      price: basePrice,
      quantity: 1,
      total: basePrice,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 giorni
      qrCode: qrCodeUrl
    }
    
    console.log('🎫 Ticket generato:', ticket)
    tickets.push(ticket)
  }
  
  console.log('✅ Tutti i tickets generati:', tickets)
  return tickets
}

export const ticketService = new TicketService()
