'use client';

import { useState } from 'react';
import { useCardLinkJourney } from '@/hooks/useCardLinkJourney';
import { selectUc } from '@/lib/api/cardLinkApi';
import { useAppDispatch } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';
import { Button } from '@/components/ui';
import type { UcListItem } from '@/types/cardLinking';

/**
 * UC Picker screen — driven by `nextAction.code === 'SELECT_UC_FROM_LIST'`.
 *
 * Renders `response.ucList` for the user to select an existing Universal Card.
 * Journey A only — when the backend finds UCs for this customer after VC PIN verify.
 */
export default function UcPickerScreen() {
  const { state, call } = useCardLinkJourney();
  const dispatch = useAppDispatch();
  const [selectedUcId, setSelectedUcId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestId = state?.requestId ?? '';
  const ucList: UcListItem[] = state?.ucList ?? [];

  const handleContinue = async () => {
    if (!selectedUcId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await call(() => selectUc(requestId, selectedUcId));
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'errorMessage' in err
          ? (err as { errorMessage: string }).errorMessage
          : 'Failed to select Universal Card. Please try again.';
      dispatch(
        showToast({
          message: 'Selection Failed',
          subtitle: message,
          duration: 3000,
          tosterType: 'error',
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start p-6 py-10 gap-4 overflow-auto">
        <h2 className="text-xl font-semibold text-text-primary">
          Select Universal Card
        </h2>
        <p className="text-sm text-text-secondary text-center">
          {state?.nextAction?.message || 'Choose a Universal Card to link with your Virtual Card'}
        </p>

        <div className="flex flex-col items-start justify-start w-full mt-4 space-y-3">
          {ucList.length === 0 && (
            <p className="text-sm text-text-secondary text-center w-full py-4">
              No Universal Cards available
            </p>
          )}

          {ucList.map((uc) => (
            <button
              key={uc.ucCardId}
              onClick={() => setSelectedUcId(uc.ucCardId)}
              className={`w-full p-4 border rounded-2xl flex items-center gap-3 transition-all ${
                selectedUcId === uc.ucCardId
                  ? 'border-text-primary border-2'
                  : 'border-text-primary/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedUcId === uc.ucCardId ? 'border-primary bg-primary' : 'border-text-primary/40'
                }`}
              >
                {selectedUcId === uc.ucCardId && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm text-text-primary">
                  {uc.ucPanMasked}
                </span>
                <span className="text-xs text-text-secondary">
                  {uc.scheme} • {uc.status}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: '8px 16px 24px',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
        }}
      >
        <Button
          fullWidth
          disabled={!selectedUcId || isSubmitting}
          onClick={handleContinue}
        >
          {isSubmitting ? 'Selecting...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
