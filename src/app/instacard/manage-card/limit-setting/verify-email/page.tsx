import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen'
import { routes } from '@/lib/routes'
import React from 'react'

export default function page() {
  return (
    <VerificationCodeScreen
      title="Verify Email"
      subtitle="We've sent a verification code to your email"
      maskedValue="nird***malik@gmail.com"
      successRoute={routes.limitSetting}
      showSuccessPopup
      successPopupContent={{
        message: 'Your Payment Limits have been successfully updated',
        buttonText: 'Ok',
      }}
    />
  )
}
