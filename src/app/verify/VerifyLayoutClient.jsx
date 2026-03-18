'use client';

import { VerifyProgressProvider, useVerifyProgress } from '@/components/Verify/VerifyProgressContext';
import VerifyProgressMeter from '@/components/Verify/VerifyProgressMeter';

function VerifyLayoutInner({ children }) {
  const { currentStep } = useVerifyProgress();
  return (
    <div className="h-fit bg-white">
      {/* Progress meter for verification flow */}
      <div className="pt-[var(--safe-area-top)]">
        <VerifyProgressMeter currentStep={currentStep} />
      </div>
      {children}
    </div>
  );
}

export default function VerifyLayoutClient({ children }) {
  return (
    <VerifyProgressProvider>
      <VerifyLayoutInner children={children} />
    </VerifyProgressProvider>
  );
}
