import LayoutSheet from '@/components/screens/components/LayoutSheet'
import QRScanScreen from '@/components/screens/Scan&PayScreens/QRScanScreen'
import React from 'react'

export default function page() {
  return (
    <LayoutSheet needPadding={false} routeTitle="Scan & Pay">
      <QRScanScreen />
    </LayoutSheet>
  )
}
