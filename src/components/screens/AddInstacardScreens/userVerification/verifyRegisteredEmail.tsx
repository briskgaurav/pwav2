'use client';

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import type { UserVerificationSteps } from '@/types/userVerificationSteps';

interface VerifyRegisteredEmailProps {
  onNext: (nextStep: UserVerificationSteps) => void;
}


export default function VerifyRegisteredEmail({
  onNext,
}: VerifyRegisteredEmailProps) {

  const handleSuccess = () => {
    onNext('bank_verification')
  }

  return (
    <VerificationCodeScreen
      title="Verify OTP"
      subtitle="We have sent you a 6-digit code to your"
      maskedValue="test@montra.org"
      showKeypad={true}
      // onVerify={(code: string) => {
      //   return new Promise((resolve, reject) => {
      //     console.log("I am verifying the OTP code:", code);

      //     // Example success response
      //     resolve();

      //     // Example failure
      //     // reject(new Error("Invalid OTP"));
      //   });
      // }}
      onSuccess={handleSuccess}
    />

  );
}