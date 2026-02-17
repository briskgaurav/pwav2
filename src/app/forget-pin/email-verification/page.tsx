import VerificationCodeScreen from '@/features/verification/components/VerificationCodeScreen'

export default function EmailVerificationPage() {
  return (
    <VerificationCodeScreen
      title="Verify your Registered Email"
      subtitle="We have sent you a 6-digit code to your Registered Email"
      maskedValue="******@gmail.com"
      successRoute="/forget-pin/create-pin"
    />
  )
}
