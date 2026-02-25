import VerificationCodeScreen from '@/features/verification/components/VerificationCodeScreen'
import { routes } from '@/lib/routes'

export default function EmailVerifyGiftPage() {
  return (
    <VerificationCodeScreen
    showKeypad
      title="Verify your Registered Email"
      subtitle="We have sent you a 6-digit code to your Registered Email"
      maskedValue="******@gmail.com"
      successRoute={routes.giftCardActivation}
    />
  )
}
