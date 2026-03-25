'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { haptic } from '@/lib/useHaptics'
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { removeCard } from '@/store/redux/slices/cardWalletSlice'
import { routes } from '@/lib/routes'
import type { CardAction } from '../constants/getmanageBtn'

export function useManageCardActions() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const managingCardId = useAppSelector((s) => s.cardWallet.managingCardId)

  const handleCardActionClick = (action: CardAction) => {
    if (action.text === 'Remove Card') {
      setShowRemoveModal(true)
    } else {
      router.push(action.route)
      haptic('heavy')
    }
  }

  const handleRemoveCard = () => {
    if (managingCardId) {
      dispatch(removeCard(managingCardId))
    }
    setShowRemoveModal(false)
    router.push(routes.instacard)
  }

  return {
    showRemoveModal,
    setShowRemoveModal,
    handleCardActionClick,
    handleRemoveCard,
  }
}
