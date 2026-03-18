'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import VerificationCodeScreen from '@/features/verification/components/VerificationCodeScreen'
import { SheetContainer, Button } from '@/components/ui'
import { routes } from '@/lib/routes'
import { CheckCircle2 } from 'lucide-react'

type VerificationMethod = 'email' | 'phone' | 'bvn'
type Step = 'otp' | 'success'

export default function RegistrationVerificationOtpPage() {
  const router = useRouter()
  const [method, setMethod] = useState<VerificationMethod | null>(null)
  const [step, setStep] = useState<Step>('otp')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('kyc_verification_method') as VerificationMethod | null
    setMethod(stored)
  }, [])

  if (!method) {
    // Fallback UI while loading or if method is missing
    return null
  }

  if (step === 'success') {
    return (
      <div className="h-fit flex flex-col">
        <SheetContainer>
          <div className="flex-1 flex flex-col items-center justify-center p-6 py-10 gap-6 text-center">
            <div className="w-full flex relative flex-col items-center justify-start animate-scale-in">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <div className="w-full bg-white/60 backdrop-blur-xl rounded-2xl border-text-secondary/20 space-y-4 py-6 z-5 relative border p-4 text-center mt-4">
                <h1 className="text-lg font-semibold text-text-primary">
                  Verification Successful!
                </h1>
                <p className="text-sm text-text-secondary leading-relaxed max-w-[280px] mx-auto">
                  Your details have been verified. You can now continue to complete your KYC.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
            <Button fullWidth onClick={() => router.push(routes.registrationAcceptTerms)}>
              Continue
            </Button>
          </div>
        </SheetContainer>
      </div>
    )
  }

  let title = ''
  let subtitle = ''
  let maskedValue = ''

  switch (method) {
    case 'email':
      title = 'Verify your Email'
      subtitle = 'We have sent a 6-digit code to your registered email'
      maskedValue = 'nird***malik@gmail.com'
      break
    case 'phone':
      title = 'Verify your Phone Number'
      subtitle = 'We have sent a 6-digit code to your registered phone number'
      maskedValue = '+234802**** 0955'
      break
    case 'bvn':
      title = 'Verify your BVN'
      subtitle = 'We have sent a 6-digit code linked to your BVN'
      maskedValue = '****5678901'
      break
  }

  return (
    <VerificationCodeScreen
      title={title}
      subtitle={subtitle}
      maskedValue={maskedValue}
      successRoute={routes.registrationAcceptTerms}
      showKeypad
      onSuccess={() => setStep('success')}
    />
  )
}

