'use client'

import { useState, useCallback, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { CheckCircle2, Mail, Shield, Check } from 'lucide-react'

import { SheetContainer, Button, OTPInput, OTPKeypad } from '@/components/ui'
import { routes } from '@/lib/routes'

const MAX_OTP_LENGTH = 6

type Step = 'otp' | 'success'

export default function RegisterNewEmailScreen() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('otp')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    const storedEmail = localStorage.getItem('kyc_email')
    if (storedEmail) {
      setEmail(storedEmail)
    }
  }, [])

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
    setStep('success')
  }

  const handleFinish = () => {
    localStorage.setItem('user', 'true')
    localStorage.setItem('kyc_completed', 'true')
    localStorage.setItem('kyc_email', email)
    localStorage.setItem('kyc_timestamp', new Date().toISOString())
    router.replace(routes.instacard)
  }

  if (step === 'success') {
    return (
      <div className="h-fit flex flex-col">
        <SheetContainer>
          <div className="flex flex-col items-center justify-center p-6 py-10 gap-6 text-center">
            {/* Success Icon with glow effect */}
            <div className="w-full flex relative flex-col items-center justify-start animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <div className="w-full bg-white/60 backdrop-blur-xl rounded-2xl border-text-secondary/20 space-y-4 py-6 z-5 relative border p-4 text-center mt-4">
                <h1 className="text-lg font-semibold text-text-primary">
                  Registration Successful!
                </h1>
                <p className="text-sm text-text-secondary leading-relaxed max-w-[280px] mx-auto">
                  Your email <span className="font-semibold">{email}</span> has been verified and registered successfully.
                </p>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="w-full space-y-3 mt-4">
              <div className="flex items-center gap-3 p-3 bg-success/5 rounded-xl border border-success/20">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Email Verified</p>
                  <p className="text-xs text-text-secondary">Your email has been confirmed</p>
                </div>
                <Check className="w-5 h-5 text-success ml-auto shrink-0" />
              </div>

              <div className="flex items-center gap-3 p-3 bg-success/5 rounded-xl border border-success/20">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-text-primary">Account Secured</p>
                  <p className="text-xs text-text-secondary">Ready to use Instacard</p>
                </div>
                <Check className="w-5 h-5 text-success ml-auto shrink-0" />
              </div>
            </div>
          </div>
          <div className="p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
            <Button fullWidth onClick={handleFinish}>
              Go to Instacard
            </Button>
          </div>

        </SheetContainer>
      </div>
    )
  }

  return (
    <div className="h-fit flex flex-col">
      <SheetContainer>
        <div className="flex flex-col">
          <div className="flex flex-col justify-center px-5 py-10 text-center gap-3">
            <h2 className="text-xl font-semibold text-text-primary">
              Verify Your Email
            </h2>
            <p className="text-sm text-text-primary">
              We have sent a 6-digit verification code to
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {email}
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
        <div className="w-full fixed bottom-0 left-0 py-2">
          <OTPKeypad onKeyPress={handleKeyPress} />
        </div>
      </SheetContainer>
    </div>
  )
}
