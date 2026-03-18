'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { VerifyProgressProvider, useVerifyProgress } from '@/components/Verify/VerifyProgressContext';
import VerifyProgressMeter from '@/components/Verify/VerifyProgressMeter';

function RegistrationKycInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentStep, setStep } = useVerifyProgress();

  useEffect(() => {
    if (!pathname) return;

    // Map registration routes to the 4-step KYC meter
    // 1: Face Verification (handled in /verify)
    // 2: OTP Verification
    // 3: Authorize Details
    // 4: Email Registration
    if (pathname.includes('/registration/verification-method')) {
      setStep(2);
    } else if (pathname.includes('/registration/verification-otp')) {
      setStep(2);
    } else if (
      pathname.includes('/registration/accept-terms') ||
      pathname.includes('/registration/accept-terms2') ||
      pathname.includes('/registration/nin-confirmation')
    ) {
      setStep(3);
    } else if (
      pathname.includes('/registration/new-email') ||
      pathname.includes('/registration/verify-existing-email') ||
      pathname.includes('/registration/with-existing-email-success') ||
      pathname.includes('/registration/kyc-success') ||
      pathname.includes('/registration/continue-or-register')
    ) {
      setStep(4);
    }
  }, [pathname, setStep]);

  return (
    <div className="min-h-screen relative bg-white">
      <div className="pt-(--safe-area-top) pb-2">
        <VerifyProgressMeter currentStep={currentStep} />
      </div>
      {children}
    </div>
  );
}

export default function RegistrationKycLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VerifyProgressProvider>
      <RegistrationKycInner>{children}</RegistrationKycInner>
    </VerifyProgressProvider>
  );
}

