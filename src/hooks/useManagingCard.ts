import { useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { changeCardPin as changeCardPinAction } from '@/store/redux/slices/cardWalletSlice'
import { CARD_IMAGE_PATHS, type CardImageId } from '@/constants/cardData'

export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, '')
  if (digits.length < 4) return cardNumber
  const last4 = digits.slice(-4)
  return `XXXX XXXX XXXX ${last4}`
}

export function useManagingCard() {
  const dispatch = useAppDispatch()
  const managingCardId = useAppSelector((s) => s.cardWallet.managingCardId)
  const cards = useAppSelector((s) => s.cardWallet.cards)

  const card = managingCardId ? cards.find((c) => c.id === managingCardId) ?? null : null

  const verifyPin = useCallback(
    (pin: string) => {
      if (!card) return false
      return card.pin === pin
    },
    [card]
  )

  const changePin = useCallback(
    (newPin: string) => {
      if (!card) return
      dispatch(changeCardPinAction({ cardId: card.id, newPin }))
    },
    [card, dispatch]
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

  const imgPath = CARD_IMAGE_PATHS[card.imageId as CardImageId]

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
