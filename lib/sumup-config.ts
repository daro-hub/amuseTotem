// SumUp Configuration
export const sumupConfig = {
  accessToken: process.env.SUMUP_ACCESS_TOKEN || 'sup_sk_ETR1hNySrFcE6Ycm0f9ZWBuVmbusF0RIp',
  terminalId: process.env.SUMUP_TERMINAL_ID || '110014329170',
  merchantCode: process.env.SUMUP_MERCHANT_CODE || 'MW3ZRZS2',
  environment: (process.env.SUMUP_ENVIRONMENT || 'production') as 'sandbox' | 'production',
  baseUrl: process.env.SUMUP_ENVIRONMENT === 'sandbox' 
    ? 'https://api.sumup.com/v0.1' 
    : 'https://api.sumup.com/v0.1'
}

// Stati di pagamento
export const paymentStates = {
  READY: 'ready',
  WAITING_FOR_CARD: 'waiting_for_card',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  TIMEOUT: 'timeout'
} as const

export type PaymentState = typeof paymentStates[keyof typeof paymentStates]

// Interfacce per SumUp
export interface SumUpTransaction {
  id: string
  amount: number
  currency: string
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED'
  transaction_code: string
  merchant_code: string
  timestamp: string
  product_summary: string
  vat_amount: number
  tip_amount: number
  event_id: string
}

export interface SumUpCheckout {
  id: string
  checkout_url: string
  amount: number
  currency: string
  merchant_code: string
  description: string
  checkout_reference: string
  return_url: string
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED'
}
