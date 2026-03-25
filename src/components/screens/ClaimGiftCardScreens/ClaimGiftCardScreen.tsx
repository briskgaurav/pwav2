'use client';

import { SheetContainer, Button } from '@/components/ui'
import React, { useState, useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import LayoutSheet from '../../ui/LayoutSheet';
import ButtonComponent from '@/components/ui/ButtonComponent';

export default function ClaimGiftCardScreen() {
  const [activationCode, setActivationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const checkIconRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    // Limit to 12 characters
    const limitedValue = value.slice(0, 12);
    setActivationCode(limitedValue);
    setIsVerified(false);
  };

  useEffect(() => {
    if (activationCode.length === 12 && !isVerified && !isVerifying) {
      setIsVerifying(true);

      // Simulate verification delay
      setTimeout(() => {
        setIsVerified(true);
        setIsVerifying(false);

        // Animate the check icon
        if (checkIconRef.current) {
          gsap.fromTo(
            checkIconRef.current,
            { scale: 0, rotation: -180, opacity: 0 },
            {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'back.out(1.7)'
            }
          );
        }

        // Animate the input border
        if (inputRef.current) {
          gsap.to(inputRef.current, {
            borderColor: '#22c55e',
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      }, 800);
    } else if (activationCode.length < 12) {
      // Reset border color when code is incomplete
      if (inputRef.current) {
        gsap.to(inputRef.current, {
          borderColor: '',
          duration: 0.2
        });
      }
    }
  }, [activationCode, isVerified, isVerifying]);

  return (
    <LayoutSheet routeTitle='Claim Gift Card' needPadding={false}>
        <div className='flex-1 overflow-auto flex flex-col p-6 pt-10'>
          {/* Header */}
          <h1 className='text-lg font-medium text-text-primary mb-6'>
            Add a Gift-card  that has been gifted to you
          </h1>

          {/* Note */}

          {/* Input Field */}

          <h2>  <h1 className='text-sm font-medium text-text-primary mb-2 ml-.5'>
            Enter Activation Code
          </h1>
          </h2>
          <div className='relative'>
            <input
              autoComplete="one-time-code"
              ref={inputRef}
              type='text'
              value={activationCode}
              onChange={handleInputChange}
              placeholder='Enter activation code'
              maxLength={12}
              className='w-full px-4 py-4 text-base font-medium text-text-primary border border-border rounded-xl focus:outline-none! focus:ring-0! bg-white'
            />
            {isVerifying && (
              <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                <div className='w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin' />
              </div>
            )}
            {isVerified && (
              <div ref={checkIconRef} className='absolute right-4 top-1/2 -translate-y-1/2'>
                <Check className='w-6 h-6 text-green-500' strokeWidth={3} />
              </div>
            )}
          </div>
          <p className='text-xs text-text-secondary mt-4 py-3 px-4 bg-background2 border border-border rounded-2xl'>
            Enter Add Gifted Card Code shared over Email / Message by the person who has gifted this Card to you
          </p>


         
        </div>
        <ButtonComponent title="Continue" onClick={() => router.push(routes.claimGiftCardEmailVerify)} disabled={!isVerified} />
    </LayoutSheet>
  )
}
