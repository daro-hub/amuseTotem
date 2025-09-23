'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { typography } from '@/lib/typography'

interface MuseumDialogProps {
  isOpen: boolean
  onClose: () => void
  onMuseumIdSet: (museumId: string, museumData: any) => void
  currentMuseumId?: string
  currentTicketPrice?: number
  currentCurrency?: string
  currentMode?: 'test' | 'museo' | 'chiesa'
  onConfigUpdate?: (ticketPrice: number, currency: string, mode: 'test' | 'museo' | 'chiesa') => void
}

export function MuseumDialog({ 
  isOpen, 
  onClose, 
  onMuseumIdSet, 
  currentMuseumId,
  currentTicketPrice = 5,
  currentCurrency = 'EUR',
  currentMode = 'museo',
  onConfigUpdate
}: MuseumDialogProps) {
  const [museumId, setMuseumId] = useState(currentMuseumId || '')
  const [ticketPrice, setTicketPrice] = useState(currentTicketPrice)
  const [currency, setCurrency] = useState(currentCurrency)
  const [mode, setMode] = useState<'test' | 'museo' | 'chiesa'>(currentMode)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMuseumId(currentMuseumId || '')
      setTicketPrice(currentTicketPrice)
      setCurrency(currentCurrency)
      setMode(currentMode)
      setError('')
    }
  }, [isOpen, currentMuseumId, currentTicketPrice, currentCurrency, currentMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!museumId.trim()) {
      setError('Inserisci un ID museo valido')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const apiUrl = `https://xejn-1dw8-r0nq.f2.xano.io/api:B_gGZXzt/museum_totem?museum_id=${museumId}`
      console.log('🔄 Calling museum API...')
      console.log('🔗 API URL:', apiUrl)
      console.log('📦 Museum ID:', museumId)

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('📡 Museum API Response status:', response.status)

      if (!response.ok) {
        let errorMessage = `Errore API: ${response.status}`
        
        try {
          const errorData = await response.json()
          console.log('📊 Error response data:', errorData)
          if (errorData.message) {
            errorMessage += ` - ${errorData.message}`
          }
        } catch (parseError) {
          console.log('❌ Could not parse error response:', parseError)
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('📊 Museum API Response data:', data)

      if (data && data.length > 0) {
        const museumData = data[0]
        console.log('✅ Museum data received:', museumData)
        
        // Salva nel localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('museumId', museumId)
          localStorage.setItem('museumData', JSON.stringify(museumData))
          localStorage.setItem('urlTicketPrice', ticketPrice.toString())
          localStorage.setItem('urlCurrency', currency)
          localStorage.setItem('urlMode', mode)
        }
        
        // Aggiorna la configurazione nel context
        if (onConfigUpdate) {
          onConfigUpdate(ticketPrice, currency, mode)
        }
        
        onMuseumIdSet(museumId, museumData)
        onClose()
      } else {
        throw new Error('Nessun dato museo trovato')
      }
    } catch (error) {
      console.error('❌ Error fetching museum data:', error)
      
      let errorMessage = 'Errore nel caricamento dei dati'
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Errore di connessione. Verifica la connessione internet.'
        } else if (error.message.includes('400')) {
          errorMessage = 'ID museo non valido. Prova con un ID diverso.'
        } else if (error.message.includes('404')) {
          errorMessage = 'Museo non trovato. Verifica l\'ID inserito.'
        } else if (error.message.includes('500')) {
          errorMessage = 'Errore del server. Riprova più tardi.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className={`${typography.subtitle.classes} font-semibold`}>
              {currentMuseumId ? 'Modifica ID Museo' : 'Configurazione Museo'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
            {/* ID Museo */}
            <div className="w-full text-center">
              <label htmlFor="museumId" className={`block ${typography.body.classes} font-medium mb-2`}>
                ID Museo
              </label>
              <div className="flex justify-center">
                <Input
                  id="museumId"
                  type="number"
                  value={museumId}
                  onChange={(e) => setMuseumId(e.target.value)}
                  placeholder=""
                  disabled={isLoading}
                  className={`w-48 h-20 text-center font-bold museum-input`}
                  style={{ fontSize: '3rem', lineHeight: '1' }}
                />
              </div>
            </div>

            {/* Prezzo Biglietto */}
            <div className="w-full text-center">
              <label htmlFor="ticketPrice" className={`block ${typography.body.classes} font-medium mb-2`}>
                Prezzo Biglietto (€)
              </label>
              <div className="flex justify-center">
                <Input
                  id="ticketPrice"
                  type="number"
                  step="0.01"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(parseFloat(e.target.value) || 0)}
                  disabled={isLoading}
                  className="w-48 h-12 text-center font-medium"
                />
              </div>
            </div>

            {/* Valuta */}
            <div className="w-full text-center">
              <label htmlFor="currency" className={`block ${typography.body.classes} font-medium mb-2`}>
                Valuta
              </label>
              <div className="flex justify-center">
                <Input
                  id="currency"
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  placeholder="EUR"
                  disabled={isLoading}
                  className="w-48 h-12 text-center font-medium"
                />
              </div>
            </div>

            {/* Modalità */}
            <div className="w-full text-center">
              <label htmlFor="mode" className={`block ${typography.body.classes} font-medium mb-2`}>
                Modalità
              </label>
              <div className="flex justify-center">
                <select
                  id="mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'test' | 'museo' | 'chiesa')}
                  disabled={isLoading}
                  className="w-48 h-12 text-center border rounded-md bg-white font-medium text-gray-900"
                >
                  <option value="museo">Museo</option>
                  <option value="test">Test</option>
                  <option value="chiesa">Chiesa</option>
                </select>
              </div>
            </div>

            {error && (
              <p className={`text-red-500 ${typography.small.classes} mt-1`}>{error}</p>
            )}
            
            <div className="flex gap-3 w-full max-w-xs">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className={`flex-1 ${typography.body.classes}`}
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !museumId.trim()}
                className={`flex-1 ${typography.body.classes}`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Caricamento...
                  </>
                ) : (
                  'Salva'
                )}
              </Button>
            </div>
            
            {error && (
              <div className="w-full text-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    // Usa dati mock per test
                    const mockData = {
                      museum_id: museumId,
                      name: 'Museo Demo',
                      museum_languages: [
                        { code: 'it', name: 'Italiano' },
                        { code: 'en', name: 'English' },
                        { code: 'fr', name: 'Français' }
                      ]
                    }
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('museumId', museumId)
                      localStorage.setItem('museumData', JSON.stringify(mockData))
                      localStorage.setItem('urlTicketPrice', ticketPrice.toString())
                      localStorage.setItem('urlCurrency', currency)
                      localStorage.setItem('urlMode', mode)
                    }
                    
                    // Aggiorna la configurazione nel context
                    if (onConfigUpdate) {
                      onConfigUpdate(ticketPrice, currency, mode)
                    }
                    
                    onMuseumIdSet(museumId, mockData)
                    onClose()
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Usa dati demo
                </Button>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
  )
}
