'use client'
import React from 'react'

import { useRouter } from 'next/navigation'

import ButtonComponent from '@/components/ui/ButtonComponent'
import CardMockup from '@/components/ui/CardMockup'
import CopyButton from '@/components/ui/CopyButton'
import LayoutSheet from '@/components/ui/LayoutSheet'
import { useManagingCard } from '@/hooks/useManagingCard'
import { notifyUserCancelled } from '@/lib/bridge'
import { routes } from '@/lib/routes'

export default function page() {
    const router = useRouter()
    const { imageSrc, maskedNumber } = useManagingCard()

    const handleExitPWA = () => {
        // notifyCardAdded({
        //     cardId: `card-${Date.now()}`,
        //     cardType: 'gift',
        //     lastFourDigits: '1234',
        //   });
        router.push(routes.instacard)
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
