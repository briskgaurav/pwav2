import VerificationCodeScreen from '@/features/verification/components/VerificationCodeScreen'
import { routes } from '@/lib/routes'

export default function VerifyEmailPage() {
  return (
    <VerificationCodeScreen
      title="Verify your Registered Email"
      subtitle="We have sent you a 6-digit code to your Registered Email"
      maskedValue="nird***malik@gmail.com"
      successRoute={routes.linkedSuccess}
      showKeypad
    />
  )
}
