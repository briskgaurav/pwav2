'use client'

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen'
import { routes } from '@/lib/routes'
import { useAppSelector } from '@/store/redux/hooks'

export default function VerifyMobilePage() {
  const maskedMobile = useAppSelector((s) => s.user.maskedMobile)
  return (
    <VerificationCodeScreen
      title="Verify your Phone Number"
      subtitle="We have sent you a 6-digit code to your Registered Phone Number"
      maskedValue={maskedMobile}
      successRoute={routes.addUniversalVerifyEmail}
    />
  )
}
