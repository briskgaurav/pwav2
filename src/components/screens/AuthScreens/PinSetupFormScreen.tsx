'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui'
import { notifyNavigation } from '@/lib/bridge'
import EyeButton from '@/components/ui/EyeButton'
import { PIN_LENGTH } from '@/lib/types'
import type { CardType } from '@/lib/types'
import LayoutSheet from '@/components/ui/LayoutSheet'

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

function NativePINField({
  label,
  value,
  onChange,
  useDots,
  onFocusNext,
  inputRef,
  active,
  onActivate,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  useDots: boolean
  onFocusNext?: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  active: boolean
  onActivate: () => void
}) {
  const digits = Array.from({ length: PIN_LENGTH }, (_, i) => value[i] || '')

  const focus = () => inputRef.current?.focus()

  return (
    <div className="mt-4 w-full">
      <p className="text-sm text-text-primary mb-2">{label}</p>
      <div
        className="cursor-pointer flex items-center justify-center gap-3 relative"
        onClick={() => {
          onActivate()
          focus()
        }}
      >
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          pattern="\d*"
          enterKeyHint="done"
          maxLength={PIN_LENGTH}
          value={value}
          tabIndex={active ? 0 : -1}
          onFocus={onActivate}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH)
            onChange(cleaned)
            if (cleaned.length === PIN_LENGTH) onFocusNext?.()
          }}
          className="absolute -left-[9999px] top-0 w-px h-px opacity-0"
        />

        <div className="flex gap-2.5 w-full px-5 justify-center pr-10">
          {digits.map((d, i) => {
            const isCursor = active && i === value.length && value.length < PIN_LENGTH
            return (
              <div
                key={i}
                className={`w-12 h-12 rounded-[10px] border flex items-center justify-center text-base font-semibold text-text-primary shrink-0 transition-colors ${
                  isCursor ? 'border-primary' : d ? 'border-text-primary' : 'border-border'
                }`}
              >
                {d ? (
                  useDots ? (
                    <span className="w-3 h-3 rounded-full bg-text-primary" />
                  ) : (
                    <span>{d}</span>
                  )
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
    </div>
  )
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
  const [activeField, setActiveField] = useState<'pin' | 'confirm'>('pin')

  const pinHiddenInputRef = useRef<HTMLInputElement | null>(null)
  const confirmHiddenInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    notifyNavigation('pin-setup')
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => pinHiddenInputRef.current?.focus(), 150)
    return () => window.clearTimeout(t)
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

  return (
    <LayoutSheet routeTitle={title} needPadding={false}>
        <div className=" flex flex-col h-full justify-between overflow-hidden">
          <div 
            className=" p-6 py-10 px-5 text-center flex flex-col items-center justify-start gap-2 overflow-auto"
          >
            <h2 className={`text-xl ${titleWeightClass} text-text-primary m-0`}>
              {title}
            </h2>
            <p className="text-[13px] text-text-primary m-0">
              {subtitle}
            </p>

            <div className="relative w-full">
              <NativePINField
                label={pinLabel}
                value={pin}
                useDots={!isPinVisible}
                inputRef={pinHiddenInputRef}
                active={activeField === 'pin'}
                onActivate={() => setActiveField('pin')}
                onFocusNext={() => {
                  setActiveField('confirm')
                  confirmHiddenInputRef.current?.focus()
                }}
                onChange={(v) => {
                  setError(null)
                  setPin(v)
                }}
              />
              <div className='absolute right-[3vw] top-[46px]'>
                <EyeButton
                  isVisible={isPinVisible}
                  onToggle={setIsPinVisible}
                  size="md"
                />
              </div>
            </div>

            <div className="relative w-full mt-3">
              <NativePINField
                label={confirmPinLabel}
                value={confirmPin}
                useDots={!isConfirmPinVisible}
                inputRef={confirmHiddenInputRef}
                active={activeField === 'confirm'}
                onActivate={() => setActiveField('confirm')}
                onChange={(v) => {
                  setError(null)
                  setConfirmPin(v)
                }}
              />
              <div className='absolute right-[3vw] top-[46px]'>
                <EyeButton
                  isVisible={isConfirmPinVisible}
                  onToggle={setIsConfirmPinVisible}
                  size="md"
                />
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
