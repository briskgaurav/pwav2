'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { CardData } from '@/constants/cardData'
import { CardStack, CardStackRef } from '../InstacardScreens/CardStack'
import { CardFilterType, ScanPayFilterBar, type SortByValue } from './ScanPayFilterBar'
import { SwipeIndicator } from '../InstacardScreens/SwipeIndicator'
import { useAppSelector } from '@/store/redux/hooks'
import { useAuth } from '@/lib/auth-context'
import ButtonComponent from '@/components/ui/ButtonComponent'
import CardPinVerificationDrawer from '../AuthScreens/CardPinVerificationDrawer'
import { Button, PaymentProcessingOverlay } from '@/components/ui'
import { usePaymentProcessing } from '@/hooks/usePaymentProcessing'

type PayUsingInstacardProps = {
  amount: number
  onPay?: (payload: { card: CardData; amount: number }) => void
  /**
   * Optional: use a root-level PIN drawer (useful when parent applies CSS filter).
   * If provided, this component won't render its own `CardPinVerificationDrawer`.
   */
  openPinDrawer?: (opts: {
    fieldLength: number
    subtitle: string
    payingInfo?: string
    verifyPin: (pin: string) => boolean
    onVerified: () => void
    onClose: () => void
  }) => void
}

export default function PayUsingInstacard({ amount, onPay, openPinDrawer }: PayUsingInstacardProps) {
  const allCards = useAppSelector((s) => s.cardWallet.cards)
  const { isDarkMode } = useAuth()

  const [cardFilters, setCardFilters] = useState<CardFilterType[]>(['all'])
  const [sortBy, setSortBy] = useState<SortByValue>('recent')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [pinDrawerOpen, setPinDrawerOpen] = useState(false)
  const [pendingCard, setPendingCard] = useState<CardData | null>(null)
  const processing = usePaymentProcessing()
  const cardStackRef = useRef<CardStackRef>(null)

  const getPayingInfo = useCallback((card: CardData) => {
    const digits = (card.cardNumber ?? '').replace(/\D/g, '')
    const l4 = digits.slice(-4)
    const suffix = l4 ? ` •••• ${l4}` : ''
    return `${card.name ?? 'Instacard'}${suffix}`
  }, [])

  const openDrawerForCard = useCallback((card: CardData) => {
    setSelectedCardId(card.id)
    setPendingCard(card)
    setPinDrawerOpen(true)

    const close = () => {
      if (processing.model.open) return
      setPinDrawerOpen(false)
      setPendingCard(null)
    }

    const verified = () => {
      if (!card) return
      setPinDrawerOpen(false)
      processing.start({ minDurationMs: 5000 })
      const cardToPay = card
      setPendingCard(null)
      processing.succeedAfterMinDuration(() => onPay?.({ card: cardToPay, amount }), 5000)
    }

    if (openPinDrawer) {
      openPinDrawer({
        fieldLength: 4,
        subtitle: 'Enter PIN to use this card',
        payingInfo: getPayingInfo(card),
        verifyPin: (pin) => pin === card.pin,
        onVerified: verified,
        onClose: close,
      })
    }
  }, [amount, getPayingInfo, onPay, openPinDrawer, processing.model.open, processing, setSelectedCardId])

  const handleCardFiltersChange = useCallback((filters: CardFilterType[]) => {
    setCardFilters(filters)
    setSelectedCardId(null)
    setCurrentCardIndex(0)
  }, [])

  const filteredCards = useMemo(() => {
    let cards = allCards

    if (sortBy === 'recent') {
      cards = [...cards].sort((a, b) => {
        if (a.recentlyUsed !== b.recentlyUsed) return a.recentlyUsed ? -1 : 1
        return new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
      })
    } else if (sortBy === 'most-used') {
      cards = [...cards].sort((a, b) => {
        if (a.mostUsed !== b.mostUsed) return a.mostUsed ? -1 : 1
        return new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
      })
    }

    if (cardFilters.includes('all') || cardFilters.length === 0) return cards

    const includesUniversal = cardFilters.includes('universal')
    const typeFilters = cardFilters.filter((f) => f !== 'universal') as Array<Exclude<CardFilterType, 'all' | 'universal'>>

    return cards.filter((card) => {
      const matchesUniversal = includesUniversal && card.cardForm === 'universal'
      const matchesType = typeFilters.length > 0
        && typeFilters.includes(card.cardType as (typeof typeFilters)[number])
        && card.cardForm !== 'universal'
      return matchesUniversal || matchesType
    })
  }, [allCards, cardFilters, sortBy])

  const handleCardPress = useCallback((card: CardData) => {
    console.log('[ScanPay] Opening PIN drawer for card (tap):', card)
    openDrawerForCard(card)
  }, [openDrawerForCard])

  const selectedCard =
    filteredCards.find((c) => c.id === selectedCardId) ??
    filteredCards[currentCardIndex] ??
    null

  return (
    <div className=' min-h-[60vh] overflow-y-auto relative h-full'>
      {/* Filter bar */}
      <ScanPayFilterBar
        isDarkMode={isDarkMode}
        cardFilters={cardFilters}
        onCardFiltersChange={handleCardFiltersChange}
        sortBy={sortBy}
        onSortChange={(s: SortByValue) => {
          setSortBy(s)
          setSelectedCardId(null)
          setCurrentCardIndex(0)
        }}
      />

      {/* Card stack area */}
      <div className="min-h-[58vh]  w-full relative">
        {filteredCards.length > 0 ? (
          <div
            className={`w-full transition-transform duration-200 ease-out ${pinDrawerOpen ? 'scale-[1.0]' : 'scale-100'
              }`}
            style={{ transformOrigin: 'top center' }}
          >
            <CardStack
              ref={cardStackRef}
              cards={filteredCards}
              onCardChange={(index: number) => setCurrentCardIndex(index)}
              onCardPress={handleCardPress}
              isDrawerOpen={pinDrawerOpen}
              selectedCardId={selectedCardId}
            />
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <span className="text-base text-text-secondary">No card available</span>
          </div>
        )}

        {filteredCards.length > 0 && (
          <SwipeIndicator
            bottomPosition='bottom-[5%]'
            currentIndex={currentCardIndex}
            totalCount={filteredCards.length}
            onPreviousPress={() => cardStackRef.current?.goToPrevious()}
            onNextPress={() => cardStackRef.current?.goToNext()}
          />
        )}
      </div>

      {/* Pay using other cards button */}
      <div className="shrink-0 px-4 pb-6 pt-2">
        <Button fullWidth className='bg-primary text-white' onClick={() => {
          if (!selectedCard) return
          openDrawerForCard(selectedCard)
        }}>Pay Now ₦ {amount?.toString() || '0'}</Button>
      </div>

      {!openPinDrawer && (
        <CardPinVerificationDrawer
          fieldLength={4}
          visible={pinDrawerOpen}
          onClose={() => {
            if (processing.model.open) return
            setPinDrawerOpen(false)
            setPendingCard(null)
          }}
          showTitle={false}
          title="Verify PIN"
          subtitle="Enter PIN to use this card"
          payingInfo={pendingCard ? getPayingInfo(pendingCard) : undefined}
          verifyPin={(pin) => (pendingCard ? pin === pendingCard.pin : false)}
          onVerified={() => {
            if (!pendingCard) return
            setPinDrawerOpen(false)
            processing.start({ minDurationMs: 5000 })
            const cardToPay = pendingCard
            setPendingCard(null)
            processing.succeedAfterMinDuration(() => onPay?.({ card: cardToPay, amount }), 5000)
          }}
        />
      )}

      <PaymentProcessingOverlay
        open={processing.model.open}
        state={processing.model.state}
        title={processing.model.title}
        subtitle={processing.model.subtitle}
        primaryActionLabel={processing.model.state === 'error' ? 'Close' : undefined}
        onPrimaryAction={processing.model.state === 'error' ? processing.close : undefined}
        secondaryActionLabel={processing.model.state === 'error' ? 'Dismiss' : undefined}
        onSecondaryAction={processing.model.state === 'error' ? processing.close : undefined}
      />
    </div>
  )
}
