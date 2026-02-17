'use client'

import ManagePrepaidCardScreen from '@/features/manage-card/components/ManagePrepaidCardScreen'
import ManageCardPageWrapper from '@/features/manage-card/components/ManageCardPageWrapper'

export default function ManagePrepaidPage() {
  return (
    <ManageCardPageWrapper cardType="prepaid">
      <ManagePrepaidCardScreen />
    </ManageCardPageWrapper>
  )
}
