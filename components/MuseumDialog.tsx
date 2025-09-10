'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface MuseumDialogProps {
  isOpen: boolean
  onClose: () => void
  onMuseumIdSet: (museumId: string, museumData: any) => void
  currentMuseumId?: string
}

export function MuseumDialog({ isOpen, onClose, onMuseumIdSet, currentMuseumId }: MuseumDialogProps) {
  const [museumId, setMuseumId] = useState(currentMuseumId || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setMuseumId(currentMuseumId || '')
      setError('')
    }
  }, [isOpen, currentMuseumId])

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
        localStorage.setItem('museumId', museumId)
        localStorage.setItem('museumData', JSON.stringify(museumData))
        
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
            <DialogTitle className="text-lg font-semibold">
              {currentMuseumId ? 'Modifica ID Museo' : 'Configurazione Museo'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center">
            <div className="w-full text-center">
              <label htmlFor="museumId" className="block text-sm font-medium mb-2">
                ID Museo
              </label>
              <div className="flex justify-center">
                <Input
                  id="museumId"
                  type="number"
                  value={museumId}
                  onChange={(e) => setMuseumId(e.target.value)}
                  placeholder="467"
                  disabled={isLoading}
                  className="text-3xl w-24 text-center font-medium"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
            
            <div className="flex gap-3 w-full max-w-xs">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !museumId.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
                    localStorage.setItem('museumId', museumId)
                    localStorage.setItem('museumData', JSON.stringify(mockData))
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
