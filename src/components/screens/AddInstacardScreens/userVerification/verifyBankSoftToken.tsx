'use client';

import VerifySoftTokenScreen from '@/components/screens/AuthScreens/VerifySoftTokenScreen';
import type { UserInstaCardSteps } from '@/types/userVerificationSteps';
import { verifyBankSoftToken } from '@/lib/api/cards';
import { useAppSelector } from '@/store/redux/hooks';
import { selectCardRequestId } from '@/store/redux/slices/cardRequestSlice';

interface VerifyBankSoftTokenProps {
  onNext: (nextStep: UserInstaCardSteps) => void;
}

export default function VerifyBankSoftToken({
  onNext,
}: VerifyBankSoftTokenProps) {
  const requestId = useAppSelector(selectCardRequestId);

  const handleVerify = async (code: string) => {
    if (!requestId) {
      throw new Error('Card request not initialised. Please restart the flow.');
    }
    // The success/failure of verification is signalled by the 200/400 status,
    // and no downstream screen consumes the verification status field, so we
    // do not dispatch the response into Redux.
    await verifyBankSoftToken({ requestId, softToken: code });
  };

  const handleSuccess = () => {
    onNext('user_consent');
  };

  return (
    <VerifySoftTokenScreen
      title="Verify Soft Token"
      subtitle="Enter the 6-digit code from your bank's authenticator app"
      onVerify={handleVerify}
      onSuccess={handleSuccess}
    />
  );
}
