'use client'

import ManagePrepaidCardScreen from '@/components/screens/ManageCardsScreens/ManagePrepaidCardScreen'
import ManageCardPageWrapper from '@/components/screens/ManageCardsScreens/ManageCardPageWrapper'

export default function ManagePrepaidPage() {
  return (
    <ManageCardPageWrapper cardType="PREPAID_CARD">
      <ManagePrepaidCardScreen />
    </ManageCardPageWrapper>
  )
}
