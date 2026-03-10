import { useCallback } from 'react'
import { useCardWalletStore } from '@/store/useCardWalletStore'
import { CARD_IMAGE_PATHS } from '@/components/StackingCard/cardData'

/** "1234 5678 9012 3456" → "XXXX XXXX XXXX 3456" */
export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, '')
  if (digits.length < 4) return cardNumber
  const last4 = digits.slice(-4)
  return `XXXX XXXX XXXX ${last4}`
}

/**
 * Returns the currently managing card's data, image path, card number,
 * and per-card PIN helpers (verifyPin / changePin).
 * Falls back to defaults when no card is being managed.
 */
export function useManagingCard() {
  const managingCardId = useCardWalletStore((s) => s.managingCardId)
  const cards = useCardWalletStore((s) => s.cards)
  const verifyCardPin = useCardWalletStore((s) => s.verifyCardPin)
  const changeCardPin = useCardWalletStore((s) => s.changeCardPin)

  const card = managingCardId ? cards.find((c) => c.id === managingCardId) ?? null : null

  const verifyPin = useCallback(
    (pin: string) => {
      if (!card) return false
      return verifyCardPin(card.id, pin)
    },
    [card, verifyCardPin]
  )

  const changePin = useCallback(
    (newPin: string) => {
      if (!card) return
      changeCardPin(card.id, newPin)
    },
    [card, changeCardPin]
  )

  if (!card) {
    return {
      card: null,
      imageSrc: undefined,
      mockupImageSrc: undefined,
      cardNumber: undefined,
      maskedNumber: undefined,
      cardHolder: undefined,
      expiry: undefined,
      balance: undefined,
      verifyPin: (_pin: string) => false,
      changePin: (_newPin: string) => {},
    }
  }

  const imgPath = CARD_IMAGE_PATHS[card.imageId]

  return {
    card,
    imageSrc: imgPath,
    mockupImageSrc: imgPath,
    cardNumber: card.cardNumber,
    maskedNumber: maskCardNumber(card.cardNumber),
    cardHolder: card.cardHolder,
    expiry: card.expiry,
    balance: card.balance,
    verifyPin,
    changePin,
  }
}
