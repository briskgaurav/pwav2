import VerificationCodeScreen from '@/features/verification/components/VerificationCodeScreen'

export default function PhoneVerificationPage() {
  return (
    <VerificationCodeScreen
      title="Verify your Phone Number"
      subtitle="We have sent you a 6-digit code to your Registered Phone Number"
      maskedValue="+234802**** 0955"
      successRoute="/forget-pin/create-pin"
    />
  )
}
