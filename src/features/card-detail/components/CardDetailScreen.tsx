'use client'

import { SheetContainer } from '@/components/ui'
import TransactionHistoryItem from '@/components/ui/TransactionHistoryItem'
import React, { useState } from 'react'
import CardPinAuth from '@/features/card-detail/components/CardPinAuth'
import CardMockup from '@/components/ui/CardMockup'
import { CARD_CONFIG } from '@/lib/card-config'
import type { CardType } from '@/lib/types'

type CardDetailScreenProps = {
  cardType: CardType
}

export default function CardDetailScreen({ cardType }: CardDetailScreenProps) {
  const config = CARD_CONFIG[cardType]
  const [isVerified, setIsVerified] = useState(false)

  if (!isVerified) {
    return (
      <CardPinAuth
        title="Enter PIN for Selected Instacard"
        cardImageSrc={config.image}
        maskedNumber="0000 0000 0000 0000"
        onVerified={() => setIsVerified(true)}
      />
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <SheetContainer>
        <div className="flex-1 overflow-auto pb-10">
          <div className='w-full flex items-center pt-5 px-5 justify-center'>
            <CardMockup imageSrc={config.image} />
          </div>
          <div className="text-md p-6 h-[42vh] border-t mt-5 border-text-primary/20 rounded-t-2xl text-text-primary">
            <div className="w-full flex items-center justify-between">
              <p className="text-md font-medium text-center text-text-primary">
                Transactions History
              </p>
              <p className="text-xs text-center text-text-primary">
                Pull down to Refresh
              </p>
            </div>
            <TransactionHistoryItem />
          </div>
        </div>
      </SheetContainer>
    </div>
  )
}
