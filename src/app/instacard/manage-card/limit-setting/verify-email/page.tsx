'use client'

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen'
import { routes } from '@/lib/routes'
import { useAppSelector } from '@/store/redux/hooks'

export default function VerifyEmailPage() {
  const maskedEmail = useAppSelector((s) => s.user.maskedEmail)
  return (
    <VerificationCodeScreen
      title="Verify Email"
      subtitle="We've sent a verification code to your email"
      maskedValue={maskedEmail}
      successRoute={routes.limitSetting}
      showSuccessPopup
      successPopupContent={{
        message: 'Your Payment Limits have been successfully updated',
        buttonText: 'Ok',
      }}
    />
  )
}
