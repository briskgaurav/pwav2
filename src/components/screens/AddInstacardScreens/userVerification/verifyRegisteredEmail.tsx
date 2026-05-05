'use client';

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import type { UserInstaCardSteps } from '@/types/userVerificationSteps';
import { sendBankOtp, verifyEmailOtp } from '@/lib/api/cards';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import {
  selectCardRequestEmail,
  selectCardRequestId,
  setBankOtpSent,
  setEmailOtpVerified,
} from '@/store/redux/slices/cardRequestSlice';

interface VerifyRegisteredEmailProps {
  onNext: (nextStep: UserInstaCardSteps) => void;
}

export default function VerifyRegisteredEmail({
  onNext,
}: VerifyRegisteredEmailProps) {
  const dispatch = useAppDispatch();
  const requestId = useAppSelector(selectCardRequestId);
  const registeredEmail = useAppSelector(selectCardRequestEmail);

  const handleVerify = async (code: string) => {
    if (!requestId || !registeredEmail) {
      throw new Error('Card request not initialised. Please restart the flow.');
    }

    // 1) Verify the email OTP. Backend returns 400 on invalid OTP, which
    //    fetchWithAuth surfaces as an ApiError — VerificationCodeScreen
    //    catches it and shows the message under the input.
    const verifyResponse = await verifyEmailOtp({
      requestId,
      registeredEmail,
      otp: code,
    });
    dispatch(setEmailOtpVerified({
      emailOtpMatchStatus: verifyResponse.otpMatchStatus,
    }));

    // 2) Email is verified — now trigger the bank OTP. /bank-otp/send is
    //    the source of truth for bank channel info; we ignore any bank
    //    fields the verify response may include. If this call fails, the
    //    error surfaces on this screen rather than the next.
    const sendResponse = await sendBankOtp({ requestId });
    dispatch(setBankOtpSent({
      bankOtpDestination: sendResponse.bankOtpDestination,
      bankOtpChannel: sendResponse.bankOtpChannel,
      bankOtpStatus: sendResponse.otpStatus,
    }));
  };

  const handleSuccess = () => {
    onNext('bank_verification');
  };

  // No backend endpoint for email-OTP resend yet — mocked.
  // TODO: wire to real endpoint once backend ships it.
  const handleResend = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  };

  return (
    <VerificationCodeScreen
      title="Verify OTP"
      subtitle="We have sent you a 6-digit code to your"
      maskedValue={registeredEmail ?? ''}
      showKeypad={true}
      onVerify={handleVerify}
      onResend={handleResend}
      onSuccess={handleSuccess}
    />
  );
}
