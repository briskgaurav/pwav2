'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SheetContainer, Checkbox, Button } from '@/components/ui';
import { notifyNavigation } from '@/lib/bridge';
import { routes } from '@/lib/routes';
import LayoutSheet from '../components/LayoutSheet';
import ButtonComponent from '../components/ui/ButtonComponent';

const TERMS = [
  'Issuance Fee - N 1000',
  'Monthly Maintenance Fee - N 50/ month',
  'Minimum monthly repayments to be paid',
  '4% Interest charged monthly on revolving balance',
  'You agree to pay the outstanding amount from your BVN linked accounts',
] as const;

export default function AddPrepaidScreen() {
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    notifyNavigation('add-prepaid');
  }, []);

  const handleNext = () => {
    router.push(routes.otp('prepaid'));
  };

  return (
    <LayoutSheet routeTitle="Add Prepaid Card" needPadding={false}>

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

