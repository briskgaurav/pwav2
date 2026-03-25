'use client'

import ManageDebitCardScreen from '@/features/manage-card/components/ManageDebitCardScreen'
import ManageCardPageWrapper from '@/features/manage-card/components/ManageCardPageWrapper'
import FloatingBottomBarLayoutClient from '@/components/screens/InstacardScreens/FloatingBottomBarLayoutClient'

export default function ManageDebitPage() {
  return (
    <ManageCardPageWrapper cardType="debit">
      <ManageDebitCardScreen />
      <FloatingBottomBarLayoutClient hidescan={true} />
    </ManageCardPageWrapper>
  )
}