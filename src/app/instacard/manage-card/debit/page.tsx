'use client'

import ManageDebitCardScreen from '@/components/screens/ManageCardsScreens/ManageDebitCardScreen'
import ManageCardPageWrapper from '@/components/screens/ManageCardsScreens/ManageCardPageWrapper'
import FloatingBottomBarLayoutClient from '@/components/screens/InstacardScreens/FloatingBottomBarLayoutClient'

export default function ManageDebitPage() {
  return (
    <ManageCardPageWrapper cardType="debit">
      <ManageDebitCardScreen />
      <FloatingBottomBarLayoutClient hidescan={true} />
    </ManageCardPageWrapper>
  )
}