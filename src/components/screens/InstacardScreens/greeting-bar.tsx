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
  onAvatarPress?: () => void;
  mode: 'virtual' | 'universal';
}

export function GreetingBar({
  userName,
  onAvatarPress,
  mode,
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
          <span className="text-[#fff] text-sm font-medium">{userName.charAt(0).toUpperCase()}</span>
        </span>
        <span>{userName.split(' ')[0]}</span>
      </button>


      <Link
        href={mode === 'virtual' ? routes.addInstacard : routes.addUniversalCard}

        onClick={() => dispatch(setPendingCardForm(mode))}
        className="flex items-center bg-primary rounded-full justify-center gap-2 w-fit px-4 py-2"
        aria-label="Add Instacard"
      >
        <div className="flex items-center gap-2 justify-center">
          <div className='w-fit'>
            <Plus className='w-5 h-5 text-[#fff]' />
          </div>
          <p className="text-[#fff] text-sm font-medium">Add {mode === 'virtual' ? 'Virtual Card' : 'Universal Card'}</p>
        </div>
      </Link>
    </div>
  );
}

export default GreetingBar;
