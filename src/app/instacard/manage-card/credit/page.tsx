'use client'

import FloatingBottomBarLayoutClient from '@/components/screens/InstacardScreens/FloatingBottomBarLayoutClient'
import ManageCardPageWrapper from '@/components/screens/ManageCardsScreens/ManageCardPageWrapper'
import ManageCreditCardScreen from '@/components/screens/ManageCardsScreens/ManageCreditCardScreen'

export default function ManageCreditPage() {
  return (
    <ManageCardPageWrapper cardType="credit">
      <ManageCreditCardScreen />
      <FloatingBottomBarLayoutClient hidescan={true} />
    </ManageCardPageWrapper>
  )
}
