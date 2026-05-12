'use client';

import { useState } from 'react';
import { useCardJourney } from '@/hooks/useCardJourney';
import { submitGiftRecipientCode, submitGiftSenderCode } from '@/lib/api/cardJourneyApi';
import ButtonComponent from '@/components/ui/ButtonComponent';
import { useAppDispatch } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';

interface GiftCodeEntryScreenProps {
  /** Which code to collect: recipient or sender. */
  type: 'recipient' | 'sender';
}

/**
 * Gift code entry screen — driven by:
 *   - `nextAction.code === 'ENTER_RECIPIENT_CODE'`
 *   - `nextAction.code === 'ENTER_SENDER_CODE'`
 *
 * Collects an 8-digit code and submits it.
 */
export default function GiftCodeEntryScreen({ type }: GiftCodeEntryScreenProps) {
  const { state, call } = useCardJourney();
  const dispatch = useAppDispatch();
  const requestId = state?.requestId ?? '';

  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const title = type === 'recipient' ? 'Enter Activation Code' : 'Enter Sender Code';
  const subtitle =
    type === 'recipient'
      ? 'Enter the 8-digit activation code from your email'
      : 'Enter the 8-digit sender code shared with you';

  const handleSubmit = async () => {
    if (!requestId || !code.trim() || submitting) return;

    setSubmitting(true);
    try {
      const submitFn =
        type === 'recipient'
          ? () => submitGiftRecipientCode(requestId, code.trim())
          : () => submitGiftSenderCode(requestId, code.trim());
      await call(submitFn);
    } catch (err: any) {
      dispatch(showToast({
        message: 'Invalid Code',
        subtitle: err?.errorMessage || 'Please check the code and try again.',
        duration: 3000,
        tosterType: 'error',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto p-6 py-10 space-y-6">
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <p className="text-sm text-text-secondary">{subtitle}</p>

        <div>
          <label className="text-sm text-text-primary font-medium block mb-1">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
            placeholder="12345678"
            maxLength={8}
            inputMode="numeric"
            className="w-full border border-text-primary/20 rounded-xl px-4 py-3 text-lg font-mono text-center tracking-[0.3em] focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div
        style={{
          padding: '8px 16px 24px',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
        }}
      >
        <ButtonComponent
          title={submitting ? 'Verifying…' : 'Submit'}
          onClick={handleSubmit}
          disabled={submitting || code.length < 8}
        />
      </div>
    </div>
  );
}
