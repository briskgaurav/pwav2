'use client';

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import { verifyBankOtpV2, sendBankOtpV2, retryBankOtp } from '@/lib/api/cardJourneyApi';
import { useCardJourney } from '@/hooks/useCardJourney';

/**
 * Bank OTP entry screen.
 *
 * Reads `requestId` and `destinationMasked` from the Redux card-request state.
 * On success the backend returns the next envelope (consent, eligibility, etc.)
 * and `useCardJourney.call()` dispatches it — the router re-renders automatically.
 */
export default function VerifyBankOTP() {
  const { state, call } = useCardJourney();

  const requestId = state?.requestId ?? '';
  const destination = state?.nextAction?.destinationMasked ?? '';

  const handleVerify = async (code: string) => {
    if (!requestId) {
      throw new Error('Card request not initialised. Please restart the flow.');
    }
    await call(() => verifyBankOtpV2(requestId, code));
  };

  const handleResend = async () => {
    if (!requestId) {
      throw new Error('Card request not initialised. Please restart the flow.');
    }
    await call(() => retryBankOtp(requestId));
  };

  const handleSuccess = () => {
    // No-op: useCardJourney.call() already dispatched the new state.
  };

  return (
    <VerificationCodeScreen
      title="Verify Bank OTP"
      subtitle="Your bank has sent you a 6-digit code to"
      maskedValue={destination}
      onVerify={handleVerify}
      onResend={handleResend}
      onSuccess={handleSuccess}
    />
  );
}
