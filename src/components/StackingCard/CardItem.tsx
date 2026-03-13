'use client';

import Image from 'next/image';
import type { CardData } from './cardData';
import { CARD_IMAGE_PATHS } from './cardData';
import { maskCardNumber } from '@/hooks/useManagingCard';

interface CardItemProps {
  card: CardData;
  onPress?: (card: CardData) => void;
}

export function CardItem({ card, onPress }: CardItemProps) {
  const src = CARD_IMAGE_PATHS[card.imageId];
  const maskedNumber = maskCardNumber(card.cardNumber);

  return (
    <button
      type="button"
      onClick={() => onPress?.(card)}
      className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden z-0!  touch-none focus:outline-none! focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:ring-primary!"
      aria-label={`Card ${card.name}`}
    >
      <Image
        src={src}
        alt={card.name}
        fill
        className="object-contain"
        sizes="(max-width: 400px) shadow-md 100vw, 340px"
        draggable={false}
      />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#fff] text-xl tracking-[0.15em] font-medium drop-shadow-md pointer-events-none w-full select-none">
        {maskedNumber}
      </span>
    </button>
  );
}
