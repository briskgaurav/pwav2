'use client'

import { useEffect, useRef, useState } from 'react'
import { OTPInput, OTPKeypad, CardMockup } from '@/components/ui'
import { useAppSelector } from '@/store/redux/hooks'
import { PIN_LENGTH } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/lib/auth-context'
import { useManagingCard } from '@/hooks/useManagingCard'
import LayoutSheet from '@/components/screens/components/LayoutSheet'
import { useSlideUpKeypad } from '@/hooks/useSlideUpKeypad'

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
  const globalPin = useAppSelector((s) => s.card.pin)
  const verifyGlobalPin = (input: string) => input === globalPin
  const router = useRouter()
  const { t } = useTranslation()
  const { language } = useAuth()
  const isRtl = language === 'ar'

  const pinInputRef = useRef<HTMLDivElement | null>(null)
  const { keypadRef, isKeypadOpen, openKeypad, closeKeypad } = useSlideUpKeypad({
    insideRefs: [pinInputRef],
  })

  useEffect(() => {
    openKeypad()
  }, [openKeypad])

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

          <div ref={pinInputRef} className="flex w-full flex-col items-center gap-4">
            <p className="text-md text-center text-text-primary">
              {t('cardPinAuth.enterYourPin')}
            </p>
            <OTPInput
              useDots
              resetKey={resetKey}
              value={pin}
              maxLength={PIN_LENGTH}
              onPress={openKeypad}
              onChange={setPin}
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
              onClick={() => router.replace('/forget-pin')}
              className="text-xs text-text-primary bg-transparent border-none cursor-pointer"
            >
              {t('cardPinAuth.forgotPin')}
            </button>
          </div>

        </div>

        <div
          ref={keypadRef}
          className={`fixed bottom-0 h-fit left-0 right-0 transition-opacity ${isKeypadOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        >
          <OTPKeypad onKeyPress={handleKeypadKey} />
        </div>


      </div>
    </LayoutSheet>
  )
}
