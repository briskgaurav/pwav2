'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { SheetContainer, Checkbox, Button } from '@/components/ui';
import { notifyNavigation } from '@/lib/bridge';
import { routes } from '@/lib/routes';
import LayoutSheet from '../../ui/LayoutSheet';
import ButtonComponent from '../../ui/ButtonComponent';
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { selectCardRequestId, setMaskedPan } from "@/store/redux/slices/cardRequestSlice";
import type { UserInstaCardSteps } from "@/types/userVerificationSteps";
import { creditUnderwriting, submitConsent, type UnderwritingDecision } from "@/lib/api/cards";
import { ApiError, AuthError } from '@/lib/api/errors';

const TERMS = [
  'Issuance Fee - N 1000',
  'Monthly Maintenance Fee - N 50/ month',
  'Minimum monthly repayments to be paid',
  '4% Interest charged monthly on revolving balance',
  'You agree to pay the outstanding amount from your BVN linked accounts',
] as const;

interface PrepaidCardConsentProps {
  onNext: (nextStep: UserInstaCardSteps) => void;
}

export default function PrepaidCardConsent({ onNext }: PrepaidCardConsentProps) {

  const requestId = useAppSelector(selectCardRequestId);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    notifyNavigation('add-prepaid');
  }, []);

  const handleNext = async () => {
    if (!requestId || submitting) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      const response = await submitConsent({
        requestId,
        cardTypeRequest: "PREPAID_CARD",
        consentOnTermsAndConditions: true,
      });

      dispatch(setMaskedPan(response.maskedPan));

      onNext("success");
    } catch (err) {
      if (err instanceof AuthError) {
        setSubmitError("Your session has expired. Please reopen the app.");
      } else if (err instanceof ApiError) {
        setSubmitError("Could not submit your application. Please try again.");
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  //-------------------------
  return (
    <LayoutSheet routeTitle="Add Prepaid Card" needPadding={false} hideLayerSheet={true}>

      <div className="flex-1 overflow-auto py-10  p-6">
        <div className="flex flex-col gap-5">
          <p className="text-md text-text-primary">
            Please agree on following T&amp;C for accessing Credit Instacard
          </p>

          <ul className="flex flex-col gap-[6px] m-0 pl-5 list-disc">
            {TERMS.map((term, index) => (
              <li key={index} className="text-sm">
                {term}
              </li>
            ))}
          </ul>

          <Checkbox
            label="I agree to the above terms & conditions. Please process my application"
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
          />
        </div>
      </div>

      <ButtonComponent title="Apply Now" onClick={handleNext} disabled={!acceptedTerms} />
    </LayoutSheet>
  );
}

