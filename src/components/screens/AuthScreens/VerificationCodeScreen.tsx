'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SheetContainer, OTPInput, Button } from '@/components/ui'
import LayoutSheet from '../../ui/LayoutSheet'
import ButtonComponent from '../../ui/ButtonComponent'
import gsap from 'gsap'
import { Check } from 'lucide-react'

const MAX_CODE_LENGTH = 6

type SuccessPopupContent = {
  message: string
  buttonText?: string
}

type VerificationCodeScreenProps = {
  hideLayerSheet?: boolean
  title: string
  subtitle: string
  maskedValue: string
  successRoute: string
  showKeypad?: boolean
  onSuccess?: () => void
  showSuccessPopup?: boolean
  successPopupContent?: SuccessPopupContent
  onVerify?: (code: string) => Promise<void>
}

function NativeOTPInput({
  value,
  maxLength,
  onChange,
  autoFocus = true,
  enableAutoFill = true,
}: {
  value: string
  maxLength: number
  onChange: (v: string) => void
  autoFocus?: boolean
  enableAutoFill?: boolean
}) {
  const hiddenRef = useRef<HTMLInputElement>(null)
  const digits = Array.from({ length: maxLength }, (_, i) => value[i] || '')

  const focusInput = () => hiddenRef.current?.focus()

  useEffect(() => {
    if (!autoFocus) return
    // Mobile browsers can be picky about immediate focus on mount.
    // A short delay improves reliability for keyboard + OTP suggestions.
    const t = window.setTimeout(() => focusInput(), 150)
    return () => window.clearTimeout(t)
  }, [autoFocus])

  return (
    <div className="relative w-full">
      <input
        ref={hiddenRef}
        type="tel"
        inputMode="numeric"
        autoComplete={enableAutoFill ? 'one-time-code' : 'off'}
        name={enableAutoFill ? 'one-time-code' : undefined}
        pattern="\d*"
        enterKeyHint="done"
        maxLength={maxLength}
        value={value}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/\D/g, '').slice(0, maxLength)
          onChange(cleaned)
        }}
        // Keep the input out of the layout so it never blocks taps on other fields.
        className="absolute -left-[9999px] top-0 w-px h-px opacity-0"
      />

      <div
        className="flex gap-2.5 w-full px-5 justify-center"
        onClick={focusInput}
      >
        {digits.map((digit, i) => {
          const isCursor = i === value.length && value.length < maxLength
          return (
            <div
              key={i}
              className={`w-12 h-12 rounded-[10px] border flex items-center justify-center text-base font-semibold text-text-primary shrink-0 transition-colors ${
                isCursor
                  ? 'border-primary'
                  : digit
                  ? 'border-text-primary'
                  : 'border-border'
              }`}
            >
              {digit || (isCursor ? <span className="w-0.5 h-5 bg-primary animate-pulse rounded-full" /> : '')}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function VerificationCodeScreen({
  hideLayerSheet = false,
  title,
  subtitle,
  maskedValue = '',
  successRoute,
  showKeypad = true,
  onSuccess,
  showSuccessPopup: enableSuccessPopup = false,
  successPopupContent = {
    message: 'Your Payment Limits have been successfully updated',
    buttonText: 'Ok',
  },
  onVerify,
}: VerificationCodeScreenProps) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const popupOverlayRef = useRef<HTMLDivElement>(null)
  const popupContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (showSuccessPopup) {
      gsap.fromTo(
        popupOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(
        popupContentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out', delay: 0.1 }
      )
    }
  }, [showSuccessPopup])

  const handleContinue = async () => {
    setIsVerifying(true)
    setErrorText(null)

    try {
      if (onVerify) {
        await onVerify(code)
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }
    } catch (e) {
      setIsVerifying(false)
      setErrorText(e instanceof Error ? e.message : 'Something went wrong')
      return
    }

    setIsVerifying(false)

    if (enableSuccessPopup) {
      setShowSuccessPopup(true)
    } else if (onSuccess) {
      onSuccess()
    } else {
      router.replace(successRoute)
    }
  }

  const handlePopupOk = () => {
    setShowSuccessPopup(false)
    if (onSuccess) {
      onSuccess()
    } else {
      router.replace(successRoute)
    }
  }

  const handleResend = () => {
    setCode('')
  }

  const isCodeComplete = code.length === MAX_CODE_LENGTH

  const renderSuccessPopup = () => {
    if (!showSuccessPopup) return null

    return (
      <div
        ref={popupOverlayRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
        style={{ opacity: 0 }}
      >
        <div
          ref={popupContentRef}
          className="bg-white/80 backdrop-blur-xl  rounded-2xl p-6 mx-8 text-center border border-white/60 min-w-[280px]"
          style={{ opacity: 0 }}
        >
          <div className='flex flex-col gap-2 items-center justify-center'>
            <div className='p-[1vw] border-2 border-[#39D105] rounded-full w-fit aspect-square text-[#39D105]'>
              <Check strokeWidth={2} />
            </div>
            <p className="text-lg text-text-primary">Success</p>
            <p className="mt-1 text-sm text-text-secondary">
              {successPopupContent.message}
            </p>
            <div className="mt-5 w-full flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-full bg-primary py-3 text-sm font-medium text-white"
                onClick={handlePopupOk}
              >
                {successPopupContent.buttonText || 'Ok'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showKeypad) {
    return (
      <LayoutSheet routeTitle={title} needPadding={false} hideLayerSheet={hideLayerSheet}>
        <div className="flex flex-col">
          <div className="flex flex-col justify-center px-5 py-10 text-center gap-3">
            <h2 className="text-xl font-semibold text-text-primary">
              {title}
            </h2>

            <p className="text-sm text-text-primary">
              {subtitle}
            </p>

            <p className="text-sm font-semibold text-text-primary">
              {maskedValue}
            </p>

            <p className="text-sm text-text-primary">
              Please check your messages and enter it here
            </p>

            <div className="mt-6 mb-6 w-full">
              <NativeOTPInput
                value={code}
                maxLength={MAX_CODE_LENGTH}
                autoFocus={false}
                onChange={(v) => {
                  setCode(v)
                  setErrorText(null)
                }}
              />
            </div>

            <div className='relative'>
              <Button
                className='bg-primary text-white rounded-full px-4 py-2 w-full h-full'
                disabled={!isCodeComplete || isVerifying}
                onClick={handleContinue}
              >
                {isVerifying ? 'Verifying...' : 'Continue'}
              </Button>
            </div>

            {errorText && (
              <p className="mt-2 text-xs text-red-500">{errorText}</p>
            )}

            <p className="mt-3 text-sm">
              Didn&apos;t receive the Code?{' '}
              <button
                onClick={handleResend}
                className="bg-transparent border-none text-primary font-semibold cursor-pointer p-0 text-sm"
                type="button"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
        {renderSuccessPopup()}
      </LayoutSheet>
    )
  }

  return (
    <div className="h-fit flex flex-col">
      <SheetContainer>
        <div className="  flex flex-col">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="p-6 py-10 px-5 text-center flex flex-col items-center gap-2">
              <h2 className="text-xl font-semibold text-text-primary m-0">
                {title}
              </h2>
              <p className="text-[13px] text-text-primary m-0">
                {subtitle}
              </p>
              <p className="text-md leading-none font-semibold text-text-primary m-0">
                {maskedValue}
              </p>
              <p className="text-[13px] text-text-primary m-0">
                Please check your messages and enter it here
              </p>

              <div className="mt-4 mb-5">
                <OTPInput
                  value={code}
                  maxLength={MAX_CODE_LENGTH}
                  onChange={setCode}
                />
              </div>
            </div>
          </div>
          <div className='p-6 pb-10 text-center'>
            <ButtonComponent
              title={isVerifying ? 'Verifying...' : 'Continue'}
              onClick={handleContinue}
              disabled={!isCodeComplete || isVerifying}
            />
            <p className="mt-3 text-sm">
              Didn&apos;t receive the Code?{' '}
              <button
                onClick={handleResend}
                className="bg-transparent border-none text-primary font-semibold cursor-pointer p-0 text-sm"
                type="button"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </SheetContainer>
      {renderSuccessPopup()}
    </div>
  )
}
