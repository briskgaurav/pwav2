'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SheetContainer, Checkbox, Button } from '@/components/ui';
import { notifyNavigation } from '@/lib/bridge';
import { routes } from '@/lib/routes';
import Link from 'next/link';

const TERMS = [
  'Issuance Fee - N 1000',
  'Monthly Maintenance Fee - N 50/ month',
  'Minimum monthly repayments to be paid',
  '4% Interest charged monthly on revolving balance',
  'You agree to pay the outstanding amount from your BVN linked accounts',
] as const;

export default function AddCreditScreen() {
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    notifyNavigation('add-credit');
  }, []);

  const handleNext = () => {
    router.push(routes.otp('credit'));
  };

  return (
    <div className="h-screen flex flex-col">
      {/* <Header title="Add Credit Card" showBackButton onBack={handleBack} /> */}

      <SheetContainer>
        <div className="flex-1 overflow-auto py-10  p-6">
          <div className="p-6 text-lg border bg-white space-y-6 border-text-primary/20 text-center text-text-primary rounded-2xl mb-6">
            <p className="font-medium">Pre-approved Credit Limit</p>

            <p className="font-semibold text-3xl">
              <span className="line-through"> N</span> 100,000
            </p>
          </div>

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
            <div className="text-md text-text-primary">
              <p>Your can view the detailed terms here :</p>
              <Link
                target="_blank"
                className="text-blue"
                href="https://www.accessbankplc.com/credit-cards-terms.aspx"
              >
                https://demo-link.apx
              </Link>
            </div>

            <Checkbox
              label="I agree to the above terms & conditions. Please process my application"
              checked={acceptedTerms}
              onChange={setAcceptedTerms}
            />
          </div>
        </div>

        <div className="p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          <Button fullWidth onClick={handleNext} disabled={!acceptedTerms}>
            Apply Now
          </Button>
        </div>
      </SheetContainer>
    </div>
  );
}

