'use client';

import Image from 'next/image';
import { useRef } from 'react';
import gsap from 'gsap';
import { LucideGift, PlusIcon } from 'lucide-react';
import Link from 'next/link';

interface FloatingBottomBarProps {
  mode: 'virtual' | 'universal';
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
  mode,
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
        className="fixed left-1/2 w-fit flex-col z-999 -translate-x-1/2 h-fit rounded-full flex items-center justify-center gap-5"
        style={{ bottom: 'calc(5% + env(safe-area-inset-bottom, 0px))' }}
        role="navigation"
        aria-label="Bottom actions"
      >

        <div className='bg-primary  flex items-center justify-center gap-5 px-2 py-2 rounded-full'>

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
            href="/"

            className="flex items-center gap-2 justify-center  w-full"
            onClick={() => {
              hapticLight();
              rotatePlus();
              window.setTimeout(() => onAddPress?.(), 500);
            }}
            aria-label="FCMB"
          >
            <div className="w-full flex items-center gap-2 justify-center">
              <div className='flex items-center   gap-2 justify-center'>

                <div className='h-[55px] w-[55px] rounded-full aspect-square bg-white p-3  border-2 border-primary flex items-center justify-center'>

                  <Image src="/svg/fcmb.svg" alt="Scan" width={30} height={30} className='h-full w-full object-contain' />
                </div>
                <p className="text-[#ffffff] w-full text-center text-xs font-medium">FCMB</p>
              </div>
            </div>

          </Link>

          <Link href="/scan" className="w-full flex items-center gap-2 justify-center">
            <div className='flex items-center   gap-2 justify-center'>

              <div className='h-[55px] w-[55px] rounded-full border-2 border-white p-3 flex items-center justify-center'>

                <Image src="/svg/scan.svg" alt="Scan" width={30} height={30} className='h-full w-full object-contain' />
              </div>
              {/* <p className="text-[#ffffff] w-full text-center text-xs font-medium">SCAN</p> */}
            </div>
          </Link>
        </div>

        <Link
          href="/add-a-gift-card"
          className=" flex items-center justify-center gap-1 text-text-secondary"

          onClick={onAddGiftPress}
          aria-label="Add Gift Card"
        >
          <LucideGift className='w-5 h-5 text-text-secondary mb-1' />
          <span className="text-sm">Add Gift Card</span>
        </Link>
      </div>

    </>
  );
}

export default FloatingBottomBar;
