'use client';

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import type { UserVerificationSteps } from '@/types/userVerificationSteps';

interface VerifyBankOTPProps {
  onNext: (nextStep: UserVerificationSteps) => void;
}


export default function VerifyBankOTP({
  onNext,
}: VerifyBankOTPProps) {

  const handleSuccess = () => {
    // Move to the user consent step
  }

  return (
    <VerificationCodeScreen
      title="Verify Bank OTP"
      subtitle="Your bank has sent you a 6-digit code to your phone"
      maskedValue="+918800670414"
      showKeypad={true}
      onVerify={(code: string) => {
        return new Promise((resolve, reject) => {
          console.log("I am verifying the OTP code:", code);

          // Example success response
          resolve();

          // Example failure
          // reject(new Error("Invalid OTP"));
        });
      }}
      onSuccess={handleSuccess}
    />

  );
}