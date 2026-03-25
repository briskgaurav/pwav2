import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen'
import { routes } from '@/lib/routes'

export default function VerifyMobilePage() {
  return (
    <VerificationCodeScreen
      title="Verify your Phone Number"
      subtitle="We have sent you a 6-digit code to your Registered Phone Number"
      maskedValue="+234802**** 0955"
      successRoute={routes.addUniversalVerifyEmail}
      showKeypad
    />
  )
}
