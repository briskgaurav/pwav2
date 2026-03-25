'use client';

import { OTPKeypad, OTPInput } from '@/components/ui'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import LayoutSheet from '@/components/ui/LayoutSheet'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { useSlideUpKeypad } from '@/hooks/useSlideUpKeypad'

export default function EnterOneTimeActivationCode() {
  const [otp, setOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const otpInputRef = useRef<HTMLDivElement>(null);
  const isComplete = otp.length === 8;

  const { keypadRef, isKeypadOpen, keypadHeight, openKeypad } = useSlideUpKeypad({
    insideRefs: [otpInputRef],
  });

  const handleKeypadKey = (key: string) => {
    if (key === 'del') {
      setOtp((prev) => prev.slice(0, -1))
      return
    }

    if (!/^\d$/.test(key)) return
    setOtp((prev) => (prev.length < 8 ? prev + key : prev))
  }

  const handleSubmit = async () => {
    setIsVerifying(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsVerifying(false);
    router.push(routes.pinSetup('gift'));
  }

  return (
    <LayoutSheet routeTitle='One-Time Gift Card Activation' needPadding={false}>
      <div className="flex flex-col" style={{ paddingBottom: isKeypadOpen ? keypadHeight : 0 }}>
        <div className="flex flex-col justify-center px-5 py-10 text-center gap-3">
          <h2 className="text-xl font-semibold text-text-primary">
            Enter One-Time Gift Card Activation Code
          </h2>

          <p className="text-sm text-text-primary">
            *Ask for this code from the person who gifted this Card to you
          </p>

          <div className="mt-6 mb-6 w-full" ref={otpInputRef} onClick={openKeypad}>
            <OTPInput value={otp} maxLength={8} onPress={openKeypad} />
          </div>

          <ButtonComponent
            title={isVerifying ? 'Verifying...' : 'Submit'}
            onClick={handleSubmit}
            disabled={!isComplete || isVerifying}
          />
        </div>
      </div>
      <div ref={keypadRef} className="w-full fixed bottom-0 left-0 py-2">
        <OTPKeypad onKeyPress={handleKeypadKey} />
      </div>
    </LayoutSheet>
  )
}