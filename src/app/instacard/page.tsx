'use client'
import { CardData } from '@/components/StackingCard/cardData'
import { CardStack, CardStackRef } from '@/components/StackingCard/CardStack'
import { CardFilterType, FilterBar, type SortByValue } from '@/components/StackingCard/FilterBar'
import GreetingBar from '@/components/StackingCard/greeting-bar'
import { SwipeIndicator } from '@/components/StackingCard/SwipeIndicator'
import FloatingBottomBar from '@/components/StackingCard/FloatingBottomBar'
import ActionDrawer from '@/components/StackingCard/ActionDrawer'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useCardWalletStore } from '@/store/useCardWalletStore'
import { useProfileDrawerStore } from '@/store/useProfileDrawerStore'
import { routes } from '@/lib/routes'



export default function CardsScreen() {
  const router = useRouter()
  const allCards = useCardWalletStore((s) => s.cards)
  const setPendingCardForm = useCardWalletStore((s) => s.setPendingCardForm)
  const openProfileDrawer = useProfileDrawerStore((s) => s.open)
  const [cardFilters, setCardFilters] = useState<CardFilterType[]>(['all'])
  const [sortBy, setSortBy] = useState<SortByValue>('recent')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [cardMode, setCardMode] = useState<'virtual' | 'universal'>('virtual')
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const cardStackRef = useRef<CardStackRef>(null)

  /**
   * Handles switching between virtual and universal card modes.
   * Resets selection state when mode changes.
   */
  const handleModeChange = useCallback((mode: 'virtual' | 'universal') => {
    setCardMode(mode)
    setSelectedCardId(null)
    setCurrentCardIndex(0)
  }, [])

  /**
   * Handles card filter changes and resets selection state
   * to avoid stale references to cards that may no longer be visible
   */
  const handleCardFiltersChange = useCallback((filters: CardFilterType[]) => {
    setCardFilters(filters)
    // Reset selection to avoid stale state
    setSelectedCardId(null)
    setCurrentCardIndex(0)
  }, [])

  /**
   * Filters and sorts cards based on:
   * 1. Card form (virtual/universal)
   * 2. Sort order (recently used / most used)
   * 3. Card type filters (debit, credit, prepaid, gift)
   */
  const filteredCards = useMemo(() => {
    // First filter by card form (virtual/universal)
    let cards = allCards.filter((card) => card.cardForm === cardMode)

    // Sort by selected option
    if (sortBy === 'recent') {
      cards = [...cards].sort((a, b) => {
        // Recently used first, then newest issuedDate
        if (a.recentlyUsed !== b.recentlyUsed) {
          return a.recentlyUsed ? -1 : 1
        }
        return (
          new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
        )
      })
    } else if (sortBy === 'most-used') {
      cards = [...cards].sort((a, b) => {
        // Most used first, then newest issuedDate
        if (a.mostUsed !== b.mostUsed) {
          return a.mostUsed ? -1 : 1
        }
        return (
          new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
        )
      })
    }

    // Then filter by card type filters
    if (cardFilters.includes('all') || cardFilters.length === 0) {
      return cards
    }

    return cards.filter((card) =>
      cardFilters.includes(card.cardType as CardFilterType)
    )

  }, [allCards, cardFilters, cardMode, sortBy])

  /**
   * Handles card press to open the card actions drawer
   */
  const handleCardPress = useCallback((card: CardData) => {
    setSelectedCardId(card.id)
    setDrawerVisible(true)
  }, [])

  const handleSelectCard = useCallback((card: CardData) => {
    setSelectedCardId(card.id)
  }, [])

  const handleActionPress = useCallback((actionId: string, card: CardData) => {
    console.log('Action pressed:', actionId, 'for card:', card.name)
  }, [])

  const handleAddPress = useCallback(() => {
    if (cardMode === 'universal') {
      setPendingCardForm('universal')
      router.push(routes.addUniversalFaceVerification)
    }
  }, [cardMode, router, setPendingCardForm])

  const { isDarkMode } = useAuth();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top controls — greeting + filters */}
      <div className="shrink-0 relative z-10">
        <GreetingBar
          userName="Nirdesh Malik"
          onSearchPress={() => { }}
          onAddPress={handleAddPress}
          mode={cardMode}
          onAvatarPress={openProfileDrawer}
          isDarkMode={isDarkMode}
          onAddGiftPress={() => { }}
        />
        <FilterBar
          isDarkMode={isDarkMode}
          mode={cardMode}
          onModeChange={handleModeChange}
          cardFilters={cardFilters}
          onCardFiltersChange={handleCardFiltersChange}
          sortBy={sortBy}
          onSortChange={(s) => {
            setSortBy(s)
            setSelectedCardId(null)
            setCurrentCardIndex(0)
            console.log('Sort changed:', s, 'Cards:', filteredCards)
          }}
        />
      </div>

      {/* Card area — fills remaining space */}
      <div className="flex-1 min-h-0 relative">
        {filteredCards.length > 0 ? (
          <CardStack
            ref={cardStackRef}
            cards={filteredCards}
            onCardChange={(index) => {
              setCurrentCardIndex(index)
            }}
            onCardPress={handleCardPress}
            isDrawerOpen={drawerVisible}
            selectedCardId={selectedCardId}
          />
        ) : (
          <div className="h-full flex justify-center items-center">
            <span className="text-base text-text-secondary">No card available</span>
          </div>
        )}

        {filteredCards.length > 0 && (
          <SwipeIndicator
            currentIndex={currentCardIndex}
            totalCount={filteredCards.length}
            onPreviousPress={() => cardStackRef.current?.goToPrevious()}
            onNextPress={() => cardStackRef.current?.goToNext()}
          />
        )}
      </div>

      {/* Bottom bar */}
      <FloatingBottomBar
        mode={cardMode}
        onScanPress={() => router.push(routes.scan)}
        onAddPress={handleAddPress}
        onAddGiftPress={() => { }}
      />

      {/* Card actions drawer */}
      <ActionDrawer
        visible={drawerVisible}
        cards={filteredCards}
        selectedCardId={selectedCardId ?? filteredCards[0]?.id}
        onClose={() => setDrawerVisible(false)}
        onSelectCard={handleSelectCard}
        onActionPress={handleActionPress}
        cardMode={cardMode}
        setCurrentCardIndex={setCurrentCardIndex}
        isDarkMode={isDarkMode}
      />
    </div>
  )
}
