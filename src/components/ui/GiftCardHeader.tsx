'use client';

import CardMockup from '@/components/ui/CardMockup';
import { useManagingCard } from '@/hooks/useManagingCard';

export function GiftCardHeader() {
  const { imageSrc, maskedNumber } = useManagingCard();
  return (
    <>
      <p className="text-text-primary text-sm pt-5 translate-y-5 ml-4">
        Your Instacard Gift Card is Ready for Activation.
      </p>
      <CardMockup imageSrc={imageSrc} maskedNumber={maskedNumber} isclickable={false} showActions={false} showNumber={true} />
      <div className="text-sm">
        <p className="ml-1">
          KYC Tier : <span className="text-orange font-medium">KYC Level 1</span>
        </p>
        <p className="ml-1">
          Max Daily Transaction Limit:{' '}
          <span className="text-orange font-medium">
            <span className="line-through">N </span>100,000{' '}
          </span>
        </p>
        <p className="ml-1">
          Max Daily Transaction Limit :{' '}
          <span className="text-orange font-medium">
            <span className="line-through">N </span> 100,000:
          </span>
        </p>
      </div>
    </>
  );
}

