'use client'

import ManageGiftCardScreen from '@/features/manage-card/components/ManageGiftCardScreen'
import ManageCardPageWrapper from '@/features/manage-card/components/ManageCardPageWrapper'
import FloatingBottomBarLayoutClient from '@/components/screens/InstacardScreens/FloatingBottomBarLayoutClient'

export default function ManageGiftPage() {
  return (
    <ManageCardPageWrapper cardType="gift">
      <ManageGiftCardScreen />
      <FloatingBottomBarLayoutClient hidescan={true} />
    </ManageCardPageWrapper>
  )
}
