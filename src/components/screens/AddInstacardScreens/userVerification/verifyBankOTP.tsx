'use client';

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import type { UserInstaCardSteps } from '@/types/userVerificationSteps';
import { sendBankOtp, verifyBankOtp } from '@/lib/api/cards';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import {
  selectCardRequestBankOtpChannel,
  selectCardRequestBankOtpDestination,
  selectCardRequestId,
  setBankOtpSent,
  setBankOtpVerified,
} from '@/store/redux/slices/cardRequestSlice';

interface VerifyBankOTPProps {
  onNext: (nextStep: UserInstaCardSteps) => void;
}

export default function VerifyBankOTP({
  onNext,
}: VerifyBankOTPProps) {
  const dispatch = useAppDispatch();
  const requestId = useAppSelector(selectCardRequestId);
  const destination = useAppSelector(selectCardRequestBankOtpDestination);
  const channel = useAppSelector(selectCardRequestBankOtpChannel);

  const handleVerify = async (code: string) => {
    if (!requestId) {
      throw new Error('Card request not initialised. Please restart the flow.');
    }
    const response = await verifyBankOtp({ requestId, otp: code });
    dispatch(setBankOtpVerified({ bankOtpMatchStatus: response.otpMatchStatus }));
  };

  const handleResend = async () => {
    if (!requestId) {
      throw new Error('Card request not initialised. Please restart the flow.');
    }
    const response = await sendBankOtp({ requestId });
    dispatch(setBankOtpSent({
      bankOtpDestination: response.bankOtpDestination,
      bankOtpChannel: response.bankOtpChannel,
      bankOtpStatus: response.otpStatus,
    }));
  };

  const handleSuccess = () => {
   onNext('user_consent');
  };

  const subtitle = channel === 'EMAIL'
    ? 'Your bank has sent you a 6-digit code to your email'
    : 'Your bank has sent you a 6-digit code to your phone';

  return (
    <VerificationCodeScreen
      title="Verify Bank OTP"
      subtitle={subtitle}
      maskedValue={destination ?? ''}
      showKeypad={true}
      onVerify={handleVerify}
      onResend={handleResend}
      onSuccess={handleSuccess}
    />
  );
}
