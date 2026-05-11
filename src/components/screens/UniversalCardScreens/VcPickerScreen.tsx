'use client';

import { useState, useMemo } from 'react';
import { useCardLinkJourney } from '@/hooks/useCardLinkJourney';
import { selectVc } from '@/lib/api/cardLinkApi';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';
import { Button } from '@/components/ui';
import Image from 'next/image';
import { CARD_IMAGE_PATHS } from '@/constants/cardData';

/**
 * VC Picker screen — driven by `nextAction.code === 'SELECT_VC_TO_LINK'`.
 *
 * Journey C only — after UC activation, the user selects which VC to link.
 * Shows all virtual cards from the cardWallet Redux slice.
 */

function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, '');
  const lastFour = digits.slice(-4);
  return `**** **** **** ${lastFour}`;
}

export default function VcPickerScreen() {
  const { state, call } = useCardLinkJourney();
  const dispatch = useAppDispatch();
  const allCards = useAppSelector((s) => s.cardWallet.cards);
  const [selectedVcId, setSelectedVcId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestId = state?.requestId ?? '';

  // Show only virtual cards
  const virtualCards = useMemo(
    () => allCards.filter((c) => c.cardForm === 'virtual'),
    [allCards],
  );

  const handleContinue = async () => {
    if (!selectedVcId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await call(() => selectVc(requestId, selectedVcId));
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'errorMessage' in err
          ? (err as { errorMessage: string }).errorMessage
          : 'Failed to select Virtual Card. Please try again.';
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
          Select Virtual Card
        </h2>
        <p className="text-sm text-text-secondary text-center">
          {state?.nextAction?.message || 'Choose a Virtual Card to link with your Universal Card'}
        </p>

        <div className="flex flex-col items-start justify-start w-full mt-4 space-y-3">
          {virtualCards.length === 0 && (
            <p className="text-sm text-text-secondary text-center w-full py-4">
              No Virtual Cards available. Please create a Virtual Card first.
            </p>
          )}

          {virtualCards.map((card) => (
            <button
              key={card.id}
              onClick={() => setSelectedVcId(card.id)}
              className={`w-full p-4 border rounded-2xl flex items-center gap-3 transition-all ${
                selectedVcId === card.id
                  ? 'border-text-primary border-2'
                  : 'border-text-primary/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedVcId === card.id ? 'border-primary bg-primary' : 'border-text-primary/40'
                }`}
              >
                {selectedVcId === card.id && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="w-12 h-8 rounded overflow-hidden shrink-0">
                <Image
                  src={CARD_IMAGE_PATHS[card.imageId]}
                  alt={card.name}
                  width={48}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm text-text-primary">
                  {maskCardNumber(card.cardNumber)}
                </span>
                <span className="text-xs text-text-secondary">
                  {card.name}
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
          disabled={!selectedVcId || isSubmitting}
          onClick={handleContinue}
        >
          {isSubmitting ? 'Selecting...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
