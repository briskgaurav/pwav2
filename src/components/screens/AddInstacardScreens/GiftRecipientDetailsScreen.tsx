'use client';

import { useState } from 'react';
import { useCardJourney } from '@/hooks/useCardJourney';
import { submitGiftRecipientDetails } from '@/lib/api/cardJourneyApi';
import ButtonComponent from '@/components/ui/ButtonComponent';
import { useAppDispatch } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';

/**
 * Gift card recipient details form — driven by
 * `nextAction.code === 'CAPTURE_RECIPIENT_DETAILS'`.
 *
 * Collects: recipientName, recipientEmail, giftAmountMinor, giftMessage.
 */
export default function GiftRecipientDetailsScreen() {
  const { state, call } = useCardJourney();
  const dispatch = useAppDispatch();
  const requestId = state?.requestId ?? '';

  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftAmount, setGiftAmount] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!recipientName.trim()) errs.push('Recipient name is required');
    if (!recipientEmail.trim() || !recipientEmail.includes('@')) errs.push('Valid email is required');
    const amount = parseFloat(giftAmount);
    if (isNaN(amount) || amount <= 0) errs.push('Amount must be greater than 0');
    if (giftMessage.length > 500) errs.push('Message must be 500 characters or less');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !requestId || submitting) return;

    setSubmitting(true);
    try {
      const amountMinor = Math.round(parseFloat(giftAmount) * 100);
      await call(() =>
        submitGiftRecipientDetails(requestId, {
          recipientName: recipientName.trim(),
          recipientEmail: recipientEmail.trim(),
          giftAmountMinor: amountMinor,
          giftCurrency: 'NGN',
          giftMessage: giftMessage.trim() || undefined,
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      dispatch(showToast({
        message: 'Could not save details',
        subtitle: err?.errorMessage || 'Please try again.',
        duration: 3000,
        tosterType: 'error',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto p-6 py-10 space-y-5">
        <h2 className="text-lg font-semibold text-text-primary">Gift Card Details</h2>
        <p className="text-sm text-text-secondary">
          Enter the recipient&apos;s details for the gift card.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-primary font-medium block mb-1">Recipient Name</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full border border-text-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm text-text-primary font-medium block mb-1">Recipient Email</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full border border-text-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm text-text-primary font-medium block mb-1">Gift Amount (₦)</label>
            <input
              type="number"
              value={giftAmount}
              onChange={(e) => setGiftAmount(e.target.value)}
              placeholder="500.00"
              min="0"
              step="0.01"
              className="w-full border border-text-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm text-text-primary font-medium block mb-1">
              Message <span className="text-text-secondary">(optional, max 500 chars)</span>
            </label>
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="Happy birthday!"
              maxLength={500}
              rows={3}
              className="w-full border border-text-primary/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
            />
            <p className="text-xs text-text-secondary text-right mt-1">{giftMessage.length}/500</p>
          </div>

          {errors.length > 0 && (
            <div className="space-y-1">
              {errors.map((err, i) => (
                <p key={i} role="alert" className="text-sm text-red-600">{err}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          padding: '8px 16px 24px',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
        }}
      >
        <ButtonComponent
          title={submitting ? 'Submitting…' : 'Continue'}
          onClick={handleSubmit}
          disabled={submitting}
        />
      </div>
    </div>
  );
}
