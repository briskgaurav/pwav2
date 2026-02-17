'use client'

import ManageDebitCardScreen from '@/features/manage-card/components/ManageDebitCardScreen'
import ManageCardPageWrapper from '@/features/manage-card/components/ManageCardPageWrapper'

export default function ManageDebitPage() {
  return (
    <ManageCardPageWrapper cardType="debit">
      <ManageDebitCardScreen />
    </ManageCardPageWrapper>
  )
}