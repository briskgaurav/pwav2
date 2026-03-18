'use client'

import React, { useEffect } from 'react'
import { SheetContainer } from '@/components/ui'
import CardPinAuth from '@/features/card-detail/components/CardPinAuth'
import VirtualCardDetails from './VirtualCardDetails'
import RecentTransactionsList from './RecentTransactionsList'
import { useOnlinePaymentStore } from '../store/useOnlinePaymentStore'
import { CARD_CONFIG } from '@/lib/card-config'
import PullToRefresh from '@/components/ui/PullToRefresh'
import { useManagingCard } from '@/hooks/useManagingCard'

export default function MakeOnlinePaymentScreen() {
  const isVerified = useOnlinePaymentStore((s) => s.isVerified)
  const setVerified = useOnlinePaymentStore((s) => s.setVerified)
  const resetSession = useOnlinePaymentStore((s) => s.resetSession)
  const cardDetails = useOnlinePaymentStore((s) => s.cardDetails)
  const refreshData = useOnlinePaymentStore((s) => s.refreshData)
  const config = CARD_CONFIG[cardDetails.cardType]
  const { imageSrc, maskedNumber, cardNumber } = useManagingCard()

  useEffect(() => {
    return () => {
      resetSession()
    }
  }, [resetSession])

  // Screen 2: PIN Authentication
  if (!isVerified) {
    return (
      <div className="h-dvh flex flex-col">
        <CardPinAuth
          title="Enter PIN for selected Instacard"
          cardImageSrc={imageSrc ?? config.image}
          maskedNumber={maskedNumber ?? cardDetails.maskedNumber}
          onVerified={() => setVerified(true)}
        />
      </div>
    )
  }

  // Screen 3: Virtual Card Details (payment-ready)
  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <SheetContainer>
        <PullToRefresh onRefresh={refreshData}>
          <div className="h-full overflow-y-auto pb-10">
            {/* Card section */}
            <div className="px-5 pt-10">
              <VirtualCardDetails cardImageSrc={imageSrc ?? config.image} maskedNumber={maskedNumber ?? cardDetails.maskedNumber} cardNumber={cardNumber ?? cardDetails.pan} />
            </div>

            {/* Transactions section */}
            <div className="mt-4 border-t border-text-primary/10 rounded-t-2xl">
              <div className="px-5 pt-4">
                <RecentTransactionsList />
              </div>
            </div>
          </div>
        </PullToRefresh>
      </SheetContainer>
    </div>
  )
}
