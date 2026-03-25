import LayoutSheet from '@/components/ui/LayoutSheet'
import MakePaymentsScreen from '@/components/screens/Scan&PayScreens/MakePaymentsScreen'
import React from 'react'

export default function page() {
  return (
    <LayoutSheet routeTitle="Make Payment">
      <MakePaymentsScreen />
    </LayoutSheet>
  )
}
