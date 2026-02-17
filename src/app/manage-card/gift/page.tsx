'use client'

import ManageGiftCardScreen from '@/features/manage-card/components/ManageGiftCardScreen'
import ManageCardPageWrapper from '@/features/manage-card/components/ManageCardPageWrapper'

export default function ManageGiftPage() {
  return (
    <ManageCardPageWrapper cardType="gift">
      <ManageGiftCardScreen />
    </ManageCardPageWrapper>
  )
}
