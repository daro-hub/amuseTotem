'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Maximize2, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstaller () {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    // Registra il service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrato con successo:', registration)
          
          // Controlla se c'è un aggiornamento disponibile
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nuovo service worker disponibile
                  console.log('Nuovo service worker disponibile')
                }
              })
            }
          })
        })
        .catch((error) => {
          console.log('Errore nella registrazione del Service Worker:', error)
        })
    }

    // Gestisce l'evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    // Gestisce l'evento appinstalled
    const handleAppInstalled = () => {
      console.log('App installata con successo')
      setShowInstallButton(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('Utente ha accettato l\'installazione')
    } else {
      console.log('Utente ha rifiutato l\'installazione')
    }
    
    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  const handleFullscreenClick = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Errore nel fullscreen:', error)
    }
  }

  if (!showInstallButton) return null

  return (
    <div className="pwa-installer">
      <Button
        onClick={handleInstallClick}
        className="pwa-button bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        size="sm"
      >
        <Download className="w-4 h-4 mr-2" />
        Installa App
      </Button>
      <Button
        onClick={handleFullscreenClick}
        className="pwa-button bg-green-600 hover:bg-green-700 text-white shadow-lg"
        size="sm"
      >
        <Maximize2 className="w-4 h-4 mr-2" />
        Schermo Intero
      </Button>
    </div>
  )
}
