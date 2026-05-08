'use client';

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import type { UserInstaCardSteps } from '@/types/userVerificationSteps';
import {  resendEmailOtp, sendBankOtp, verifyEmailOtp } from '@/lib/api/cards';
import { MOCK_HOST_CONTEXT } from '@/lib/api/__mocks__/hostContext';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import {
  selectCardRequestEmail,
  selectCardRequestId,
  setBankOtpSent,
  setEmailOtpVerified,
} from '@/store/redux/slices/cardRequestSlice';
import { showToast } from '@/store/redux/slices/toasterSlice';
import { ApiError } from '@/lib/api/errors';

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

  const handleResend = async () => {
    if (!requestId) {
      throw new Error('Card request not initialised. Please restart the flow.');
    }

    try {
      await resendEmailOtp({ requestId, ...MOCK_HOST_CONTEXT });
      dispatch(showToast({
        message: 'OTP sent successfully',
        subtitle: 'Please check your email for the OTP',
        duration: 2000,
        tosterType: 'success',
      }))
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        dispatch(showToast({
          message: 'Retry after some time',
          subtitle: 'Something went wrong!',
          duration: 2000,
          tosterType: 'error',
        }))
        return
      }
      throw err
    }
  };

  return (
    <VerificationCodeScreen
      title="Verify OTP"
      subtitle="We have sent you a 6-digit code to your"
      maskedValue={registeredEmail ?? ''}
      onVerify={handleVerify}
      onResend={handleResend}
      onSuccess={handleSuccess}
      initialResendCooldownSeconds={30}
    />
  );
}
