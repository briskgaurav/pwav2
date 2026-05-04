'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation'

import { Checkbox } from '@/components/ui';
import { notifyNavigation } from '@/lib/bridge';
import { routes } from '@/lib/routes';

import ButtonComponent from '../../ui/ButtonComponent';
import LayoutSheet from '../../ui/LayoutSheet';

const TERMS = [
  'Issuance Fee - N 500',
  'Gift cards are non-refundable and cannot be exchanged for cash',
  'Valid for 12 months from date of purchase',
  'Can be used at any participating merchant',
  'Lost or stolen cards cannot be replaced',
  'Minimum load amount - N 1,000 | Maximum load amount - N 500,000',
] as const;

export default function AddGiftScreen() {
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    notifyNavigation('add-gift');
  }, []);

  const handleNext = () => {
    router.push(routes.otp('gift'));
  };

  return (
    <LayoutSheet routeTitle="Add Gift Card" needPadding={false}>

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

