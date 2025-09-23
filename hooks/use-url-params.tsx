'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface UrlParams {
  museumId: string | null
  ticketPrice: number | null
  currency: string | null
  mode: 'test' | 'museo' | 'chiesa' | null
}

export function useUrlParams(): UrlParams {
  const searchParams = useSearchParams()
  const [params, setParams] = useState<UrlParams>({
    museumId: null,
    ticketPrice: null,
    currency: null,
    mode: null
  })

  useEffect(() => {
    const museumId = searchParams.get('museum_id') || searchParams.get('museumId')
    const ticketPrice = searchParams.get('ticket_price') || searchParams.get('ticketPrice')
    const currency = searchParams.get('currency')
    const mode = searchParams.get('mode') as 'test' | 'museo' | 'chiesa' | null

    setParams({
      museumId,
      ticketPrice: ticketPrice ? parseFloat(ticketPrice) : null,
      currency: currency || 'EUR',
      mode: mode || 'museo' // Default a 'museo' se non specificato
    })

    console.log('🔗 URL Parameters detected:', {
      museumId,
      ticketPrice: ticketPrice ? parseFloat(ticketPrice) : null,
      currency: currency || 'EUR',
      mode: mode || 'museo'
    })
  }, [searchParams])

  return params
}
