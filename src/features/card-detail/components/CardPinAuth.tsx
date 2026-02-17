'use client'

import React, { useEffect, useState } from 'react'
import { SheetContainer, OTPInput, Button } from '@/components/ui'
import Image from 'next/image'
import { useCardStore } from '@/store/useCardStore'
import { PIN_LENGTH } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth-context'

type CardPinAuthProps = {
  title?: string
  cardImageSrc: string
  maskedNumber?: string
  onVerified: () => void
}

export default function CardPinAuth({
  title = 'Enter PIN for Selected Instacard',
  cardImageSrc,
  maskedNumber = '0000 0000 0000 0000',
  onVerified,
}: CardPinAuthProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const verifyPin = useCardStore((s) => s.verifyPin)
  const router = useRouter()
  const { t } = useTranslation()
  const { language } = useAuth()
  const isRtl = language === 'ar'

  const handleContinue = () => {
    if (verifyPin(pin)) {
      onVerified()
    } else {
      setError(t('cardPinAuth.incorrectPin'))
      setPin('')
      setResetKey((prev) => prev + 1)
    }
  }

  const isComplete = pin.length === PIN_LENGTH
  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleContinue();
    }
  }, [pin, handleContinue]);

  return (
    <SheetContainer>
      <div className="flex-1 flex flex-col h-full overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col items-center gap-4 py-8 flex-1">
          <p className="text-md text-center text-text-primary">
            {title}
          </p>

          <div className="h-auto w-[70%] relative">
            <Image
              src={cardImageSrc}
              alt="Instacard"
              width={1000}
              height={1000}
              className="h-full w-full object-contain"
              priority
            />
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl w-full text-center select-none">
              {maskedNumber}
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <p className="text-md text-center text-text-primary">
              {t('cardPinAuth.enterYourPin')}
            </p>
            <OTPInput resetKey={resetKey} value={pin} maxLength={PIN_LENGTH} onChange={setPin} />
            <div className="h-4">
              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}
            </div>
          </div>

        </div>
        <div className="w-full flex flex-col items-center py-6 gap-3 px-6 shrink-0">
          <Button
            fullWidth
            onClick={handleContinue}
            disabled={!isComplete}
          >
            {t('cardPinAuth.continue')}
          </Button>
          <button
            type="button"
            onClick={() => router.push('/forget-pin')}
            className="text-xs text-primary bg-transparent border-none cursor-pointer"
          >
            {t('cardPinAuth.forgotPin')}
          </button>
        </div>


      </div>
    </SheetContainer>
  )
}
