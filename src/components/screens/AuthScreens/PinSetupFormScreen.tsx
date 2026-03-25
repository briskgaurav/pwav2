'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { SheetContainer, OTPInput, OTPKeypad, Button } from '@/components/ui'
import { notifyNavigation } from '@/lib/bridge'
import EyeButton from '@/components/ui/EyeButton'
import { PIN_LENGTH } from '@/lib/types'
import type { CardType } from '@/lib/types'
import LayoutSheet from '@/components/ui/LayoutSheet'
import { useSlideUpKeypad } from '@/hooks/useSlideUpKeypad'

type PinSetupFormProps = {
  title: string
  subtitle: string
  pinLabel: string
  confirmPinLabel: string
  onSubmit: (pin: string, cardType: CardType) => void | Promise<void>
  buttonText?: string
  submittingText?: string
  titleWeight?: 'semibold' | 'medium'
}

function PinSetupFormContent({
  title,
  subtitle,
  pinLabel,
  confirmPinLabel,
  onSubmit,
  buttonText = 'Continue',
  submittingText = 'Setting up...',
  titleWeight = 'semibold',
}: PinSetupFormProps) {
  const searchParams = useSearchParams()
  const cardType = (searchParams.get('type') as CardType) || 'debit'
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPinVisible, setIsPinVisible] = useState(false)
  const [isConfirmPinVisible, setIsConfirmPinVisible] = useState(false)

  const pinInputRef = useRef<HTMLDivElement>(null)
  const confirmPinInputRef = useRef<HTMLDivElement>(null)

  const { keypadRef, isKeypadOpen, keypadHeight, openKeypad, closeKeypad } = useSlideUpKeypad({
    insideRefs: [pinInputRef, confirmPinInputRef],
  })

  useEffect(() => {
    notifyNavigation('pin-setup')
  }, [])

  const handleContinue = async () => {
    if (pin.length !== PIN_LENGTH) {
      setError('Please enter a 4-digit PIN')
      return
    }

    if (confirmPin.length !== PIN_LENGTH) {
      setError('Please re-enter your PIN')
      return
    }

    if (pin !== confirmPin) {
      setError('PINs do not match. Please try again.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    await onSubmit(pin, cardType)
    setIsSubmitting(false)
  }

  const titleWeightClass = titleWeight === 'medium' ? 'font-medium' : 'font-semibold'

  const handleKeypadKey = (key: string) => {
    setError(null)

    if (key === 'del') {
      if (confirmPin.length > 0) {
        setConfirmPin((prev) => prev.slice(0, -1))
      } else if (pin.length > 0) {
        setPin((prev) => prev.slice(0, -1))
      }
      return
    }

    if (!/^\d$/.test(key)) return

    if (pin.length < PIN_LENGTH) {
      setPin((prev) => (prev.length < PIN_LENGTH ? prev + key : prev))
    } else if (confirmPin.length < PIN_LENGTH) {
      setConfirmPin((prev) => (prev.length < PIN_LENGTH ? prev + key : prev))
    }
  }

  const handlePinInputClick = () => {
    openKeypad()
  }

  return (
    <LayoutSheet routeTitle={title} needPadding={false}>
        <div className=" flex flex-col h-full justify-between overflow-hidden">
          <div 
            className=" p-6 py-10 px-5 text-center flex flex-col items-center justify-start gap-2 overflow-auto"
            style={{ paddingBottom: isKeypadOpen ? keypadHeight + 40 : undefined }}
          >
            <h2 className={`text-xl ${titleWeightClass} text-text-primary m-0`}>
              {title}
            </h2>
            <p className="text-[13px] text-text-primary m-0">
              {subtitle}
            </p>

            <div className="mt-4 w-full">
              <p className="text-sm text-text-primary mb-2">{pinLabel}</p>
              <div
                ref={pinInputRef}
                onClick={handlePinInputClick}
                className={`cursor-pointer flex items-center justify-center gap-3 relative`}
              >
                <OTPInput
                  value={pin}
                  maxLength={PIN_LENGTH}
                  onChange={setPin}
                  useDots={!isPinVisible}
                />
                <div className='absolute right-[3vw] top-[50%] -translate-y-1/2'>

                  <EyeButton
                    isVisible={isPinVisible}
                    onToggle={setIsPinVisible}
                    size="md"
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 w-full">
              <p className="text-sm text-text-primary mb-2">{confirmPinLabel}</p>
              <div
                ref={confirmPinInputRef}
                onClick={handlePinInputClick}
                className={`cursor-pointer flex items-center justify-center relative`}
              >
                <OTPInput
                  value={confirmPin}
                  maxLength={PIN_LENGTH}
                  onChange={setConfirmPin}
                  useDots={!isConfirmPinVisible}
                  onPress={handlePinInputClick}
                />
                <div className='absolute right-[3vw] top-[50%] -translate-y-1/2'>

                  <EyeButton
                    isVisible={isConfirmPinVisible}
                    onToggle={setIsConfirmPinVisible}
                    size="md"
                  />
                </div>
              </div>
            </div>
            <div className="my-1 min-h-[24px]">
              {error && (
                <p className="text-sm text-error">{error}</p>
              )}
            </div>


            <div className="w-full flex flex-col items-center gap-3 pb-10 px-6">

              <Button
                fullWidth
                onClick={handleContinue}
                disabled={isSubmitting}
              >
                {isSubmitting ? submittingText : buttonText}
              </Button>
            </div>
          </div>
          <div ref={keypadRef} className="fixed bottom-0 left-0 right-0 translate-y-full">
            <OTPKeypad onKeyPress={handleKeypadKey} />
          </div>
        </div>
    </LayoutSheet>
  )
}

export default function PinSetupForm(props: PinSetupFormProps) {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <PinSetupFormContent {...props} />
    </Suspense>
  )
}
