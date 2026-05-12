import type { CardType } from './types'

export type CardConfig = {
  label: string
  image: string
  mockupImage: string
}

export const CARD_CONFIG: Record<CardType, CardConfig> = {
  DEBIT_CARD: {
    label: 'Debit Card',
    image: '/img/frontside.png',
    mockupImage: '/img/debitmockup.png',
  },
  CREDIT_CARD: {
    label: 'Credit Card',
    image: '/img/creditcard.png',
    mockupImage: '/img/creditmockup.png',
  },
  PREPAID_CARD: {
    label: 'Pre-Paid Card',
    image: '/img/prepaid.png',
    mockupImage: '/img/prepaid.png',
  },
  GIFT_CARD: {
    label: 'Gift Card',
    image: '/img/gift.png',
    mockupImage: '/img/gift.png',
  },
}
