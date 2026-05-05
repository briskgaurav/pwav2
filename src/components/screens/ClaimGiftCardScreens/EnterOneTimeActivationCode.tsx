'use client';

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import LayoutSheet from '@/components/ui/LayoutSheet'
import ButtonComponent from '@/components/ui/ButtonComponent'

export default function EnterOneTimeActivationCode() {
  const [otp, setOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const hiddenRef = useRef<HTMLInputElement | null>(null)
  const isComplete = otp.length === 8;

  const focusOtp = () => hiddenRef.current?.focus()

  useEffect(() => {
    const t = window.setTimeout(() => focusOtp(), 150)
    return () => window.clearTimeout(t)
  }, [])

  const handleSubmit = async () => {
    setIsVerifying(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsVerifying(false);
    router.push(routes.pinSetup('gift'));
  }

  return (
    <LayoutSheet routeTitle='One-Time Gift Card Activation' needPadding={false}>
      <div className="flex flex-col">
        <div className="flex flex-col justify-center px-5 py-10 text-center gap-3">
          <h2 className="text-xl font-semibold text-text-primary">
            Enter One-Time Gift Card Activation Code
          </h2>

          <p className="text-sm text-text-primary">
            *Ask for this code from the person who gifted this Card to you
          </p>

          <div className="mt-6 mb-6 w-full" onClick={focusOtp}>
            <input
              ref={hiddenRef}
              type="tel"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d*"
              enterKeyHint="done"
              maxLength={8}
              value={otp}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '').slice(0, 8)
                setOtp(cleaned)
              }}
              className="absolute -left-[9999px] top-0 w-px h-px opacity-0"
            />

            <div className="flex flex-wrap gap-2.5 w-full px-5 justify-center max-w-[340px] mx-auto">
              {Array.from({ length: 8 }, (_, i) => otp[i] || '').map((digit, i) => {
                const isCursor = i === otp.length && otp.length < 8
                return (
                  <div
                    key={i}
                    className={`w-14 h-14 sm:w-12 sm:h-12 rounded-[10px] border flex items-center justify-center text-base font-semibold text-text-primary shrink-0 transition-colors ${
                      isCursor ? 'border-primary' : digit ? 'border-text-primary' : 'border-border'
                    }`}
                  >
                    {digit || (isCursor ? <span className="w-0.5 h-5 bg-primary animate-pulse rounded-full" /> : '')}
                  </div>
                )
              })}
            </div>
          </div>

          <ButtonComponent
            title={isVerifying ? 'Verifying...' : 'Submit'}
            onClick={handleSubmit}
            disabled={!isComplete || isVerifying}
          />
        </div>
      </div>
    </LayoutSheet>
  )
}