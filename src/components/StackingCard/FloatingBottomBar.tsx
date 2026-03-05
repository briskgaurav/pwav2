'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { LucideGift, PlusIcon } from 'lucide-react';
import Link from 'next/link';

interface FloatingBottomBarProps {
  onHomePress?: () => void;
  onScanPress?: () => void;
  onAddPress?: () => void;
  onAddGiftPress?: () => void;
}

function hapticLight() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(10);
  }
}

function hapticMedium() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(20);
  }
}

export function FloatingBottomBar({
  onHomePress,
  onScanPress,
  onAddPress,
  onAddGiftPress,
}: FloatingBottomBarProps) {
  const plusRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);

  const rotatePlus = () => {
    rotationRef.current += 90;
    if (!plusRef.current) return;
    gsap.to(plusRef.current, {
      rotate: rotationRef.current,
      duration: 1,
      ease: 'power2.out',
    });
  };

  return (
    <>
      <div
        className="absolute left-1/2 w-fit bottom-16  -translate-x-1/2 z-30 h-fit py-4 bg-primary rounded-full flex items-center justify-center gap-5 px-6 "
    
        role="navigation"
        aria-label="Bottom actions"
      >
        {/* Optional Home action kept for parity */}
        {/* <button
          type="button"
          className="flex items-center gap-1 px-2"
          onClick={() => {
            hapticLight();
            onHomePress?.();
          }}
          aria-label="Home"
        >
          <Image src="/svg/home.svg" alt="Home" width={24} height={24} />
          <span className="text-white text-base">Home</span>
        </button> */}

        <Link
          href="/add-instacard"
         
          className="flex items-center gap-2  pr-0 w-full"
          onClick={() => {
            hapticLight();
            rotatePlus();
            window.setTimeout(() => onAddPress?.(), 500);
          }}
          aria-label="Add Instacard"
        >
          <div className="w-full flex items-center gap-2 justify-center">
            <div ref={plusRef} className='w-fit'>

              <PlusIcon className='w-5 h-5 text-white mb-1' />
            </div>
            <p className="text-white w-full text-sm font-medium">Add Instacard</p>
          </div>
        </Link>

        {/* <div className="flex items-center justify-center">
          <button
            type="button"
            className="h-[55px] w-[55px] rounded-full bg-primary border-2 border-white flex items-center justify-center"
            onClick={() => {
              hapticMedium();
              onScanPress?.();
            }}
            aria-label="Scan"
          >
            <Image src="/svg/scan.svg" alt="Scan" width={30} height={30} />
          </button>
        </div> */}
      </div>

      <Link
        href="/add-a-gift-card"
        className="absolute left-0 right-0 z-30 bottom-6 flex items-center justify-center gap-1 text-text-secondary"
      
        onClick={onAddGiftPress}
        aria-label="Add Gift Card"
      >
        <LucideGift className='w-5 h-5 text-text-secondary mb-1' />
        <span className="text-sm">Add Gift Card</span>
      </Link>
    </>
  );
}

export default FloatingBottomBar;
