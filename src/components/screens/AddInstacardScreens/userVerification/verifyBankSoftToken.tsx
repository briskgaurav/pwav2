'use client';

import VerifySoftTokenScreen from '@/components/screens/AuthScreens/VerifySoftTokenScreen';
import { verifySoftTokenV2 } from '@/lib/api/cardJourneyApi';
import { useCardJourney } from '@/hooks/useCardJourney';

/**
 * Soft token entry screen.
 *
 * On success the backend returns the next envelope and `useCardJourney.call()`
 * dispatches it — the router re-renders automatically.
 */
export default function VerifyBankSoftToken() {
  const { state, call } = useCardJourney();

  const requestId = state?.requestId ?? '';

  const handleVerify = async (code: string) => {
    if (!requestId) {
      throw new Error('Card request not initialised. Please restart the flow.');
    }
    await call(() => verifySoftTokenV2(requestId, code));
  };

  const handleSuccess = () => {
    // No-op: useCardJourney.call() already dispatched the new state.
  };

  return (
    <VerifySoftTokenScreen
      title="Verify Soft Token"
      subtitle="Enter the 6-digit code from your bank's authenticator app"
      onVerify={handleVerify}
      onSuccess={handleSuccess}
    />
  );
}
