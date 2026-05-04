'use client'

import FloatingBottomBarLayoutClient from '@/components/screens/InstacardScreens/FloatingBottomBarLayoutClient'
import ManageCardPageWrapper from '@/components/screens/ManageCardsScreens/ManageCardPageWrapper'
import ManageDebitCardScreen from '@/components/screens/ManageCardsScreens/ManageDebitCardScreen'

export default function ManageDebitPage() {
  return (
    <ManageCardPageWrapper cardType="debit">
      <ManageDebitCardScreen />
      <FloatingBottomBarLayoutClient hidescan={true} />
    </ManageCardPageWrapper>
  )
}