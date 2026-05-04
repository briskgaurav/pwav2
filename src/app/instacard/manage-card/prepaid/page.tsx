'use client'

import ManageCardPageWrapper from '@/components/screens/ManageCardsScreens/ManageCardPageWrapper'
import ManagePrepaidCardScreen from '@/components/screens/ManageCardsScreens/ManagePrepaidCardScreen'

export default function ManagePrepaidPage() {
  return (
    <ManageCardPageWrapper cardType="prepaid">
      <ManagePrepaidCardScreen />
    </ManageCardPageWrapper>
  )
}
