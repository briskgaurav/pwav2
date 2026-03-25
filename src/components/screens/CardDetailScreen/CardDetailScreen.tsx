'use client'

import TransactionHistoryItem from '@/components/ui/TransactionHistoryItem'
import { useState } from 'react'
import CardPinAuth from '@/components/screens/AuthScreens/CardPinAuth'
import CardMockup from '@/components/ui/CardMockup'
import { CARD_CONFIG } from '@/lib/card-config'
import type { CardType } from '@/lib/types'
import { useManagingCard } from '@/hooks/useManagingCard'
import LayoutSheet from '../../ui/LayoutSheet'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'


type CardDetailScreenProps = {
  cardType: CardType
}

export default function CardDetailScreen({ cardType }: CardDetailScreenProps) {
  const config = CARD_CONFIG[cardType]
  const [isVerified, setIsVerified] = useState(false)
  const { imageSrc, maskedNumber } = useManagingCard()
  const router = useRouter()
  if (!isVerified) {
    return (
      <CardPinAuth
        title="Enter PIN for Selected Instacard"
        cardImageSrc={imageSrc ?? config.image}
        maskedNumber={maskedNumber ?? '0000 0000 0000 0000'}
        onVerified={() => setIsVerified(true)}
      />
    )
  }

  return (
    <LayoutSheet routeTitle="Card Detail" needPadding={false}>
      <div className="flex-1 overflow-auto pb-10">
        <div className='w-full flex items-center pt-5 px-5 justify-center'>
          <CardMockup imageSrc={imageSrc ?? config.image} maskedNumber={maskedNumber} />
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
    </LayoutSheet>
  )
}
