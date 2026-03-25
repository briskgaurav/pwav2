'use client'

import ManageGiftCardScreen from '@/components/screens/ManageCardsScreens/ManageGiftCardScreen'
import ManageCardPageWrapper from '@/components/screens/ManageCardsScreens/ManageCardPageWrapper'
import FloatingBottomBarLayoutClient from '@/components/screens/InstacardScreens/FloatingBottomBarLayoutClient'

export default function ManageGiftPage() {
  return (
    <ManageCardPageWrapper cardType="gift">
      <ManageGiftCardScreen />
      <FloatingBottomBarLayoutClient hidescan={true} />
    </ManageCardPageWrapper>
  )
}
