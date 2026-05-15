'use client';

import { useState } from 'react';
import { useCardJourney } from '@/hooks/useCardJourney';
import { submitGiftRecipientDetails } from '@/lib/api/cardJourneyApi';
import { useAppDispatch } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';
import { setGiftRecipientDetails } from '@/store/redux/slices/cardRequestSlice';
import LayoutSheet from '@/components/ui/LayoutSheet';
import { Button } from '@/components/ui';
import { AddMoneyForm } from '@/components/ui/AddMoneyForm';
import { GiftCardHeader } from '@/components/ui/GiftCardHeader';
import { GiftRecipientDetails } from '@/components/ui/GiftRecipientDetails';

interface ValidationErrors {
  recipientName?: string;
  recipientEmail?: string;
  amount?: string;
  giftMessage?: string;
}

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const parseAmount = (amount: string): number => Number.parseFloat(amount.replace(/,/g, ''));

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'errorMessage' in error) {
    const message = (error as { errorMessage?: unknown }).errorMessage;
    if (typeof message === 'string') return message;
  }

  if (error instanceof Error) return error.message;
  return 'Please try again.';
};

/**
 * Gift card recipient details form - driven by
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
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (): boolean => {
    const errs: ValidationErrors = {};

    if (!recipientName.trim()) {
      errs.recipientName = 'Recipient name is required';
    } else if (recipientName.trim().length < 2) {
      errs.recipientName = 'Recipient name must be at least 2 characters';
    }

    if (!recipientEmail.trim()) {
      errs.recipientEmail = 'Recipient email is required';
    } else if (!validateEmail(recipientEmail.trim())) {
      errs.recipientEmail = 'Please enter a valid email address';
    }

    const amount = parseAmount(giftAmount);
    if (!giftAmount.trim()) {
      errs.amount = 'Amount is required';
    } else if (Number.isNaN(amount) || amount <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    }

    if (giftMessage.length > 500) {
      errs.giftMessage = 'Message must be 500 characters or less';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRecipientNameChange = (value: string) => {
    setRecipientName(value);
    if (errors.recipientName) {
      setErrors((prev) => ({ ...prev, recipientName: undefined }));
    }
  };

  const handleRecipientEmailChange = (value: string) => {
    setRecipientEmail(value);
    if (errors.recipientEmail) {
      setErrors((prev) => ({ ...prev, recipientEmail: undefined }));
    }
  };

  const handleGiftAmountChange = (value: string) => {
    setGiftAmount(value);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handleGiftMessageChange = (value: string) => {
    setGiftMessage(value);
    if (errors.giftMessage) {
      setErrors((prev) => ({ ...prev, giftMessage: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validate() || !requestId || submitting) return;

    setSubmitting(true);
    try {
      const amountMinor = Math.round(parseAmount(giftAmount) * 100);
      dispatch(setGiftRecipientDetails({
        recipientName: recipientName.trim(),
        recipientEmail: recipientEmail.trim(),
        giftAmount,
        giftAmountMinor: amountMinor,
        giftCurrency: 'NGN',
        giftMessage: giftMessage.trim(),
      }));
      await call(() =>
        submitGiftRecipientDetails(requestId, {
          recipientName: recipientName.trim(),
          recipientEmail: recipientEmail.trim(),
          giftAmountMinor: amountMinor,
          giftCurrency: 'NGN',
          giftMessage: giftMessage.trim() || undefined,
        }),
      );
    } catch (err) {
      dispatch(showToast({
        message: 'Could not save details',
        subtitle: getErrorMessage(err),
        duration: 3000,
        tosterType: 'error',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LayoutSheet routeTitle="Gift a Card" needPadding={false} hideLayerSheet ={true}>
      <div className="flex-1 overflow-auto pb-10 gap-4 p-4 flex flex-col">
        <GiftCardHeader />

        <GiftRecipientDetails
          recipientName={recipientName}
          recipientEmail={recipientEmail}
          recipientMessage={giftMessage}
          onRecipientNameChange={handleRecipientNameChange}
          onRecipientEmailChange={handleRecipientEmailChange}
          onRecipientMessageChange={handleGiftMessageChange}
          errors={errors}
        />

        {errors.giftMessage && (
          <p role="alert" className="text-red-500 text-xs -mt-3 ml-1">
            {errors.giftMessage}
          </p>
        )}

        <AddMoneyForm
          showKycTier={false}
          amount={giftAmount}
          onAmountChange={handleGiftAmountChange}
          onSelectRecommended={handleGiftAmountChange}
          onOpenModal={handleSubmit}
          btnTitle="Proceed to Add Money"
          error={errors.amount}
        />

        <Button
          className="bg-primary text-white rounded-full px-4 py-2 w-full h-14 mt-1"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Continue'}
        </Button>
      </div>
    </LayoutSheet>
  );
}
