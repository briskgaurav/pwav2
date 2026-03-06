'use client'
import { mockCards, CardData } from '@/components/StackingCard/cardData'
import { CardStack, CardStackRef } from '@/components/StackingCard/CardStack'
import { CardFilterType, FilterBar } from '@/components/StackingCard/FilterBar'
import GreetingBar from '@/components/StackingCard/greeting-bar'
import { SwipeIndicator } from '@/components/StackingCard/SwipeIndicator'
import FloatingBottomBar from '@/components/StackingCard/FloatingBottomBar'
import ActionDrawer from '@/components/StackingCard/ActionDrawer'
import { ProfileDrawer } from '@/components/ProfileDrawer'
import { ProfileContent } from '@/components/ProfileDrawer/ProfileContent'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useAuth } from '@/lib/auth-context'



export default function CardsScreen() {
  const [cardFilters, setCardFilters] = useState<CardFilterType[]>(['all'])
  const [recentFilterActive, setRecentFilterActive] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [cardMode, setCardMode] = useState<'virtual' | 'universal'>('virtual')
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [profileDrawerVisible, setProfileDrawerVisible] = useState(false)
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
   * Filters cards based on:
   * 1. Card form (virtual/universal)
   * 2. Recently used filter
   * 3. Card type filters (debit, credit, prepaid, gift)
   */
  const filteredCards = useMemo(() => {
    // First filter by card form (virtual/universal)
    let cards = mockCards.filter((card) => card.cardForm === cardMode)

    // Filter by recently used when sort/recent tab is active
    if (recentFilterActive) {
      cards = [...cards].sort(
        (a, b) =>
          new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
      )
    }

    // Then filter by card type filters
    // If 'all' is selected or no filters, show all cards of the selected form
    if (cardFilters.includes('all') || cardFilters.length === 0) {
      return cards
    }

    // Filter cards by selected types
    return cards.filter((card) =>
      cardFilters.includes(card.cardType as CardFilterType)
    )
  }, [cardFilters, cardMode, recentFilterActive])

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

  const { isDarkMode } = useAuth();

  return (
    <div className="min-h-full bg-background flex flex-col relative">
      <div className='relative z-100 '>

        <GreetingBar
          userName="Nirdesh Malik"
          onSearchPress={() => { }}
        
          onAvatarPress={() => setProfileDrawerVisible(true)}
          isDarkMode={isDarkMode}
        />
        <FilterBar
          isDarkMode={false}
          mode={cardMode}
          onModeChange={handleModeChange}
          cardFilters={cardFilters}
          onCardFiltersChange={handleCardFiltersChange}
          recentFilterActive={recentFilterActive}
          onRecentFilterPress={() => {
            setRecentFilterActive((prev) => !prev)
            setSelectedCardId(null)
            setCurrentCardIndex(0)
          }}
        />
      </div>

      {/* Card stack positioned behind the UI elements */}
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
        // Empty state when no cards match the current filters
        <div className="flex-1 flex justify-center items-center">
          <span className="text-base text-text-secondary">No card available</span>
        </div>
      )}

      {/* Swipe indicator showing current card position */}
      {filteredCards.length > 0 && (
        <SwipeIndicator
          currentIndex={currentCardIndex}
          totalCount={filteredCards.length}
          onPreviousPress={() => cardStackRef.current?.goToPrevious()}
          onNextPress={() => cardStackRef.current?.goToNext()}
        />
      )}

      {/* Floating bottom navigation bar */}
      <FloatingBottomBar
        onScanPress={() => { }}
        onAddPress={() => { }}
        onAddGiftPress={() => { }}
      />

      {/* Card actions drawer for managing selected card */}
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

      {/* Profile drawer opened from avatar tap */}
      <ProfileDrawer
        visible={profileDrawerVisible}
        onClose={() => setProfileDrawerVisible(false)}
      >
        {(closeDrawer) => (
          <ProfileContent
            userName="Nirdesh Malik"
            onClose={closeDrawer}
          />
        )}
      </ProfileDrawer>
    </div>
  )
}
