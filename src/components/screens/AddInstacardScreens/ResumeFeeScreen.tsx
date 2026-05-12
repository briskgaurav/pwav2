'use client';

import { useState } from 'react';
import { useCardJourney } from '@/hooks/useCardJourney';
import { resumeRequest } from '@/lib/api/cardJourneyApi';
import ButtonComponent from '@/components/ui/ButtonComponent';
import { useAppDispatch } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';

/**
 * Resume / insufficient-balance screen — shown for:
 *   - `RESUME_FROM_FEE_COLLECTION` — backend wants FE to call /resume
 *   - `SHOW_INSUFFICIENT_BALANCE` — user must recharge then retry
 */
export default function ResumeFeeScreen() {
  const { state, call } = useCardJourney();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const requestId = state?.requestId ?? '';
  const actionCode = state?.nextAction?.code;
  const message = state?.nextAction?.message;
  const isInsufficientBalance = actionCode === 'SHOW_INSUFFICIENT_BALANCE';

  const handleResume = async () => {
    if (!requestId || loading) return;
    setLoading(true);
    try {
      await call(() => resumeRequest(requestId));
    } catch (err: any) {
      dispatch(showToast({
        message: 'Could not resume',
        subtitle: err?.errorMessage || 'Please try again.',
        duration: 3000,
        tosterType: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 py-10">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        {isInsufficientBalance ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-3xl">💳</span>
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Insufficient Balance</h2>
            <p className="text-text-secondary">
              {message || "Your account doesn't have enough funds to cover the issuance fee. Please recharge and try again."}
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-3xl">🔄</span>
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Action Required</h2>
            <p className="text-text-secondary">
              {message || "Please click continue to proceed with your card request."}
            </p>
          </>
        )}
      </div>

      <div
        style={{
          padding: '8px 16px 24px',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
        }}
      >
        <ButtonComponent
          title={loading ? "Processing…" : (isInsufficientBalance ? "Retry" : "Continue")}
          onClick={handleResume}
          disabled={loading}
        />
      </div>
    </div>
  );
}
