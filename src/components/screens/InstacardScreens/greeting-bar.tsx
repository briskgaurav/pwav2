'use client';

import { useAuth } from '@/lib/auth-context';
import { useAppDispatch } from '@/store/redux/hooks';
import { setPendingCardForm } from '@/store/redux/slices/cardWalletSlice';
import { haptic } from '@/lib/useHaptics';
import { Gift, Plus, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/lib/routes';

interface GreetingBarProps {
  userName: string;
  onSearchPress?: () => void;
  onAddPress?: () => void;
  onAvatarPress?: () => void;
  isDarkMode?: boolean;
  mode: 'virtual' | 'universal';
  onAddGiftPress?: () => void;
}

export function GreetingBar({
  userName,
  onSearchPress,
  onAddPress,
  isDarkMode,
  onAvatarPress,
  mode,
  onAddGiftPress,
}: GreetingBarProps) {
  const dispatch = useAppDispatch();




  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <button
        type="button"
        onClick={onAvatarPress}
        className="text-base font-normal flex items-center gap-2 text-text-primary text-left"
        aria-label={`Hello, ${userName}`}
      >
        <span className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-[#fff] mt-[2px] text-sm font-medium">{userName.charAt(0).toUpperCase()}</span>
        </span>
        <span>{userName.split(' ')[0]}</span>
      </button>

      {/* <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSearchPress}
          aria-label="Search"
          className={`h-5 w-5 flex items-center justify-center  rounded-full  transition`}
        >
          <svg className='object-contain -translate-y-0.5 h-full w-full' width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.182 15.4629L12.051 11.3979C13.1328 10.2226 13.7974 8.66829 13.7974 6.95788C13.7969 3.29901 10.7832 0.333332 7.06521 0.333332C3.34726 0.333332 0.333496 3.29901 0.333496 6.95788C0.333496 10.6168 3.34726 13.5824 7.06521 13.5824C8.67162 13.5824 10.145 13.0268 11.3023 12.1031L15.4493 16.184C15.6514 16.3831 15.9795 16.3831 16.1815 16.184C16.3841 15.985 16.3841 15.6619 16.182 15.4629ZM7.06521 12.5632C3.91942 12.5632 1.36926 10.0536 1.36926 6.95788C1.36926 3.86214 3.91942 1.35256 7.06521 1.35256C10.211 1.35256 12.7612 3.86214 12.7612 6.95788C12.7612 10.0536 10.211 12.5632 7.06521 12.5632Z" fill="currentColor" stroke="currentColor" stroke-width="0.666667" />
          </svg>

        </button>

        <Link
          type="link"
          href="/help-and-support"
          aria-label="Help"
          className="h-9 w-9 flex items-center justify-center rounded-full  transition"
        >
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={`object-contain h-full w-full `}>
            <g filter="url(#filter0_d_222_4320)">
              <circle cx="16.6729" cy="13.9038" r="9" stroke="currentColor" strokeWidth="1.5" shapeRendering="crispEdges" />
            </g>
            <path d="M13.6731 12.196C13.6717 12.2283 13.677 12.2607 13.6888 12.2909C13.7006 12.3212 13.7186 12.3488 13.7417 12.372C13.7647 12.3952 13.7923 12.4135 13.8229 12.4258C13.8534 12.4381 13.8862 12.4442 13.9192 12.4436H14.7617C14.9027 12.4436 15.015 12.3303 15.0334 12.193C15.1253 11.5352 15.5849 11.0559 16.4039 11.0559C17.1045 11.0559 17.7458 11.3998 17.7458 12.227C17.7458 12.8637 17.3639 13.1565 16.7603 13.6017C16.073 14.092 15.5287 14.6645 15.5675 15.594L15.5706 15.8116C15.5716 15.8774 15.599 15.9401 15.6468 15.9863C15.6945 16.0324 15.7589 16.0583 15.8259 16.0583H16.6541C16.7218 16.0583 16.7868 16.0318 16.8346 15.9848C16.8825 15.9378 16.9094 15.8741 16.9094 15.8076V15.7023C16.9094 14.9824 17.1882 14.7728 17.9409 14.2123C18.5628 13.7481 19.2113 13.2327 19.2113 12.1508C19.2113 10.6358 17.9082 9.90385 16.4815 9.90385C15.1876 9.90385 13.7701 10.4954 13.6731 12.196ZM15.2632 17.9744C15.2632 18.5088 15.6972 18.9038 16.2946 18.9038C16.9166 18.9038 17.3445 18.5088 17.3445 17.9744C17.3445 17.4209 16.9155 17.0319 16.2936 17.0319C15.6972 17.0319 15.2632 17.4209 15.2632 17.9744Z" fill="currentColor" />
            <defs>
              <filter id="filter0_d_222_4320" x="-0.000225067" y="9.53674e-07" width="33.3462" height="33.3462" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="2.76923" />
                <feGaussianBlur stdDeviation="3.46154" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_222_4320" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_222_4320" result="shape" />
              </filter>
            </defs>
          </svg>
        </Link>

        <button
          type="button"
          onClick={onAvatarPress}
          aria-label="Open profile"
          className="h-12 w-12 flex items-center justify-center rounded-full"
        >
          <Image
            src="/svg/greetingbar/avtar.svg"
            alt="Profile"
            height={36}
            width={36}
            className="object-contain h-full w-full"
          />
        </button>
      </div> */}

      <Link
        href={mode === 'virtual' ? routes.addInstacard : routes.addUniversalCard}

        onClick={() => dispatch(setPendingCardForm(mode))}
        className="flex items-center bg-primary rounded-full justify-center gap-2 w-fit px-4 py-2"
        aria-label="Add Instacard"
      >
        <div className="flex items-center gap-2 justify-center">
          <div className='w-fit'>
            <Plus className='w-5 h-5 text-[#fff] mb-1' />
          </div>
          <p className="text-[#fff] text-sm font-medium">Add {mode === 'virtual' ? 'Virtual Card' : 'Universal Card'}</p>
        </div>
      </Link>
    </div>
  );
}

export default GreetingBar;
