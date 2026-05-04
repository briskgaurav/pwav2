import React from 'react'

import ChooseCards from '@/components/screens/ScanPay/ChooseCards'
import LayoutSheet from '@/components/ui/LayoutSheet'

export default function page() {
  return (
    <LayoutSheet needPadding={false} routeTitle="Scan & Pay">
     <ChooseCards amount={0} message="" recipientName="" />
    </LayoutSheet>
  )
}
