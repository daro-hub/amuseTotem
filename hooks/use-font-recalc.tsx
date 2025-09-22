'use client'

import { useEffect } from 'react'

export function useFontRecalc() {
  useEffect(() => {
    const forceFontRecalc = () => {
      // Reset font-size styles
      document.body.style.fontSize = ''
      document.documentElement.style.fontSize = ''
      
      // Force reflow
      document.body.offsetHeight
      
      // Dispatch resize event
      window.dispatchEvent(new Event('resize'))
      
      console.log('🔄 Font size recalculated')
    }

    // Gestisce il ripristino della pagina da bfcache
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        console.log('🔄 Page restored from bfcache')
        setTimeout(forceFontRecalc, 50)
      }
    }

    // Gestisce il cambio di visibilità della pagina
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('🔄 Page became visible')
        setTimeout(forceFontRecalc, 100)
      }
    }

    // Gestisce il focus della finestra
    const handleFocus = () => {
      console.log('🔄 Window focused')
      setTimeout(forceFontRecalc, 100)
    }

    // Aggiungi listener
    window.addEventListener('pageshow', handlePageShow)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    // Cleanup
    return () => {
      window.removeEventListener('pageshow', handlePageShow)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])
}
