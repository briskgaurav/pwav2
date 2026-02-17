'use client'

import React, { useState } from 'react'
import CardPinAuth from '@/features/card-detail/components/CardPinAuth'
import { CARD_CONFIG } from '@/lib/card-config'
import type { CardType } from '@/lib/types'

type ManageCardPageWrapperProps = {
  cardType: CardType
  children: React.ReactNode
}

export default function ManageCardPageWrapper({ cardType, children }: ManageCardPageWrapperProps) {
  const [isVerified, setIsVerified] = useState(false)
  const config = CARD_CONFIG[cardType]

  if (!isVerified) {
    return (
      <CardPinAuth
        title={`Enter PIN to Manage this ${config.label}`}
        cardImageSrc={config.mockupImage}
        maskedNumber="0000 0000 0000 0000"
        onVerified={() => setIsVerified(true)}
      />
    )
  }

  return <>{children}</>
}
