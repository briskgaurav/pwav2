'use client'

import { useRouter } from 'next/navigation'
import PinSetupForm from '@/components/screens/AuthScreens/PinSetupFormScreen'
import { routes } from '@/lib/routes'
import { useAppDispatch } from '@/store/redux/hooks'
import { setPendingPin } from '@/store/redux/slices/cardWalletSlice'
import type { CardType } from '@/lib/types'

export default function UniversalPinSetupPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleSubmit = async (pin: string, _cardType: CardType) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    dispatch(setPendingPin(pin))
    router.push(routes.addUniversalSuccess)
  }

  return (
    <PinSetupForm
      title="PIN Setup"
      subtitle="Please setup your PIN for your Universal Card"
      pinLabel="Enter 4-digit PIN"
      confirmPinLabel="Re-Enter PIN"
      onSubmit={handleSubmit}
    />
  )
}
