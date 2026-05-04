import React from 'react'

import QRScanScreen from '@/components/screens/Scan&PayScreens/QRScanScreen'
import LayoutSheet from '@/components/ui/LayoutSheet'

export default function page() {
  return (
    <LayoutSheet needPadding={false} routeTitle="Scan & Pay">
      <QRScanScreen />
    </LayoutSheet>
  )
}
