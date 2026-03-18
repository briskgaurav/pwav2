import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CardData, CardType, CardForm, CardImageId } from '@/components/StackingCard/cardData'
import { useUserStore } from './useUserStore'

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
  const usedNames = new Set(existingCards.filter(c => c.cardType === cardType).map(c => c.name))
  return names.find(n => !usedNames.has(n)) ?? `${names[0]} ${usedNames.size + 1}`
}

type CardWalletStore = {
  cards: CardData[]
  pendingCardForm: CardForm
  pendingPin: string | null
  managingCardId: string | null
  pendingLinkUniversalCardId: string | null
  setPendingCardForm: (form: CardForm) => void
  setPendingPin: (pin: string) => void
  setManagingCardId: (id: string | null) => void
  setPendingLinkUniversalCardId: (id: string | null) => void
  addCard: (cardType: CardType) => CardData
  removeCard: (cardId: string) => void
  verifyCardPin: (cardId: string, pin: string) => boolean
  changeCardPin: (cardId: string, newPin: string) => void
  linkVirtualCard: (universalCardId: string, virtualCardId: string) => void
}

export const useCardWalletStore = create<CardWalletStore>()(
  persist(
    (set, get) => ({
      cards: [],
      pendingCardForm: 'virtual',
      pendingPin: null,
      managingCardId: null,
      pendingLinkUniversalCardId: null,

      setPendingCardForm: (form) => set({ pendingCardForm: form }),
      setPendingPin: (pin) => set({ pendingPin: pin }),
      setManagingCardId: (id) => set({ managingCardId: id }),
      setPendingLinkUniversalCardId: (id) => set({ pendingLinkUniversalCardId: id }),

      addCard: (cardType) => {
        const { cards, pendingCardForm, pendingPin } = get()
        const isGift = cardType === 'gift'
        const cardForm: CardForm = isGift ? 'virtual' : pendingCardForm
        const imageId: CardImageId = cardForm === 'universal' ? 5 : CARD_TYPE_TO_IMAGE[cardType]
        const newCard: CardData = {
          id: generateId(),
          imageId,
          name: pickName(cardType, cards),
          cardHolder: useUserStore.getState().fullName,
          cardNumber: generateCardNumber(),
          pin: pendingPin ?? '0000',
          expiry: '12/28',
          balance: 0,
          cardType,
          cardForm,
          recentlyUsed: false,
          mostUsed: false,
          issuedDate: new Date().toISOString().split('T')[0],
          previousUsedCount: 0,
        }
        set({ cards: [...cards, newCard], pendingPin: null })
        return newCard
      },

      removeCard: (cardId) => {
        set({ cards: get().cards.filter(c => c.id !== cardId) })
      },

      verifyCardPin: (cardId, pin) => {
        const card = get().cards.find(c => c.id === cardId)
        if (!card) return false
        return card.pin === pin
      },

      changeCardPin: (cardId, newPin) => {
        set({
          cards: get().cards.map(c =>
            c.id === cardId ? { ...c, pin: newPin } : c
          ),
        })
      },

      linkVirtualCard: (universalCardId, virtualCardId) => {
        const { cards } = get()
        const universal = cards.find(c => c.id === universalCardId)
        const virtual = cards.find(c => c.id === virtualCardId)
        console.log(`[Card Linked] Universal: ${universal?.name} (${universalCardId}) <-> Virtual: ${virtual?.name} (${virtualCardId})`)
        set({
          cards: cards.map(c => {
            if (c.id === universalCardId) {
              return { ...c, linkedVirtualCardId: virtualCardId }
            }
            if (c.cardForm === 'universal' && c.linkedVirtualCardId === virtualCardId) {
              return { ...c, linkedVirtualCardId: null }
            }
            return c
          }),
        })
      },
    }),
    { name: 'card-wallet' }
  )
)
