'use client'
import { CardData, type CardType, type CardImageId } from '../../../constants/cardData'
import { CardStack, CardStackRef } from './CardStack'
import { CardFilterType, FilterBar, type SortByValue } from './FilterBar'
import { GreetingBar } from './greeting-bar'
import { SwipeIndicator } from './SwipeIndicator'
import ActionDrawer from './ActionDrawer'
import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { routes } from '@/lib/routes'
import { MOCK_HOST_CONTEXT } from '@/lib/api/__mocks__/hostContext'
import { universalCardStableId } from '@/lib/api/cards'
import LeftSideDrawer from '@/components/LeftSideDrawer'
import { ProfileContent } from '@/components/screens/Drawers/ProfileContent'
import FloatingBottomBarLayoutClient from './FloatingBottomBarLayoutClient'
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks'
import { fetchAllCards, selectVirtualCards, selectUniversalCards } from '@/store/redux/slices/cardDataWalletSlice'


export default function MainInstacardScreen() {
  const router = useRouter()
  const [cardMode, setCardMode] = useState<'virtual' | 'universal'>('universal')
  const userName = MOCK_HOST_CONTEXT.customerName
  const userEmail = MOCK_HOST_CONTEXT.recipientEmail
  const [cardFilters, setCardFilters] = useState<CardFilterType[]>(['all'])
  const [sortBy, setSortBy] = useState<SortByValue>('recent')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(false)
  const cardStackRef = useRef<CardStackRef>(null)

  const dispatch = useAppDispatch()
  const virtualCardsData = useAppSelector(selectVirtualCards)
  const universalCardsData = useAppSelector(selectUniversalCards)

  useEffect(() => {
    dispatch(fetchAllCards())
  }, [dispatch])

  const apiCards = useMemo(() => {
    const sourceCards = cardMode === 'virtual' ? virtualCardsData : universalCardsData

    return sourceCards.map((c: any, index: number) => {
      let cardType: CardType = 'DEBIT_CARD'
      const rawType = (c.cardType || '').toUpperCase()
      if (rawType.includes('CREDIT')) cardType = 'CREDIT_CARD'
      else if (rawType.includes('PREPAID')) cardType = 'PREPAID_CARD'
      else if (rawType.includes('GIFT')) cardType = 'GIFT_CARD'

      let imageId: CardImageId = 1
      if (cardType === 'CREDIT_CARD') imageId = 2
      else if (cardType === 'PREPAID_CARD') imageId = 3
      else if (cardType === 'GIFT_CARD') imageId = 4

      if (cardMode === 'universal') {
        imageId = 5
      }

      const rowId =
        cardMode === 'universal' ? universalCardStableId(c) : c.cardId

      return {
        id: rowId,
        imageId,
        name: `${cardType.replace('_', ' ')}`,
        cardHolder: userName,
        cardNumber:
          cardMode === 'universal'
            ? (c.ucPanMasked ?? c.maskedCardNumber ?? '**** **** **** ****')
            : ((c.maskedPan ?? c.maskedCardNumber) || '**** **** **** ****'),
        pin: '0000',
        expiry: c.expiry || '12/28', // Dummy expiry
        balance: c.balance || 0,
        cardType,
        cardForm: cardMode,
        recentlyUsed: index === 0,
        mostUsed: index === 0,
        issuedDate: new Date().toISOString().split('T')[0],
        previousUsedCount: 0,
      } as CardData
    })
  }, [cardMode, virtualCardsData, universalCardsData, userName])



  /**
   * Handles switching between virtual and universal card modes.
   * Resets selection state when mode changes.
   */
  const handleModeChange = useCallback((mode: 'virtual' | 'universal') => {
    setCardMode(mode)
    setSelectedCardId(null)
    setCurrentCardIndex(0)
  }, [setCardMode])

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
    let cards = apiCards.filter((card) => card.cardForm === cardMode)

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

    return cards.filter((card) => {
      const filterValue = card.cardType.split('_')[0].toLowerCase() as CardFilterType
      return cardFilters.includes(filterValue)
    })

  }, [apiCards, cardFilters, cardMode, sortBy])

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

  const { isDarkMode } = useAuth()

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Top controls — greeting + filters */}
      <div className="shrink-0 relative z-10">
        <GreetingBar
          userName={userName}
          mode={cardMode}
          onAvatarPress={() => setLeftDrawerVisible(true)}
        />
        <FilterBar
          isDarkMode={isDarkMode}
          mode={cardMode}
          onModeChange={handleModeChange}
          cardFilters={cardFilters}
          onCardFiltersChange={handleCardFiltersChange}
          sortBy={sortBy}
          onSortChange={(s: SortByValue) => {
            setSortBy(s)
            setSelectedCardId(null)
            setCurrentCardIndex(0)
            console.log('Sort changed:', s, 'Cards:', filteredCards)
          }}
        />
      </div>

      {/* Card area — fills remaining space */}
      <div className="flex-1 min-h-0 w-full mx-auto relative">
        {filteredCards.length > 0 ? (
          <CardStack
            ref={cardStackRef}
            cards={filteredCards}
            onCardChange={(index: number) => {
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

      <LeftSideDrawer
        visible={leftDrawerVisible}
        onClose={() => setLeftDrawerVisible(false)}
      >
        <ProfileContent
          userName={userName}
          userEmail={userEmail}
          onClose={() => setLeftDrawerVisible(false)}
        />
      </LeftSideDrawer>
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
      <FloatingBottomBarLayoutClient hidescan={false} isFixed={false} />

    </div>
  )
}
