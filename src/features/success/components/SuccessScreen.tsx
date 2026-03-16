'use client';

import { useEffect } from 'react';
import { SheetContainer, Button } from '@/components/ui';
import { notifyNavigation } from '@/lib/bridge';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { routes } from '@/lib/routes';
import type { CardType } from '@/lib/types';
import { useCardWalletStore } from '@/store/useCardWalletStore';
import { useManagingCard } from '@/hooks/useManagingCard';

export type SuccessScreenProps = {
  /** Custom title (e.g. "Success!") */
  title?: string;
  /** Custom description */
  description?: string;
  /** Button label */
  buttonText?: string;
  /** Custom button action; when set, card preview and default "Activate Now" are hidden */
  onButtonClick?: () => void;
  /** Show card preview */
  showCardPreview?: boolean;
};

export default function SuccessScreen({
  title,
  description,
  buttonText,
  onButtonClick,
  showCardPreview = true,
}: SuccessScreenProps = {}) {

  const isCustom = Boolean(onButtonClick);

  useEffect(() => {
    notifyNavigation('success');
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardType = (searchParams.get('type') as CardType) || 'debit';
  const {imageSrc, maskedNumber} = useManagingCard();
  const displayTitle = title ?? 'Payment was Successful!';
  const displayDescription =
    description ??
    'We have successfully collected card issuance Fee of N XXXX for the Virtual Instacard you had requested to be issued.';
  const displayButtonText = buttonText ?? 'Activate Now';
  const handleButtonClick = onButtonClick ?? (() => router.push(routes.pinSetup(cardType)));

  return (
    <div className="h-screen flex flex-col">
      {/* <Header title="Success" /> */}

      <SheetContainer>
        <div className="flex-1 flex flex-col items-start justify-center p-6 py-10 gap-10 text-center">
          {/* Success checkmark animation */}
          <div className="w-full flex  relative flex-col items-center justify-start animate-scale-in">
            <Image
              src={'/img/success.png'}
              alt="Success"
              width={200}
              height={200}
              className="w-[120px] h-auto absolute top-[10%] left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
            />
            <div className="w-full bg-white/60 backdrop-blur-xl rounded-2xl border-text-secondary/20 space-y-4 py-6 z-5 relative border p-4  text-center mt-4">
              <p className="text-lg font-semibold text-text-primary">
                {displayTitle}
              </p>
              <p className="text-sm text-text-secondary mt-2">
                {displayDescription}
              </p>
            </div>
          </div>

          {/* Card preview - only for default card issuance flow */}
          {!isCustom && showCardPreview && (
            <div>
              <p className="text-[15px] pl-4 text-text-primary w-full text-left leading-normal m-0">
                Your Instacard is Ready for Activation.
              </p>
              <div className="mt-2 w-full  aspect-[1.58] rounded-2xl p-2 flex flex-col justify-between ">
                <Image
                  src={imageSrc || '/img/frontside.png'}
                  alt="Debit Card"
                  width={1000}
                  height={1000}
                  className="h-full w-full object-contain rounded-2xl"
                />
                {/* <p className="text-sm text-text-secondary mt-2">
                  {maskedNumber}
                </p> */}
              </div>
            </div>
          )}
        </div>
        <div className="p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          <Button fullWidth onClick={handleButtonClick}>
            {displayButtonText}
          </Button>
        </div>

        {/* animate-scale-in is defined in globals.css */}
      </SheetContainer>
    </div>
  );
}

