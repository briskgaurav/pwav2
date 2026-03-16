'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import CardPinAuth from '@/features/card-detail/components/CardPinAuth'
import { CARD_CONFIG } from '@/lib/card-config'
import type { CardType } from '@/lib/types'
import { useManagingCard } from '@/hooks/useManagingCard'

type ManageCardPageWrapperProps = {
  cardType: CardType
  children: React.ReactNode
}

// Session storage key to track if PIN was already verified
const PIN_VERIFIED_KEY = 'manage_card_pin_verified'

export default function ManageCardPageWrapper({ cardType, children }: ManageCardPageWrapperProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const config = CARD_CONFIG[cardType]
  const { imageSrc, maskedNumber } = useManagingCard()
  const hasCheckedSession = useRef(false)
  const pathname = usePathname()

  useEffect(() => {
    if (hasCheckedSession.current) return
    hasCheckedSession.current = true

    // Check if PIN was already verified in this session
    const wasVerified = sessionStorage.getItem(PIN_VERIFIED_KEY)
    if (wasVerified === 'true') {
      setIsVerified(true)
    }
    setIsLoading(false)
  }, [])

  // Clear session when navigating to /instacard
  useEffect(() => {
    const handleBeforeUnload = () => {
      // This won't work for SPA navigation, so we use pathname check
    }

    // Clear session if user navigates away to /instacard
    const handleRouteChange = () => {
      if (pathname === '/instacard') {
        sessionStorage.removeItem(PIN_VERIFIED_KEY)
      }
    }

    handleRouteChange()

    return () => {
      // Cleanup if needed
    }
  }, [pathname])

  // Clear session storage when component unmounts and user goes to /instacard
  useEffect(() => {
    return () => {
      // Check if the next route is /instacard by checking the current pathname
      // This will be called on unmount
      const currentPath = window.location.pathname
      if (currentPath === '/instacard') {
        sessionStorage.removeItem(PIN_VERIFIED_KEY)
      }
    }
  }, [])

  const handleVerified = () => {
    sessionStorage.setItem(PIN_VERIFIED_KEY, 'true')
    setIsVerified(true)
  }

  if (isLoading) {
    return null
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
