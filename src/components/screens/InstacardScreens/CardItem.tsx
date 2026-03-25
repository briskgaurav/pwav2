'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CardData } from '../../../constants/cardData';
import { CARD_IMAGE_PATHS } from '../../../constants/cardData';
import { maskCardNumber } from '@/hooks/useManagingCard';

interface CardItemProps {
  card: CardData;
  onPress?: (card: CardData) => void;
}

function CardSkeleton() {
  return (
    <>
      <div
        className="w-full aspect-[1.586/1] rounded-[5vw]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgb(229 231 235) 0%, rgb(243 244 246) 50%, rgb(229 231 235) 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s linear infinite',
        }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </>
  );
}

function CardError({ name }: { name: string }) {
  return (
    <div className="w-full aspect-[1.586/1] rounded-[5vw] bg-gray-800 flex flex-col items-center justify-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-10 h-10 text-gray-400"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </svg>
      <span className="text-gray-400 text-sm font-medium">{name}</span>
      <span className="text-gray-500 text-xs">Image unavailable</span>
    </div>
  );
}

export function CardItem({ card, onPress }: CardItemProps) {
  const src = CARD_IMAGE_PATHS[card.imageId];
  const maskedNumber = maskCardNumber(card.cardNumber);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onPress?.(card)}
      className="relative w-[90vw] h-auto shadow-lg shadow-border [box-shadow:0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-[5vw] overflow-hidden z-0! touch-none focus:outline-none! focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:ring-primary!"
      aria-label={`Card ${card.name}`}
    >
      {hasError ? (
        <CardError name={card.name} />
      ) : (
        <>
          {isLoading && <CardSkeleton />}
          <Image
            src={src}
            alt={card.name}
            height={1000}
            width={1000}
            className={`object-contain h-full w-full transition-opacity duration-300 ${isLoading ? 'opacity-0 absolute inset-0' : 'opacity-100'}`}
            draggable={false}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        </>
      )}
      {!hasError && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#fff] text-xl tracking-[0.15em] font-medium drop-shadow-md pointer-events-none w-full select-none">
          {maskedNumber}
        </span>
      )}
    </button>
  );
}
