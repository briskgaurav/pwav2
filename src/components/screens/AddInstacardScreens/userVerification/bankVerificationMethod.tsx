'use client';

import { Button } from '@/components/ui';
import type { BankVerifictionMethod } from '@/types/userVerificationSteps';

interface BankVerificationMethodProps {
  onSelect: (method: BankVerifictionMethod) => void;  // ← use the shared type
}

export default function BankVerificationMethod({ onSelect }: BankVerificationMethodProps) {
  return (
      <div className='flex-1 w-full flex flex-col items-center justify-center gap-4 min-h-full px-6'>
        
        <Button
            onClick={() => onSelect('soft_token')}    
        >
            Go with Soft Token
        </Button>

        <Button
          onClick={() => onSelect('otp')}
        >
          Go with OTP
        </Button>
      </div>
  )
}