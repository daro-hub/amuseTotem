import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function useScrollControl() {
  const pathname = usePathname()

  useEffect(() => {
    // Solo su tablet (768px - 1024px)
    if (typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth <= 1024) {
      const body = document.body
      
      // Pagine che NON devono essere scrollabili
      const noScrollPages = [
        '/quantity-selector',
        '/payment-confirm', 
        '/payment-process',
        '/payment-failed',
        '/payment-test'
      ]
      
      // Pagine che DEVONO essere scrollabili
      const scrollPages = [
        '/',
        '/thank-you'
      ]
      
      // Rimuovi tutte le classi di scroll
      body.classList.remove('no-scroll-body')
      
      if (noScrollPages.includes(pathname)) {
        // Blocca lo scroll
        body.classList.add('no-scroll-body')
        console.log('🚫 Scroll blocked for:', pathname)
      } else if (scrollPages.includes(pathname)) {
        // Permetti lo scroll
        body.classList.remove('no-scroll-body')
        console.log('✅ Scroll allowed for:', pathname)
      } else {
        // Default: permetti scroll
        body.classList.remove('no-scroll-body')
        console.log('✅ Scroll allowed (default) for:', pathname)
      }
    }
  }, [pathname])

  // Cleanup quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        document.body.classList.remove('no-scroll-body')
      }
    }
  }, [])
}
