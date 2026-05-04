import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type {
  CardData,
  CardType,
  CardForm,
  CardImageId,
} from '@/constants/cardData'

const CARD_TYPE_TO_IMAGE: Record<CardType, CardImageId> = {
  debit: 1,
  credit: 2,
  prepaid: 3,
  gift: 4,
}

const CARD_TYPE_NAMES: Record<CardType, string[]> = {
  debit: ['FCMB Debit', 'GTB Debit', 'Access Debit', 'Zenith Debit', 'UBA Debit'],
  credit: ['GTB Credit', 'FCMB Magic', 'Access Credit', 'Zenith Credit'],
  prepaid: ['Prepaid Card', 'Travel Card', 'Student Card'],
  gift: ['Gift Card', 'Reward Card', 'Shopping Card'],
}

let counter = 0

function generateId() {
  counter += 1
  return `card-${Date.now()}-${counter}`
}

function generateCardNumber(): string {
  const group = () => String(Math.floor(1000 + Math.random() * 9000))
  return `${group()} ${group()} ${group()} ${group()}`
}

function pickName(cardType: CardType, existingCards: CardData[]): string {
  const names = CARD_TYPE_NAMES[cardType]
  const usedNames = new Set(
    existingCards.filter((c) => c.cardType === cardType).map((c) => c.name)
  )
  return names.find((n) => !usedNames.has(n)) ?? `${names[0]} ${usedNames.size + 1}`
}

type CardWalletState = {
  cards: CardData[]
  pendingCardForm: CardForm
  pendingPin: string | null
  managingCardId: string | null
  pendingLinkUniversalCardId: string | null
}

const initialState: CardWalletState = {
  cards: [],
  pendingCardForm: 'virtual',
  pendingPin: null,
  managingCardId: null,
  pendingLinkUniversalCardId: null,
}

const cardWalletSlice = createSlice({
  name: 'cardWallet',
  initialState,
  reducers: {
    setPendingCardForm: (state, action: PayloadAction<CardForm>) => {
      state.pendingCardForm = action.payload
    },
    setPendingPin: (state, action: PayloadAction<string>) => {
      state.pendingPin = action.payload
    },
    setManagingCardId: (state, action: PayloadAction<string | null>) => {
      state.managingCardId = action.payload
    },
    setPendingLinkUniversalCardId: (state, action: PayloadAction<string | null>) => {
      state.pendingLinkUniversalCardId = action.payload
    },
    addCard: (
      state,
      action: PayloadAction<{ cardType: CardType; cardHolderName: string }>
    ) => {
      const { cardType, cardHolderName } = action.payload
      const isGift = cardType === 'gift'
      const cardForm: CardForm = isGift ? 'virtual' : state.pendingCardForm
      const imageId: CardImageId = cardForm === 'universal' ? 5 : CARD_TYPE_TO_IMAGE[cardType]
      const newCard: CardData = {
        id: generateId(),
        imageId,
        name: pickName(cardType, state.cards),
        cardHolder: cardHolderName,
        cardNumber: generateCardNumber(),
        pin: state.pendingPin ?? '0000',
        expiry: '12/28',
        balance: 0,
        cardType,
        cardForm,
        recentlyUsed: false,
        mostUsed: false,
        issuedDate: new Date().toISOString().split('T')[0],
        previousUsedCount: 0,
      }
      state.cards.push(newCard)
      state.pendingPin = null
    },
    removeCard: (state, action: PayloadAction<string>) => {
      state.cards = state.cards.filter((c) => c.id !== action.payload)
    },
    changeCardPin: (
      state,
      action: PayloadAction<{ cardId: string; newPin: string }>
    ) => {
      const card = state.cards.find((c) => c.id === action.payload.cardId)
      if (card) {
        card.pin = action.payload.newPin
      }
    },
    linkVirtualCard: (
      state,
      action: PayloadAction<{ universalCardId: string; virtualCardId: string }>
    ) => {
      const { universalCardId, virtualCardId } = action.payload
      for (const card of state.cards) {
        if (card.id === universalCardId) {
          card.linkedVirtualCardId = virtualCardId
        } else if (
          card.cardForm === 'universal' &&
          card.linkedVirtualCardId === virtualCardId
        ) {
          card.linkedVirtualCardId = null
        }
      }
    },
  },
  selectors: {
    selectCards: (state) => state.cards,
    selectPendingCardForm: (state) => state.pendingCardForm,
    selectPendingPin: (state) => state.pendingPin,
    selectManagingCardId: (state) => state.managingCardId,
    selectPendingLinkUniversalCardId: (state) => state.pendingLinkUniversalCardId,
  },
})

export const {
  setPendingCardForm,
  setPendingPin,
  setManagingCardId,
  setPendingLinkUniversalCardId,
  addCard,
  removeCard,
  changeCardPin,
  linkVirtualCard,
} = cardWalletSlice.actions

export const {
  selectCards,
  selectPendingCardForm,
  selectPendingPin,
  selectManagingCardId,
  selectPendingLinkUniversalCardId,
} = cardWalletSlice.selectors

export function selectVerifyCardPin(state: { cardWallet: CardWalletState }, cardId: string, pin: string): boolean {
  const card = state.cardWallet.cards.find((c) => c.id === cardId)
  if (!card) return false
  return card.pin === pin
}

export default cardWalletSlice.reducer
