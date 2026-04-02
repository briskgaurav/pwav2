'use client'

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen'
import { routes } from '@/lib/routes'
import { useAppSelector } from '@/store/redux/hooks'

export default function EmailVerifyGiftPage() {
  const maskedEmail = useAppSelector((s) => s.user.maskedEmail)
  return (
    <VerificationCodeScreen
      showKeypad
      title="Verify your Registered Email"
      subtitle="We have sent you a 6-digit code to your Registered Email"
      maskedValue={maskedEmail}
      successRoute={routes.claimGiftCardOneTimeActivation}
    />
  )
}
