'use client';

import React, { useState } from 'react';
import { useCardLinkJourney } from '@/hooks/useCardLinkJourney';
import { provideUcPan } from '@/lib/api/cardLinkApi';
import { useAppDispatch } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';
import Image from 'next/image';
import { ICONS } from '@/constants/icons';
import formatCardNumber from '@/lib/formated-card-number';
import { Button } from '@/components/ui';

/**
 * UC PAN entry screen — driven by `nextAction.code === 'PROVIDE_UC_PAN'`.
 *
 * Input-only (no QR scan). The user enters the full UC PAN via a
 * formatted input field. On submission:
 * - The PAN is sent to `/provide-uc-pan`
 * - The input and in-memory copy are immediately cleared (PAN security)
 * - Backend transitions to `SETUP_UC_PIN` or `UC_NOT_AVAILABLE`
 */
export default function UcPanEntryScreen() {
  const { state, call } = useCardLinkJourney();
  const dispatch = useAppDispatch();
  const [cardNumber, setCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestId = state?.requestId ?? '';

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '').slice(0, 19);
    setCardNumber(formatCardNumber(rawValue));
  };

  const rawDigits = cardNumber.replace(/\D/g, '');
  const isValid = rawDigits.length >= 12 && rawDigits.length <= 19;

  const handleSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);

    try {
      await call(() => provideUcPan(requestId, rawDigits));
      // PAN security: clear the input immediately after successful submission
      setCardNumber('');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'errorMessage' in err
          ? (err as { errorMessage: string }).errorMessage
          : 'Failed to submit card number. Please try again.';
      dispatch(
        showToast({
          message: 'Submission Failed',
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
        <div className="h-auto w-full relative">
          <Image
            src="/img/cards/universal.png"
            alt="Universal Card"
            width={1000}
            height={1000}
            className="h-full w-full object-contain"
          />
        </div>

        <p className="text-sm text-text-secondary text-center">
          {state?.nextAction?.message || 'Enter the card number of the Universal Card you want to link'}
        </p>

        <div className="flex flex-col items-start justify-start w-full mt-4">
          <p className="text-sm text-left text-text-primary">Universal Card Number</p>
          <div className="w-full mt-3 p-4 border border-text-primary/20 rounded-2xl flex items-center justify-between">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={23}
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              className="flex-1 outline-none focus:outline-none active:outline-none focus:border-none active:border-none ring-0 focus:ring-none border-none bg-transparent text-text-primary focus-visible:ring-0 focus-visible:outline-none! focus-visible:ring-offset-0"
              onChange={handleCardNumberChange}
            />
            <div className="flex items-center gap-4">
              <Image
                src={ICONS.mastercard}
                alt="Mastercard"
                width={40}
                height={24}
                className="object-contain h-4 w-auto"
              />
            </div>
          </div>
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
          disabled={!isValid || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'Submitting...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
