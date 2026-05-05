'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useTranslation } from 'react-i18next'

import { OTPInput, OTPKeypad, CardMockup } from '@/components/ui'
import LayoutSheet from '@/components/ui/LayoutSheet'
import { useManagingCard } from '@/hooks/useManagingCard'
import { useSlideUpKeypad } from '@/hooks/useSlideUpKeypad'
import { useAuth } from '@/lib/auth-context'
import { routes } from '@/lib/routes'
import { PIN_LENGTH } from '@/lib/types'
import { useAppSelector } from '@/store/redux/hooks'

type CardPinAuthProps = {
  title?: string
  cardImageSrc: string
  maskedNumber?: string
  onVerified: () => void
}

function NativePINInput({
  value,
  maxLength,
  onChange,
  resetKey,
}: {
  value: string
  maxLength: number
  onChange: (v: string) => void
  resetKey: string | number
}) {
  const hiddenRef = useRef<HTMLInputElement>(null)
  const digits = Array.from({ length: maxLength }, (_, i) => value[i] || '')

  const focusInput = () => hiddenRef.current?.focus()

  useEffect(() => {
    const t = window.setTimeout(() => focusInput(), 150)
    return () => window.clearTimeout(t)
  }, [resetKey])

  return (
    <div className="relative w-full">
      <input
        ref={hiddenRef}
        type="tel"
        inputMode="numeric"
        autoComplete="off"
        pattern="\d*"
        enterKeyHint="done"
        maxLength={maxLength}
        value={value}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/\D/g, '').slice(0, maxLength)
          onChange(cleaned)
        }}
        className="absolute -left-[9999px] top-0 w-px h-px opacity-0"
      />

      <div className="flex gap-2.5 w-full px-5 justify-center" onClick={focusInput}>
        {digits.map((digit, i) => {
          const isCursor = i === value.length && value.length < maxLength
          return (
            <div
              key={i}
              className={`w-12 h-12 rounded-[10px] border flex items-center justify-center text-base font-semibold text-text-primary shrink-0 transition-colors ${isCursor ? 'border-primary' : digit ? 'border-text-primary' : 'border-border'
                }`}
            >
              {digit ? (
                <span className="w-3 h-3 rounded-full bg-text-primary" />
              ) : isCursor ? (
                <span className="w-0.5 h-5 bg-primary animate-pulse rounded-full" />
              ) : (
                ''
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
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
  const { verifyPin: verifyCardPin, card: managingCard } = useManagingCard()
  const globalPin = useAppSelector((s) => s.card.pin)
  const router = useRouter()
  const { t } = useTranslation()
  const { language } = useAuth()
  const isRtl = language === 'ar'

  const handleContinue = useCallback(() => {
    const globalPinOk = pin === globalPin
    const isValid = managingCard ? verifyCardPin(pin) : globalPinOk
    if (isValid) {
      onVerified()
    } else {
      setError(t('cardPinAuth.incorrectPin'))
      setPin('')
      setResetKey((prev) => prev + 1)
    }
  }, [globalPin, managingCard, onVerified, pin, t, verifyCardPin])

  const isComplete = pin.length === PIN_LENGTH
  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleContinue()
    }
  }, [pin, handleContinue])



  return (
    <LayoutSheet routeTitle={'PIN Verification'}>
      <div className=" flex flex-col h-fit " dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex flex-col h-1/2 overflow-y-auto items-center gap-2 ">
          <p className="text-md text-center text-text-primary">
            {title}
          </p>
          <div className='w-[70%] mx-auto'>

            <CardMockup
              numberSize='text-lg'
              imageSrc={cardImageSrc || '/img/cards/DebitCard.png'}
              maskedNumber={maskedNumber}
              isclickable={false}
              showActions={false}
              showNumber={true}

            />
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <p className="text-md text-center text-text-primary">
              {t('cardPinAuth.enterYourPin')}
            </p>
            <NativePINInput
              resetKey={resetKey}
              value={pin}
              maxLength={PIN_LENGTH}
              onChange={(v) => {
                setError('')
                setPin(v)
              }}
            />
            <div className="h-4">
              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col items-center py-6 gap-3 px-6 shrink-0">
            <button
              type="button"
              className="w-full py-3 rounded-[20px] bg-primary text-[#fff] font-medium text-base disabled:opacity-30 active:scale-[0.97] transition-transform"
              onClick={handleContinue}
              disabled={!isComplete}
            >
              {t('cardPinAuth.continue')}
            </button>
            <button
              type="button"
              onClick={() => router.replace(routes.forgetPin)}
              className="text-xs text-text-primary bg-transparent border-none cursor-pointer"
            >
              {t('cardPinAuth.forgotPin')}
            </button>
          </div>

        </div>

      </div>
    </LayoutSheet>
  )
}
