'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SheetContainer, RadioOption, Checkbox, Button } from '@/components/ui';
import { ICONS } from '@/constants/icons';
import { notifyNavigation } from '@/lib/bridge';
import { routes } from '@/lib/routes';

const ACCOUNT_OPTIONS = [
  { label: '0123456789 / NGN / Savings', icon: ICONS.fcmb },
  { label: '0987654321 / USD / Current', icon: ICONS.fcmb },
  { label: '0918273645 / NGN / Current', icon: ICONS.fcmb },
];

const TERMS = [
  'Issuance Fee - N 1000',
  'Monthly Maintenance Fee - N 50/ month',
  'Minimum monthly repayments to be paid',
  '4% Interest charged monthly on revolving balance',
  'You agree to pay the outstanding amount from your BVN linked accounts',
];

export default function AddDebitScreen() {
  const router = useRouter();
  const [selectedAccount, setSelectedAccount] = useState(ACCOUNT_OPTIONS[0]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    notifyNavigation('add-debit');
  }, []);

  const handleNext = () => {
    router.push(routes.otp('debit'));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* <Header title="Add New Card" showBackButton onBack={handleBack} /> */}

      <SheetContainer>
        <div
        className='p-6 py-10'
          style={{
            flex: 1,
            overflow: 'auto',
          }}
        >
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.4,
              marginBottom: 16,
            }}
            className='text-text-primary'
          >
            Select the Bank Account you want to link with this Debit Instacard
          </p>

          <div
            role="radiogroup"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginBottom: 24,
            }}
          >
            {ACCOUNT_OPTIONS.map((account) => (
              <RadioOption
                key={account.label}
                label={account.label}
                icon={account.icon}
                selected={account === selectedAccount}
                onSelect={() => setSelectedAccount(account)}
                accessibilityLabel={`Bank account ${account}`}
              />
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p
              style={{
                fontSize: 14,
              }}
              className='text-text-primary'
            >
              Please agree to Terms & Conditions for getting this Instacard issued
            </p>

            <ul className="flex mb-[2vw] flex-col gap-[6px] m-0 pl-5 list-disc">
              {TERMS.map((term, index) => (
                <li key={index} className="text-[13px] text-text-secondary">
                  {term}
                </li>
              ))}
            </ul>

            <Checkbox
              label="I agree the above terms & conditions. Please issue this Instacard"
              checked={acceptedTerms}
              onChange={setAcceptedTerms}
            />
          </div>
        </div>

        <div
          style={{
            padding: '8px 16px 24px',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
          }}
        >
          <Button fullWidth onClick={handleNext} disabled={!acceptedTerms}>
            Next
          </Button>
        </div>
      </SheetContainer>
    </div>
  );
}

