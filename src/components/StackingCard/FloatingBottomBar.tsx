'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { Home, HomeIcon, ScanLine, User, User2 } from 'lucide-react';
import Link from 'next/link';

interface FloatingBottomBarProps {
  mode: 'virtual' | 'universal';
  onHomePress?: () => void;
  onScanPress?: () => void;
  onAddPress?: () => void;
  onAddGiftPress?: () => void;
  onProfilePress?: () => void;
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
  onProfilePress,
}: FloatingBottomBarProps) {
  return (
    <div
      className="shrink-0 w-full z-30 bg-primary pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] relative"
      role="navigation"
      aria-label="Bottom actions"
    >
      <div className="flex items-end justify-between px-8">
        {/* Home */}
        <Link
          href="/"
          className="flex flex-col items-center gap-1 px-3"
          onClick={() => {
            hapticLight();
            onHomePress?.();
          }}
          aria-label="Home"
        >
          <HomeIcon className="w-5 h-5 text-white" />
          <span className="text-white text-xs">Home</span>
        </Link>

        {/* ScanPay */}
        <button
          type="button"
          className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 bottom-2 gap-0 px-3"
          onClick={() => {
            hapticMedium();
            onScanPress?.();
          }}
          aria-label="ScanPay"
        >
          <div className="h-18 w-18 p-4 text-primary rounded-full bg-white border-4 border-primary flex items-center justify-center shadow-lg">
            <svg className="w-full h-full object-contain" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.2833 0.383789C8.79298 0.612109 8.84936 1.31996 8.29949 1.5399C6.72135 1.64374 5.0416 1.4411 3.47574 1.55219C2.27385 1.63704 1.64303 2.26952 1.55818 3.4703C1.44709 5.03672 1.64973 6.71647 1.5459 8.29517C1.32595 8.84504 0.618663 8.78922 0.390343 8.27898C0.546092 6.59477 0.18212 4.52426 0.390343 2.88582C0.507574 1.96417 1.36838 0.917467 2.24203 0.59592L2.94708 0.383789H8.2833Z" fill="currentColor" stroke="currentColor" strokeWidth="0.64838" />
              <path d="M26.2935 0.384026C27.6366 0.535309 28.7536 1.81647 28.8525 3.13392C28.9736 4.74835 28.7564 6.51071 28.8513 8.14134C28.7648 8.86537 27.7773 8.82406 27.6857 8.24796C27.5986 6.686 27.7918 5.0191 27.6818 3.46998C27.597 2.26976 26.9662 1.63672 25.7643 1.55186C24.1984 1.44133 22.5187 1.64286 20.9405 1.53958C20.3906 1.31964 20.4465 0.611788 20.9567 0.383468C22.6465 0.52247 24.6394 0.197015 26.2929 0.383468L26.2935 0.384026Z" fill="currentColor" stroke="currentColor" strokeWidth="0.64838" />
              <path d="M0.390549 26.2937V20.9564C0.618869 20.4461 1.32616 20.3903 1.54611 20.9402C1.64938 22.5189 1.44786 24.1986 1.55839 25.7651C1.64324 26.9675 2.27573 27.5983 3.47594 27.6832C5.0245 27.7926 6.69141 27.6 8.25281 27.6871C8.82891 27.7781 8.87022 28.7662 8.14618 28.8527C5.75189 28.5434 1.75545 29.8893 0.60268 26.9988L0.390549 26.2937Z" fill="currentColor" stroke="currentColor" strokeWidth="0.64838" />
              <path d="M22.9028 18.176V21.54C22.9028 22.0564 21.8941 22.9931 21.3208 22.9043L7.8108 22.9021C7.27824 22.9194 6.33816 22.0318 6.33816 21.5394V18.1755H4.36478C4.31231 18.1755 4.07338 17.9578 4.03374 17.8947C3.83836 17.5837 3.96843 17.2008 4.28384 17.0383C5.0503 16.9764 5.82179 17.0143 6.58993 17.0104C11.9161 16.9831 17.3249 16.9831 22.6499 17.0104C23.2891 17.0138 24.2286 16.925 24.8226 17.0054C25.2162 17.059 25.4049 17.5212 25.2296 17.8623C25.1933 17.9332 24.9343 18.1755 24.8756 18.1755H22.9023L22.9028 18.176ZM21.7355 18.176H7.50544V21.262C7.50544 21.382 7.79852 21.6929 7.94868 21.7086L21.1533 21.7359C21.3559 21.7627 21.7355 21.4283 21.7355 21.262V18.176Z" fill="currentColor" stroke="currentColor" strokeWidth="0.64838" />
              <path d="M22.3827 6.7975C22.6501 7.05541 22.8706 7.48525 22.9052 7.85983C23.052 9.46645 22.7897 11.2924 22.9041 12.9231C22.7908 13.5717 21.9674 13.6248 21.7597 13.009L21.7324 8.03233C21.6771 7.78224 21.5347 7.60862 21.293 7.52656H7.94941C7.69318 7.6142 7.53799 7.81015 7.50505 8.08313L7.48216 13.009C7.29125 13.5606 6.61633 13.5935 6.36345 13.0637L6.34335 7.75544C6.48459 7.0448 7.12936 6.3978 7.86512 6.33081H21.3773C21.724 6.36263 22.1354 6.55857 22.3838 6.7975H22.3827Z" fill="currentColor" stroke="currentColor" strokeWidth="0.64838" />
              <path d="M28.0558 20.5786C28.4923 20.4781 28.8317 20.6947 28.853 21.1474C28.6224 22.8992 29.3364 25.9919 28.3958 27.479C26.9655 29.7382 23.3895 28.5559 21.1487 28.854C20.4743 28.8467 20.3236 27.9384 20.941 27.695C22.5192 27.5918 24.1983 27.7933 25.7648 27.6828C26.9672 27.5979 27.5975 26.9649 27.6823 25.7647C27.7917 24.2155 27.5991 22.5486 27.6862 20.9867C27.713 20.8108 27.8844 20.6182 28.0558 20.5786Z" fill="currentColor" stroke="currentColor" strokeWidth="0.64838" />
            </svg>

          </div>
          <span className="text-white text-xs mt-1">ScanPay</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex flex-col items-center gap-1 px-3"
          onClick={() => {
            hapticLight();
            onProfilePress?.();
          }}
          aria-label="Profile"
        >
          <User2 className="w-5 h-5 text-white" />
          <span className="text-white text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
}

export default FloatingBottomBar;
