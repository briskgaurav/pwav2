'use client';

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import { verifyEmailOtpV2, retryEmailOtp } from '@/lib/api/cardJourneyApi';
import { useCardJourney } from '@/hooks/useCardJourney';
import { useAppDispatch } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';
import { ApiError } from '@/lib/api/errors';

export default function VerifyRegisteredEmail() {
  const dispatch = useAppDispatch();
  const { state, call } = useCardJourney();

  const requestId = state?.requestId ?? '';
  const maskedEmail = state?.nextAction?.destinationMasked ?? '';

  const handleVerify = async (code: string) => {
    if (!requestId) {
      throw new Error('Card request not initialised. Please restart the flow.');
    }
    await call(() => verifyEmailOtpV2(requestId, code));
  };

  const handleResend = async () => {
    if (!requestId) {
      throw new Error('Card request not initialised. Please restart the flow.');
    }
    try {
      await call(() => retryEmailOtp(requestId));
      dispatch(showToast({
        message: 'OTP sent successfully',
        subtitle: 'Please check your email for the OTP',
        duration: 2000,
        tosterType: 'success',
      }));
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        dispatch(showToast({
          message: 'Retry after some time',
          subtitle: 'Something went wrong!',
          duration: 2000,
          tosterType: 'error',
        }));
        return;
      }
      throw err;
    }
  };

  return (
    <VerificationCodeScreen
      title="Verify OTP"
      subtitle="We have sent you a 6-digit code to your"
      maskedValue={maskedEmail}
      onVerify={handleVerify}
      onResend={handleResend}
      initialResendCooldownSeconds={30}
    />
  );
}
