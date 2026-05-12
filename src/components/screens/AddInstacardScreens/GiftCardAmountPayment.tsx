'use client';

import { useState } from 'react';
import { routes } from '@/lib/routes'
import { useRouter } from 'next/navigation'

import { useCardJourney } from '@/hooks/useCardJourney';
import { submitGiftRecipientDetails } from '@/lib/api/cardJourneyApi';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';
import { selectGiftRecipientDetails, setCardRequestState, setGiftRecipientDetails } from '@/store/redux/slices/cardRequestSlice';
import type { CardRequestStateResponse } from '@/types/cardIssuance';
import LayoutSheet from '@/components/ui/LayoutSheet';
import { GiftCardHeader } from '@/components/ui/GiftCardHeader';
import { GiftCardMoneyPayment } from '@/components/ui/GiftCardMoneyPayment';
import { GiftAddMoneyBottomSheet } from '@/components/ui/GiftAddMoneyBottomSheet';

interface ValidationErrors {
  recipientName?: string;
  recipientEmail?: string;
  amount?: string;
  giftMessage?: string;
}

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const parseAmount = (amount: string): number => Number.parseFloat(amount.replace(/,/g, ''));

const buildMockGiftCardResponse = (
  state: CardRequestStateResponse | null,
  requestId: string,
): CardRequestStateResponse => ({
  requestId,
  cardType: 'GIFT_CARD',
  currentState: 'CLOSED',
  nextAction: {
    code: 'SHOW_REQUEST_CLOSED',
    message: 'Gift card payment completed successfully.',
  },
  expiresAt: state?.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  cardDetails: {
    cardId: 'MOCK-GIFT-CARD-001',
    vcPanMasked: '**** **** **** 4582',
    cardScheme: 'VISA',
    cardVariant: 'GIFT',
    cardExpiryMmYy: '12/29',
    pinSet: true,
  },
});

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
export default function GiftCardAmountPayment() {

      const router = useRouter()

  const { state, call } = useCardJourney();
  const dispatch = useAppDispatch();
  const savedRecipientDetails = useAppSelector(selectGiftRecipientDetails);
  const requestId = state?.requestId ?? '';
  const [modalOpen, setModalOpen] = useState(false);
  const recipientMessage = savedRecipientDetails?.giftMessage ?? '';

  const [recipientName] = useState(savedRecipientDetails?.recipientName ?? '');
  const [recipientEmail] = useState(savedRecipientDetails?.recipientEmail ?? '');
  const [giftAmount, setGiftAmount] = useState(savedRecipientDetails?.giftAmount ?? '');
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

    if (recipientMessage.length > 500) {
      errs.giftMessage = 'Message must be 500 characters or less';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleGiftAmountChange = (value: string) => {
    setGiftAmount(value);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
  };

  const handlePaymentProcess = () => {
    if (validate()) {
      setModalOpen(true);
    }
  };

  const handleSubmit = async () => {
    if (!validate() || !requestId || submitting) return;

    setModalOpen(false);
    setSubmitting(true);
    try {
      const amountMinor = Math.round(parseAmount(giftAmount) * 100);
      dispatch(setGiftRecipientDetails({
        recipientName: recipientName.trim(),
        recipientEmail: recipientEmail.trim(),
        giftAmount,
        giftAmountMinor: amountMinor,
        giftCurrency: savedRecipientDetails?.giftCurrency ?? 'NGN',
        giftMessage: recipientMessage.trim(),
      }));
      await call(() =>
        submitGiftRecipientDetails(requestId, {
          recipientName: recipientName.trim(),
          recipientEmail: recipientEmail.trim(),
          giftAmountMinor: amountMinor,
          giftCurrency: savedRecipientDetails?.giftCurrency ?? 'NGN',
          giftMessage: recipientMessage.trim() || undefined,
        }),
      );
    } catch (err) {
      dispatch(setCardRequestState(buildMockGiftCardResponse(state, requestId)));
      dispatch(showToast({
        message: 'Using mock gift card data',
        subtitle: getErrorMessage(err),
        duration: 3000,
        tosterType: 'info',
      }));
    } finally {
      setSubmitting(false);
    }

    const params = new URLSearchParams({
      name: recipientName.trim(),
      email: recipientEmail.trim(),
      message: recipientMessage.trim(),
      amount: giftAmount,
    });
    router.replace(`${routes.giftACardReadyToUse}?${params.toString()}`);
  };

  return (
    <LayoutSheet routeTitle="Gift a Card" needPadding={false} hideLayerSheet>
      <div className="flex-1 overflow-auto pb-10 gap-4 p-4 flex flex-col">
        <GiftCardHeader />

        {savedRecipientDetails && (
          <div className="border border-border rounded-2xl px-4 py-4 space-y-2">
            <p className="text-text-primary text-sm font-medium">Recipient Details</p>
            <div className="space-y-1 text-sm text-text-secondary">
              <p>Name: <span className="text-text-primary">{savedRecipientDetails.recipientName}</span></p>
              <p>Email: <span className="text-text-primary">{savedRecipientDetails.recipientEmail}</span></p>
              <p>
                Amount:{' '}
                <span className="text-text-primary">
                  <span className="line-through">N</span> {savedRecipientDetails.giftAmount}
                </span>
              </p>
              {savedRecipientDetails.giftMessage && (
                <p>Message: <span className="text-text-primary">{savedRecipientDetails.giftMessage}</span></p>
              )}
            </div>
          </div>
        )}

        {errors.giftMessage && (
          <p role="alert" className="text-red-500 text-xs -mt-3 ml-1">
            {errors.giftMessage}
          </p>
        )}

        <GiftCardMoneyPayment
          showKycTier={false}
          amount={giftAmount}
          onAmountChange={handleGiftAmountChange}
          onSelectRecommended={handleGiftAmountChange}
          onOpenModal={handlePaymentProcess}
          btnTitle="Proceed to Add Money"
          error={errors.amount}
        />

        {/* <Button
          className="bg-primary text-white rounded-full px-4 py-2 w-full h-14 mt-1"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Continue'}
        </Button> */}
      </div>

      <GiftAddMoneyBottomSheet
        amount={giftAmount}
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleSubmit}
      />

    </LayoutSheet>
  );
}
