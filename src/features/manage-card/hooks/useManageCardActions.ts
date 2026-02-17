'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { haptic } from '@/lib/useHaptics'
import { cardActions } from '../constants'

export function useManageCardActions() {
  const router = useRouter()
  const [showRemoveModal, setShowRemoveModal] = useState(false)

  const handleCardActionClick = (action: typeof cardActions[number]) => {
    if (action.text === 'Remove Card') {
      setShowRemoveModal(true)
    } else {
      router.push(action.route)
      haptic('heavy')
    }
  }

  const handleRemoveCard = () => {
    console.log('Card removed')
    setShowRemoveModal(false)
  }

  return {
    showRemoveModal,
    setShowRemoveModal,
    handleCardActionClick,
    handleRemoveCard,
  }
}
