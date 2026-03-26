'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SheetContainer, OTPInput, OTPKeypad } from '@/components/ui'
import LayoutSheet from '../../ui/LayoutSheet'
import ButtonComponent from '../../ui/ButtonComponent'
import { useSlideUpKeypad } from '@/hooks/useSlideUpKeypad'
import gsap from 'gsap'

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
}

export default function VerificationCodeScreen({
  hideLayerSheet = false,
  title,
  subtitle,
  maskedValue = 'nird***malik@gmail.com',
  successRoute,
  showKeypad = true,
  onSuccess,
  showSuccessPopup: enableSuccessPopup = false,
  successPopupContent = {
    message: 'Your Payment Limits have been successfully updated',
    buttonText: 'Ok',
  },
}: VerificationCodeScreenProps) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const otpInputRef = useRef<HTMLDivElement>(null)
  const popupOverlayRef = useRef<HTMLDivElement>(null)
  const popupContentRef = useRef<HTMLDivElement>(null)

  const { keypadRef, isKeypadOpen, keypadHeight, openKeypad, closeKeypad } = useSlideUpKeypad({
    insideRefs: [otpInputRef],
  })

  useEffect(() => {
    if (showSuccessPopup) {
      // Animate in
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

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'del') {
      setCode((prev) => prev.slice(0, -1))
      return
    }
    setCode((prev) => {
      if (prev.length >= MAX_CODE_LENGTH) {
        return prev
      }
      return `${prev}${key}`
    })
  }, [])

  const handleContinue = async () => {
    setIsVerifying(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

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
    // TODO: Implement resend OTP API call
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
          <p className="text-text-primary text-xm mb-6">
            {successPopupContent.message}
          </p>
          <button
            onClick={handlePopupOk}
            className="w-full py-3 rounded-full text-text-primary font-medium cursor-pointer border-none"
            type="button"
          >
            {successPopupContent.buttonText || 'Ok'}
          </button>
        </div>
      </div>
    )
  }

  if (showKeypad) {
    return (
      <LayoutSheet routeTitle={title} needPadding={false} hideLayerSheet={hideLayerSheet}>

          {/* NEED PADDING MY INPUT BOXES NOT TAKING PADDING */}
          <div className="flex flex-col" style={{ paddingBottom: isKeypadOpen ? keypadHeight : 0 }}>
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

              <div className="mt-6 mb-6 w-full" ref={otpInputRef} onClick={openKeypad}>
                <OTPInput value={code} maxLength={MAX_CODE_LENGTH} onPress={openKeypad} />
              </div>

              <ButtonComponent  
                title={isVerifying ? 'Verifying...' : 'Continue'}
                onClick={handleContinue}
                disabled={!isCodeComplete || isVerifying}
              />
            </div>
          </div>
          <div ref={keypadRef} className="w-full fixed bottom-0 left-0 py-2 ">
            <OTPKeypad onKeyPress={handleKeyPress} />
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
