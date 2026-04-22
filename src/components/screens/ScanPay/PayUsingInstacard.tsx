'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { CardData } from '@/constants/cardData'
import { CardStack, CardStackRef } from '../InstacardScreens/CardStack'
import { CardFilterType, ScanPayFilterBar, type SortByValue } from './ScanPayFilterBar'
import { SwipeIndicator } from '../InstacardScreens/SwipeIndicator'
import { useAppSelector } from '@/store/redux/hooks'
import { useAuth } from '@/lib/auth-context'
import ButtonComponent from '@/components/ui/ButtonComponent'

export default function PayUsingInstacard() {
  const allCards = useAppSelector((s) => s.cardWallet.cards)
  const { isDarkMode } = useAuth()

  const [cardFilters, setCardFilters] = useState<CardFilterType[]>(['all'])
  const [sortBy, setSortBy] = useState<SortByValue>('recent')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
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
    return cards.filter((card) => cardFilters.includes(card.cardType as CardFilterType))
  }, [allCards, cardFilters, sortBy])

  const handleCardPress = useCallback((card: CardData) => {
    setSelectedCardId(card.id)
  }, [])

  return (
    <>
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
      <div className="flex-1 min-h-0 w-full relative">
        {filteredCards.length > 0 ? (
          <CardStack
            ref={cardStackRef}
            cards={filteredCards}
            onCardChange={(index: number) => setCurrentCardIndex(index)}
            onCardPress={handleCardPress}
            isDrawerOpen={false}
            selectedCardId={selectedCardId}
          />
        ) : (
          <div className="h-full flex justify-center items-center">
            <span className="text-base text-text-secondary">No card available</span>
          </div>
        )}

          {filteredCards.length > 0 && (
            <SwipeIndicator
            bottomPosition='bottom-[10%]'
              currentIndex={currentCardIndex}
              totalCount={filteredCards.length}
              onPreviousPress={() => cardStackRef.current?.goToPrevious()}
              onNextPress={() => cardStackRef.current?.goToNext()}
            />
          )}
      </div>

      {/* Pay using other cards button */}
      <div className="shrink-0 px-4 pb-6 pt-2">
       <ButtonComponent title='Pay N100' onClick={()=>{}} />
      </div>
    </>
  )
}
