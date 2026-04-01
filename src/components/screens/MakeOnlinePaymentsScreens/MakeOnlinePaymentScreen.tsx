'use client'

import React, { useEffect } from 'react'
import { SheetContainer } from '@/components/ui'
import CardPinAuth from '@/components/screens/AuthScreens/CardPinAuth'
import VirtualCardDetails from '@/components/ui/VirtualCardDetails'
import RecentTransactionsList from '@/components/ui/RecentTransactionsList'
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { setVerified, resetSession, refreshData, setRefreshStart } from '@/store/redux/slices/onlinePaymentSlice'
import { CARD_CONFIG } from '@/lib/card-config'
import PullToRefresh from '@/components/ui/PullToRefresh'
import { useManagingCard } from '@/hooks/useManagingCard'
import LayoutSheet from '../../ui/LayoutSheet'
import FloatingBottomBarLayoutClient from '../InstacardScreens/FloatingBottomBarLayoutClient'

export default function MakeOnlinePaymentScreen() {
  const dispatch = useAppDispatch()
  const isVerified = useAppSelector((s) => s.onlinePayment.isVerified)
  const cardDetails = useAppSelector((s) => s.onlinePayment.cardDetails)
  const config = CARD_CONFIG[cardDetails.cardType]
  const { imageSrc, maskedNumber, cardNumber } = useManagingCard()

  useEffect(() => {
    return () => {
      dispatch(resetSession())
    }
  }, [dispatch])

  // Screen 2: PIN Authentication
  if (!isVerified) {
    return (
      <div className="h-dvh flex flex-col">
        <CardPinAuth
          title="Enter PIN for selected Instacard"
          cardImageSrc={imageSrc ?? config.image}
          maskedNumber={maskedNumber ?? cardDetails.maskedNumber}
          onVerified={() => dispatch(setVerified(true))}
        />
      </div>
    )
  }

  // Screen 3: Virtual Card Details (payment-ready)
  return (
    <LayoutSheet needPadding={false} routeTitle="Make Online Payments">
        <PullToRefresh onRefresh={() => { dispatch(setRefreshStart()); setTimeout(() => dispatch(refreshData()), 1500) }}>
          <div className="h-full overflow-y-auto pb-[20%]">
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
      <FloatingBottomBarLayoutClient hidescan={true} />

    </LayoutSheet>
  )
}
