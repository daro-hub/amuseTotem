'use client'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/translations'

interface NavigationButtonsProps {
  onProceed?: () => void
  onBack?: () => void
  proceedText?: string
  backText?: string
  proceedDisabled?: boolean
  proceedClassName?: string
  backClassName?: string
  className?: string
}

export default function NavigationButtons({
  onProceed,
  onBack,
  proceedText,
  backText,
  proceedDisabled = false,
  proceedClassName = "w-full h-20 bg-teal-800 hover:bg-teal-700 text-white rounded-lg text-4xl font-bold",
  backClassName = "w-full h-20 border-2 border-white text-white hover:bg-white/10 rounded-lg text-4xl font-bold",
  className = "w-full max-w-md mx-auto space-y-4 flex-shrink-0"
}: NavigationButtonsProps) {
  const { currentLanguage } = useLanguage()

  return (
    <div className={className}>
      {onProceed && (
        <Button
          onClick={onProceed}
          disabled={proceedDisabled}
          className={proceedClassName}
        >
          {proceedText || t('proceed', currentLanguage)}
        </Button>
      )}
      {onBack && (
        <Button
          onClick={onBack}
          className={backClassName}
        >
          {backText || t('back', currentLanguage)}
        </Button>
      )}
    </div>
  )
}
