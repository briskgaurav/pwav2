'use client'

import ManageCreditCardScreen from '@/features/manage-card/components/ManageCreditCardScreen'
import ManageCardPageWrapper from '@/features/manage-card/components/ManageCardPageWrapper'
import FloatingBottomBarLayoutClient from '@/components/StackingCard/FloatingBottomBarLayoutClient'

export default function ManageCreditPage() {
  return (
    <ManageCardPageWrapper cardType="credit">
      <ManageCreditCardScreen />
      <FloatingBottomBarLayoutClient hidescan={true} />
    </ManageCardPageWrapper>
  )
}
