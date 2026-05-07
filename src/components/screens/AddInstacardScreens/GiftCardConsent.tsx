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
import { submitConsent } from '@/lib/api/cards';
import type { UserInstaCardSteps } from "@/types/userVerificationSteps";
import { ApiError, AuthError } from '@/lib/api/errors';

const TERMS = [
  'Issuance Fee - N 500',
  'Gift cards are non-refundable and cannot be exchanged for cash',
  'Valid for 12 months from date of purchase',
  'Can be used at any participating merchant',
  'Lost or stolen cards cannot be replaced',
  'Minimum load amount - N 1,000 | Maximum load amount - N 500,000',
] as const;

interface GiftCardConsentProps {
  onNext: (nextStep: UserInstaCardSteps) => void;
}

export default function GiftCardConsent({ onNext }: GiftCardConsentProps) {

  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const requestId = useAppSelector(selectCardRequestId);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
  

  useEffect(() => {
    notifyNavigation('add-gift');
  }, []);

    const handleNext = async () => {
      //router.push(routes.otp('gift'));
      if (!requestId || submitting) return;
  
      setSubmitError(null);
      setSubmitting(true);
      try {
        const response = await submitConsent({
          requestId,
          cardTypeRequest: "GIFT_CARD",
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
    <LayoutSheet routeTitle="Add Gift Card" needPadding={false} hideLayerSheet={true}>

      <div className="flex-1 overflow-auto py-10  p-6">
        <div className="flex flex-col gap-5">
          <p className="text-md text-text-primary">
            Please agree on following T&amp;C for Gift Instacard
          </p>

          <ul className="flex flex-col gap-[6px] m-0 pl-5 list-disc">
            {TERMS.map((term, index) => (
              <li key={index} className="text-sm">
                {term}
              </li>
            ))}
          </ul>

          <Checkbox
            label="I agree to the above terms & conditions. Please process my gift card"
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
          />
        </div>
      </div>

      <ButtonComponent title="Continue" onClick={handleNext} disabled={!acceptedTerms} />
    </LayoutSheet>
  );
}

