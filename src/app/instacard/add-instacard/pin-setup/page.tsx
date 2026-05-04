'use client'

import { useRouter } from 'next/navigation'

import PinSetupForm from '@/components/screens/AuthScreens/PinSetupFormScreen'
import { routes } from '@/lib/routes'
import type { CardType } from '@/lib/types'
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks'
import { setPendingPin, addCard } from '@/store/redux/slices/cardWalletSlice'

export default function PinSetupPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const fullName = useAppSelector((s) => s.user.fullName)

  const handleSubmit = async (pin: string, cardType: CardType) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    dispatch(setPendingPin(pin))
    dispatch(addCard({ cardType, cardHolderName: fullName }))
    router.replace(routes.howToUseCard(cardType))
  }

  return (
    <PinSetupForm
      title="PIN Setup"
      subtitle="Please setup your PIN for this Instacard"
      pinLabel="Enter 4-digit PIN"
      confirmPinLabel="Re-Enter PIN"
      onSubmit={handleSubmit}
    />
  )
}
