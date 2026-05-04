'use client'

import { useRouter } from 'next/navigation'

import CardPinAuth from '@/components/screens/AuthScreens/CardPinAuth'
import { useManagingCard } from '@/hooks/useManagingCard'
import { routes } from '@/lib/routes'

export default function PinChangePage() {
    const router = useRouter()
    const { mockupImageSrc, maskedNumber } = useManagingCard()

    const handleVerified = () => {
        router.push(routes.pinChangeSetup)
    }

    return (
        <CardPinAuth
            title="Verify PIN for Selected Instacard"
            cardImageSrc={mockupImageSrc ?? '/img/cards/DebitCard.png'}
            maskedNumber={maskedNumber}
            onVerified={handleVerified}
        />
    )
}
