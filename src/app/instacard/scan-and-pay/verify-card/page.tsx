'use client'
import CardPinAuth from '@/components/screens/AuthScreens/CardPinAuth'
import { routes } from '@/lib/routes'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useAppSelector } from '@/store/redux/hooks'

export default function page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cards = useAppSelector((s) => s.cardWallet.cards)

  const amount = searchParams.get('amount') ?? '0'
  const message = searchParams.get('message') ?? ''
  const recipientName = searchParams.get('recipientName') ?? ''
  const method = searchParams.get('method') ?? ''

  const cardId = searchParams.get('cardId') ?? ''
  const maskedNumberParam = searchParams.get('maskedNumber') ?? ''
  const cardImageSrcParam = searchParams.get('cardImageSrc') ?? ''

  const resolvedCard = cardId ? cards.find((c) => c.id === cardId) : undefined
  const cardImageSrc = cardImageSrcParam || '/img/cards/DebitCard.png'
  const maskedNumber = maskedNumberParam || resolvedCard?.cardNumber || '0000 0000 0000 0000'

  return (
    <CardPinAuth
      title="Enter PIN to Pay"
      cardImageSrc={cardImageSrc}
      maskedNumber={maskedNumber}
      onVerified={() => {
        const params = new URLSearchParams()
        params.set('amount', amount)
        if (message) params.set('message', message)
        if (recipientName) params.set('recipientName', recipientName)
        if (method) params.set('method', method)
        if (cardId) params.set('cardId', cardId)
        router.push(`${routes.paymentSuccess}?${params.toString()}`)
      }}
    />
  )
}
