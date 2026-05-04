'use client'

import React, { useState } from 'react'

import CardPinAuth from '@/components/screens/AuthScreens/CardPinAuth'
import { useManagingCard } from '@/hooks/useManagingCard'
import { CARD_CONFIG } from '@/lib/card-config'
import type { CardType } from '@/lib/types'

type ManageCardPageWrapperProps = {
  cardType: CardType
  children: React.ReactNode
}

export default function ManageCardPageWrapper({ cardType, children }: ManageCardPageWrapperProps) {
  const [isVerified, setIsVerified] = useState(false)
  const config = CARD_CONFIG[cardType]
  const { imageSrc, maskedNumber } = useManagingCard()

  const handleVerified = () => {
    setIsVerified(true)
  }

  if (!isVerified) {
    return (
      <CardPinAuth
        title={`Enter PIN to Manage this ${config.label}`}
        cardImageSrc={imageSrc ?? config.mockupImage}
        maskedNumber={maskedNumber ?? '0000 0000 0000 0000'}
        onVerified={handleVerified}
      />
    )
  }

  return <>{children}</>
}
