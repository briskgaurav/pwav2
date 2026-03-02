'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import CardPinAuth from '@/features/card-detail/components/CardPinAuth'
import VerificationCodeScreen from '@/features/verification/components/VerificationCodeScreen'
import SuccessScreen from '@/features/success/components/SuccessScreen'
import { routes } from '@/lib/routes'

type LinkVirtualStep = 'pin' | 'emailOtp' | 'phoneOtp' | 'success'

export default function LinkVirtualCardScreen() {
  const router = useRouter()
  const [step, setStep] = useState<LinkVirtualStep>('pin')

  if (step === 'pin') {
    return (
      <CardPinAuth
        title="Enter PIN for Selected Instacard"
        cardImageSrc="/img/debitmockup.png"
        maskedNumber="0000 0000 0000 0000"
        onVerified={() => setStep('emailOtp')}
      />
    )
  }

  if (step === 'emailOtp') {
    return (
      <VerificationCodeScreen
        key="emailOtp"
        title="Verify your Registered Email"
        subtitle="We have sent you a 6-digit code to your Registered Email"
        maskedValue="******@gmail.com"
        successRoute={routes.home}
        showKeypad
        onSuccess={() => setStep('phoneOtp')}
      />
    )
  }

  if (step === 'phoneOtp') {
    return (
      <VerificationCodeScreen
        key="phoneOtp"
        title="Verify your Phone Number"
        subtitle="We have sent you a 6-digit code to your Registered Phone Number"
        maskedValue="+234802****0955"
        successRoute={routes.home}
        showKeypad
        onSuccess={() => setStep('success')}
      />
    )
  }

  // Success
  return (
    <SuccessScreen
      title="Virtual Card Linked Successfully"
      description="Your Virtual Instacard has been successfully linked. You can now use it via your physical Instacard."
      buttonText="Done"
      onButtonClick={() => router.push(routes.home)}
      showCardPreview={false}
    />
  )
}
