'use client';

import { useEffect, useState } from 'react';
import { SheetContainer, Button, CardMockup } from '@/components/ui';
import { notifyNavigation } from '@/lib/bridge';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { routes } from '@/lib/routes';
import type { CardType } from '@/lib/types';
import { useAppSelector } from '@/store/redux/hooks';
import { useManagingCard } from '@/hooks/useManagingCard';
import LayoutSheet from '../../ui/LayoutSheet';
import ButtonComponent from '../../ui/ButtonComponent';

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
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    notifyNavigation('success');
  }, []);
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardType = (searchParams.get('type') as CardType) || 'debit';
  const { imageSrc, maskedNumber } = useManagingCard();
  const displayTitle = title ?? 'Payment was Successful!';
  const displayDescription =
    description ??
    'We have successfully collected card issuance Fee of N XXXX for the Virtual Instacard you had requested to be issued.';
  const displayButtonText = buttonText ?? 'Activate Now';
  const handleButtonClick = onButtonClick ?? (() => router.push(routes.pinSetup(cardType)));

  return (
    <LayoutSheet routeTitle="Success" needPadding={false}>
      {/* <Header title="Success" /> */}

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
              <div>

                <CardMockup
                  imageSrc={imageSrc || '/img/cards/DebitCard.png'}
                  maskedNumber={maskedNumber}
                  isclickable={false}
                  showActions={false}
                  showNumber={false}

                />
              </div>
            </div>
          )}
        </div>
        <ButtonComponent title={displayButtonText} onClick={handleButtonClick} />

    </LayoutSheet>
  );
}
