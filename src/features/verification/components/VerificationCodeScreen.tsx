'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { SheetContainer, OTPInput, OTPKeypad, Button } from '@/components/ui'

const MAX_CODE_LENGTH = 6

type VerificationCodeScreenProps = {
  /** Heading, e.g. "Verify your Registered Email" */
  title: string
  /** Description, e.g. "We have sent you a 6-digit code to your Registered Email" */
  subtitle: string
  /** Masked email/phone, e.g. "nird***malik@gmail.com" */
  maskedValue: string
  /** Route to navigate to on success */
  successRoute: string
  /** Whether to show the on-screen keypad */
  showKeypad?: boolean
}

export default function VerificationCodeScreen({
  title,
  subtitle,
  maskedValue,
  successRoute,
  showKeypad = true,
}: VerificationCodeScreenProps) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

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
    router.push(successRoute)
  }

  const handleResend = () => {
    setCode('')
    // TODO: Implement resend OTP API call
  }

  const isCodeComplete = code.length === MAX_CODE_LENGTH

  if (showKeypad) {
    return (
      <div className="h-screen flex flex-col">
        <SheetContainer>
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col flex-1 items-center justify-center h-full">
              <div className="p-6 flex-1 py-10 px-5 text-center flex flex-col items-center justify-between gap-2">
                <h2 className="text-xl font-semibold text-text-primary m-0">
                  {title}
                </h2>
                <p className="text-sm text-text-primary m-0">
                  {subtitle}
                </p>
                <p className="text-sm leading-none font-semibold text-text-primary m-0">
                  {maskedValue}
                </p>
                <p className="text-sm text-text-primary m-0">
                  Please check your messages and enter it here
                </p>

                <div className="mt-4 mb-5">
                  <OTPInput value={code} maxLength={MAX_CODE_LENGTH} />
                </div>

                <Button
                  className="mt-8"
                  fullWidth
                  onClick={handleContinue}
                  disabled={!isCodeComplete || isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Continue'}
                </Button>

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
          </div>
          <div className="w-full mt-auto">
            <OTPKeypad onKeyPress={handleKeyPress} />
          </div>
        </SheetContainer>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <SheetContainer>
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col flex-1 items-center justify-center h-full">
            <div className="p-6 flex-1 py-10 px-5 text-center flex flex-col items-center gap-2">
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
            <Button
              className="mt-8"
              fullWidth
              onClick={handleContinue}
              disabled={!isCodeComplete || isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Continue'}
            </Button>

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
    </div>
  )
}
