'use client'
import CardMockup from '@/components/ui/CardMockup'
import { useManagingCard } from '@/hooks/useManagingCard'
import CopyButton from '@/components/ui/CopyButton'
import { useRouter } from 'next/navigation'
import React from 'react'
import { notifyUserCancelled, notifyCardAdded } from '@/lib/bridge'
import { routes } from '@/lib/routes'
import LayoutSheet from '@/components/ui/LayoutSheet'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { useAppDispatch } from '@/store/redux/hooks'
import { setCardRequestState } from '@/store/redux/slices/cardRequestSlice'
import type { CardRequestStateResponse } from '@/types/cardIssuance'

export default function GiftCardOneTimeActivation() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { imageSrc, maskedNumber } = useManagingCard()

    const buildClosedGiftRequest = (): CardRequestStateResponse => ({
        requestId: `gift-closed-${Date.now()}`,
        cardType: 'GIFT_CARD',
        currentState: 'CLOSED',
        nextAction: {
            code: 'SHOW_REQUEST_CLOSED',
            message: 'Gift card activation completed successfully.',
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        cardDetails: {
            cardId: `GIFT-${Date.now()}`,
            vcPanMasked: maskedNumber ?? 'XXXX XXXX XXXX 0000',
            cardScheme: 'VISA',
            cardVariant: 'GIFT',
            cardExpiryMmYy: '12/29',
            pinSet: true,
        },
    })

    const handleExitPWA = () => {
        dispatch(setCardRequestState(buildClosedGiftRequest()))
        router.push(routes.addInstacard)
        notifyUserCancelled()
    }

    return (
        <LayoutSheet routeTitle='One Time Activation Code' needPadding={false}>
            <div className="flex-1 overflow-auto pb-10 p-4 space-y-2">
                <CardMockup isclickable={false} imageSrc={imageSrc ?? '/img/gift.png'} maskedNumber={maskedNumber} />
                <p className='text-text-primary text-lg ml-1 mt-4'>One time Activation Code</p>
                <div className='p-4 border flex items-center justify-between border-border my-4 rounded-2xl'>
                    <p className='text-text-primary text-md font-medium'>4668-4782-3787-78378</p>
                    <CopyButton value="4668-4782-3787-78378" size="sm" />
                </div>
                <p className='text-text-primary text-sm '>(Please ensure that you are giving the activation code to the person you are gifting this card to. If you share this code with someone you were not looking to gif this card, Instacard  & the Issuer would have no accountability to any exposure that you may encounter against the money you may have loaded)</p>
            </div>
                <ButtonComponent title='Go to Home Screen' onClick={handleExitPWA} />
        </LayoutSheet>
    )
}
