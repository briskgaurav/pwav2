'use client';

import { useState } from 'react';
import BankVerificationMethod from './bankVerificationMethod';
import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import type { BankVerifictionMethod, UserVerificationSteps } from '@/types/userVerificationSteps';

interface VerifyBankOTPProps {
  onNext: (nextStep: UserVerificationSteps) => void;
}

export default function VerifyBankOTP({ onNext }: VerifyBankOTPProps) {
  const [UIStep, set_UIStep] = useState<'select' | 'soft_token' | 'otp'> ('select');

  const handleSelect = (selected: BankVerifictionMethod) => {
    set_UIStep(selected as 'soft_token' | 'otp')
  }

  const handleSuccess = () => {
    onNext('complete')  // replace with your actual next step
  }

  return (
    <>
      {/* Step 0 — Choose method */}
      {UIStep === 'select' && (
        <BankVerificationMethod onSelect={handleSelect} />
      )}

      {/* Step 1a — Soft Token screen */}
      {UIStep === 'soft_token' && (
        <VerificationCodeScreen
          title="Verify Soft Token"
          subtitle="Enter the code from your authenticator app"
          maskedValue=""
          showKeypad={true}
          onVerify={async (code) => {
            // 🚧 TEMPORARY
            return;
            // TODO: call soft token verify API
          }}
          onSuccess={handleSuccess}
        />
      )}

      {/* Step 1b — Bank OTP screen */}
      {UIStep === 'otp' && (
        <VerificationCodeScreen
          title="Verify Bank OTP"
          subtitle="Your bank has sent you a 6-digit code to your phone"
          maskedValue="+918800670414"
          showKeypad={true}
          onVerify={async (code) => {
            // 🚧 TEMPORARY
            return;
            // TODO: call bank OTP verify API
          }}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}