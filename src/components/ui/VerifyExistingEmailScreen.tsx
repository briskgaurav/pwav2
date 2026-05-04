'use client'

import { useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { SheetContainer, Button, OTPInput, OTPKeypad } from '@/components/ui'
import { routes } from '@/lib/routes'

const MAX_OTP_LENGTH = 6

export default function VerifyExistingEmailScreen() {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  const existingEmail =
    typeof window !== 'undefined'
      ? localStorage.getItem('kyc_email') ?? 'your registered email'
      : 'your registered email'

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'del') {
      setOtp((prev) => prev.slice(0, -1))
      return
    }
    setOtp((prev) => {
      if (prev.length >= MAX_OTP_LENGTH) return prev
      return `${prev}${key}`
    })
  }, [])

  const handleVerifyOtp = async () => {
    setIsVerifying(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsVerifying(false)
    router.replace(routes.registrationWithExistingEmailSuccess)
  }

  return (
    <div className="h-screen flex flex-col">
      <SheetContainer>
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col justify-center px-5 py-10 text-center gap-3">
            <h2 className="text-xl font-semibold text-text-primary">
              Verify Your Email
            </h2>
            <p className="text-sm text-text-primary">
              We have sent a 6-digit verification code to
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {existingEmail}
            </p>
            <p className="text-sm text-text-primary">
              Please check your inbox and enter it here
            </p>

            <div className="mt-6 mb-6 w-full">
              <OTPInput value={otp} maxLength={MAX_OTP_LENGTH} />
            </div>

            <Button
              fullWidth
              onClick={handleVerifyOtp}
              disabled={otp.length < MAX_OTP_LENGTH || isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>

            <p className="mt-3 text-sm">
              Didn&apos;t receive the code?{' '}
              <button
                onClick={() => setOtp('')}
                className="bg-transparent border-none text-primary font-semibold cursor-pointer p-0 text-sm"
                type="button"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
        <div className="w-full mt-auto">
          <OTPKeypad onKeyPress={handleKeyPress} />
        </div>
      </SheetContainer>
    </div>
  )
}

