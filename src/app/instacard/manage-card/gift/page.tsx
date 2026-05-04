'use client'

import FloatingBottomBarLayoutClient from '@/components/screens/InstacardScreens/FloatingBottomBarLayoutClient'
import ManageCardPageWrapper from '@/components/screens/ManageCardsScreens/ManageCardPageWrapper'
import ManageGiftCardScreen from '@/components/screens/ManageCardsScreens/ManageGiftCardScreen'

export default function ManageGiftPage() {
  return (
    <ManageCardPageWrapper cardType="gift">
      <ManageGiftCardScreen />
      <FloatingBottomBarLayoutClient hidescan={true} />
    </ManageCardPageWrapper>
  )
}
