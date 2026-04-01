'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { SheetContainer, Button } from '@/components/ui';
import OtpInput from '@/components/ui/OtpInput';
import { notifyNavigation } from '@/lib/bridge';
import { routes } from '@/lib/routes';
import type { CardType } from '@/lib/types';
import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import { useAppSelector } from '@/store/redux/hooks';

const MAX_CODE_LENGTH = 6;

export default function OTPScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardType = (searchParams.get('type') as CardType) || 'debit';
  const maskedMobile = useAppSelector((s) => s.user.maskedMobile);
  const handleContinue = async () => {
    if (cardType === 'gift') {
      router.replace(routes.giftACard);
    } else {
      router.replace(routes.linkedSuccess);
    }
  };
  return (
    <VerificationCodeScreen
    title="Verify your Phone Number"
    subtitle="We have sent you a 6-digit code to your Registered Phone Number"
    maskedValue={maskedMobile}
    successRoute={cardType === 'gift' ? routes.giftACard : routes.success(cardType)}
    showKeypad
  />
   
  );
}