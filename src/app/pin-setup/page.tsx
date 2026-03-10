'use client'

import { useRouter } from 'next/navigation'
import PinSetupForm from '@/features/pin/components/PinSetupForm'
import { routes } from '@/lib/routes'
import { useCardWalletStore } from '@/store/useCardWalletStore'
import type { CardType } from '@/lib/types'

export default function PinSetupPage() {
  const router = useRouter()
  const addCard = useCardWalletStore((s) => s.addCard)

  const setPendingPin = useCardWalletStore((s) => s.setPendingPin)

  const handleSubmit = async (pin: string, cardType: CardType) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setPendingPin(pin)
    const newCard = addCard(cardType)
    console.log('Card added:', newCard)
    router.push(routes.howToUseCard(cardType))
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
