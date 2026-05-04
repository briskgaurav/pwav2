'use client'

import { useState, Suspense } from 'react'
import CardToggle, { PayMode } from '@/components/ui/CardToggle'
import PayUsingInstacard from './PayUsingInstacard'
import PayUsingBalance from './PayUsingBalance'
import PayUsingOtherCards from './PayUsingOtherCards'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { CARD_IMAGE_PATHS } from '@/constants/cardData'

type ChooseCardsProps = {
  amount: number
  message?: string
  recipientName?: string
}

// Type for "other" Pay card param, as used in PayUsingOtherCards
type OtherCardPayload = {
  card: {
    id: string
    imageId: keyof typeof CARD_IMAGE_PATHS
    cardNumber: string
    // add any additional needed properties if used in PayUsingOtherCards
  }
}

export default function ChooseCards({ amount, message = '', recipientName = '' }: ChooseCardsProps) {
    const [payMode, setPayMode] = useState<PayMode>('instacard')
    const router = useRouter()

    return (
        <div className="flex flex-col relative h-full">
            <CardToggle active={payMode} onChange={setPayMode} />
            <Suspense fallback={<div className='h-4  w-4 border border-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-spin' />}>
                {payMode === 'instacard' ? (
                  <PayUsingInstacard
                    amount={amount}
                    onPay={({ card }) => {
                      const params = new URLSearchParams()
                      params.set('amount', String(amount ?? 0))
                      params.set('method', 'instacard')
                      params.set('cardId', card.id)
                      params.set('cardImageSrc', CARD_IMAGE_PATHS[card.imageId])
                      params.set('maskedNumber', card.cardNumber)
                      if (message.trim()) params.set('message', message.trim())
                      if (recipientName.trim()) params.set('recipientName', recipientName.trim())

                      router.push(`${routes.paymentSuccess}?${params.toString()}`)
                    }}
                  />
                ) : payMode === 'other' ? (
                  <PayUsingOtherCards 
                    amount={amount}
                    onPay={()=>{}}
                 />
                ) : (
                  <PayUsingBalance
                    amount={amount}
                    onPay={({ accountId, amount: finalAmount }) => {
                      const params = new URLSearchParams()
                      params.set('amount', String(finalAmount ?? amount ?? 0))
                      params.set('method', 'balance')
                      params.set('accountId', String(accountId))
                      if (message.trim()) params.set('message', message.trim())
                      if (recipientName.trim()) params.set('recipientName', recipientName.trim())

                      router.push(`${routes.paymentSuccess}?${params.toString()}`)
                    }}
                  />
                )}
            </Suspense>
        </div>
    )
}
