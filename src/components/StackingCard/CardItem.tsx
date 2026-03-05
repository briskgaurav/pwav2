'use client';

import Image from 'next/image';
import type { CardData, CardImageId } from './cardData';

const CARD_IMAGE_PATHS: Record<CardImageId, string> = {
  1: '/img/cards/debit.png',
  2: '/img/cards/credit.png',
  3: '/img/cards/prepaid.png',
  4: '/img/cards/gift.png',
};

interface CardItemProps {
  card: CardData;
  onPress?: (card: CardData) => void;
}

export function CardItem({ card, onPress }: CardItemProps) {
  const src = CARD_IMAGE_PATHS[card.imageId];

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
        sizes="(max-width: 400px) 100vw, 340px"
        draggable={false}
      />
    </button>
  );
}
