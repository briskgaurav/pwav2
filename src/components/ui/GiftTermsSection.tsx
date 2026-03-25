'use client';

import { ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui';

type Props = {
  agreed: boolean;
  onChangeAgreed: (value: boolean) => void;
  onOpenTerms: () => void;
};

export function GiftTermsSection({ agreed, onChangeAgreed, onOpenTerms }: Props) {
  return (
    <>
      <button
        type="button"
        onClick={onOpenTerms}
        className="w-full border border-border rounded-2xl p-4 flex items-center justify-between bg-transparent cursor-pointer"
      >
        <p className="text-text-primary text-md font-medium">Read Terms & Conditions</p>
        <ChevronRight className="w-5 h-5 text-text-primary" />
      </button>
      <Checkbox
        label="I agree the above terms & conditions. Please Debit the Card Issuance Fee to any of my bank accounts to issue this Instacard"
        checked={agreed}
        onChange={onChangeAgreed}
      />
    </>
  );
}

