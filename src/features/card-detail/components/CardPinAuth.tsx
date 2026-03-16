'use client'

import React, { useEffect, useState } from 'react'
import { SheetContainer, OTPInput, OTPKeypad, Button } from '@/components/ui'
import Image from 'next/image'
import { useCardStore } from '@/store/useCardStore'
import { PIN_LENGTH } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth-context'
import { useManagingCard } from '@/hooks/useManagingCard'

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
  const [isImageLoading, setIsImageLoading] = useState(true)
  const { verifyPin: verifyCardPin, card: managingCard } = useManagingCard()
  const verifyGlobalPin = useCardStore((s) => s.verifyPin)
  const router = useRouter()
  const { t } = useTranslation()
  const { language } = useAuth()
  const isRtl = language === 'ar'

  const handleContinue = () => {
    const isValid = managingCard ? verifyCardPin(pin) : verifyGlobalPin(pin)
    if (isValid) {
      onVerified()
    } else {
      setError(t('cardPinAuth.incorrectPin'))
      setPin('')
      setResetKey((prev) => prev + 1)
    }
  }

  const handleKeypadKey = (key: string) => {
    setError('')

    if (key === 'del') {
      setPin((prev) => prev.slice(0, -1))
      return
    }

    if (!/^\d$/.test(key)) return
    setPin((prev) => (prev.length < PIN_LENGTH ? prev + key : prev))
  }

  const isComplete = pin.length === PIN_LENGTH
  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleContinue();
    }
  }, [pin, handleContinue]);

  

  return (
    <SheetContainer>
      <div className=" flex flex-col h-fit overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col h-1/2 overflow-y-auto items-center gap-4 py-8 flex-1">
          <p className="text-md text-center text-text-primary">
            {title}
          </p>

          <div className="h-auto w-[70%] relative">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-transparent rounded-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <Image
              src={cardImageSrc}
              alt="Instacard"
              width={1000}
              height={1000}
              className={`h-full w-full object-contain ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
              priority
              onLoad={() => setIsImageLoading(false)}
            />
            {!isImageLoading && (
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#fff] text-xl w-full text-center select-none">
                {maskedNumber}
              </p>
            )}
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <p className="text-md text-center text-text-primary">
              {t('cardPinAuth.enterYourPin')}
            </p>
            <OTPInput
              useDots
              resetKey={resetKey}
              value={pin}
              maxLength={PIN_LENGTH}
              onChange={setPin}
            />
            <div className="h-4">
              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}
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
              onClick={() => router.replace('/forget-pin')}
              className="text-xs text-text-primary bg-transparent border-none cursor-pointer"
            >
              {t('cardPinAuth.forgotPin')}
            </button>
          </div>

        </div>

        <OTPKeypad onKeyPress={handleKeypadKey} />


      </div>
    </SheetContainer>
  )
}
