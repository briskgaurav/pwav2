'use client';

import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui';
import { notifyNavigation } from '@/lib/bridge';
import LayoutSheet from '../../ui/LayoutSheet';
import ButtonComponent from '../../ui/ButtonComponent';
import { submitConsentV2 } from '@/lib/api/cardJourneyApi';
import { useCardJourney } from '@/hooks/useCardJourney';
import { useAppDispatch } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';

const TERMS = [
  'Issuance Fee - N 500',
  'Gift cards are non-refundable and cannot be exchanged for cash',
  'Valid for 12 months from date of purchase',
  'Can be used at any participating merchant',
  'Lost or stolen cards cannot be replaced',
  'Minimum load amount - N 1,000 | Maximum load amount - N 500,000',
] as const;

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'errorMessage' in error) {
    const message = (error as { errorMessage?: unknown }).errorMessage;
    if (typeof message === 'string') return message;
  }

  if (error instanceof Error) return error.message;
  return 'Please try again.';
};

export default function GiftCardConsent() {
  const { state, call } = useCardJourney();
  const dispatch = useAppDispatch();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const requestId = state?.requestId ?? '';
  const consentVersion = state?.consentVersion ?? 'v1';

  useEffect(() => {
    notifyNavigation('add-gift');
  }, []);

  const handleNext = async () => {
    if (!requestId || submitting) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      await call(() => submitConsentV2(requestId, consentVersion));
    } catch (err) {
      const message = getErrorMessage(err);
      setSubmitError(message);
      dispatch(showToast({
        message: 'Submission Failed',
        subtitle: message,
        duration: 3000,
        tosterType: 'error',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LayoutSheet routeTitle="Add Gift Card" needPadding={false} hideLayerSheet>
      <div className="flex-1 overflow-auto py-10 p-6">
        <div className="flex flex-col gap-5">
          <p className="text-md text-text-primary">
            Please agree on following T&amp;C for Gift Instacard
          </p>

          <ul className="flex flex-col gap-[6px] m-0 pl-5 list-disc">
            {TERMS.map((term) => (
              <li key={term} className="text-sm">
                {term}
              </li>
            ))}
          </ul>

          <Checkbox
            label="I agree to the above terms & conditions. Please process my gift card"
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
          />

          {submitError && (
            <p role="alert" className="text-sm text-red-600">
              {submitError}
            </p>
          )}
        </div>
      </div>

      <ButtonComponent
        title={submitting ? 'Submitting...' : 'Continue'}
        onClick={handleNext}
        disabled={!acceptedTerms || submitting}
      />
    </LayoutSheet>
  );
}
