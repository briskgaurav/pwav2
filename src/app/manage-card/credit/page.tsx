'use client'

import ManageCreditCardScreen from '@/features/manage-card/components/ManageCreditCardScreen'
import ManageCardPageWrapper from '@/features/manage-card/components/ManageCardPageWrapper'

export default function ManageCreditPage() {
  return (
    <ManageCardPageWrapper cardType="credit">
      <ManageCreditCardScreen />
    </ManageCardPageWrapper>
  )
}
