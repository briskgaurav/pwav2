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
}

export default function PayUsingInstacard({ amount, onPay }: PayUsingInstacardProps) {
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
    setSelectedCardId(card.id)
    setPendingCard(card)
    console.log('[ScanPay] Opening PIN drawer for card (tap):', card)
    setPinDrawerOpen(true)
  }, [])

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
            className={`w-full transition-transform duration-200 ease-out ${
              pinDrawerOpen ? 'scale-[0.6]' : 'scale-100'
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
          setSelectedCardId(selectedCard.id)
          setPendingCard(selectedCard)
          // console.log('[ScanPay] Opening PIN drawer for card (pay btn):', selectedCard, 'amount:', amount)
          setPinDrawerOpen(true)
        }}>Pay ₦ {amount?.toString() || '0'}</Button>
      </div>

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

      <PaymentProcessingOverlay
        open={processing.model.open}
        state={processing.model.state}
        title={processing.model.title}
        subtitle={processing.model.subtitle}
      />
    </div>
  )
}
