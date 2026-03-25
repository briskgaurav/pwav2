'use client'

import ManageCreditCardScreen from '@/components/screens/ManageCardsScreens/ManageCreditCardScreen'
import ManageCardPageWrapper from '@/components/screens/ManageCardsScreens/ManageCardPageWrapper'
import FloatingBottomBarLayoutClient from '@/components/screens/InstacardScreens/FloatingBottomBarLayoutClient'

export default function ManageCreditPage() {
  return (
    <ManageCardPageWrapper cardType="credit">
      <ManageCreditCardScreen />
      <FloatingBottomBarLayoutClient hidescan={true} />
    </ManageCardPageWrapper>
  )
}
