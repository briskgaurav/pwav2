'use client'

import { useState, Suspense } from 'react'
import CardToggle, { PayMode } from '@/components/ui/CardToggle'
import PayUsingInstacard from './PayUsingInstacard'
import PayUsingBalance from './PayUsingBalance'
import PayUsingOtherCards from './PayUsingOtherCards'

export default function ChooseCards() {
    const [payMode, setPayMode] = useState<PayMode>('instacard')

    return (
        <div className="flex flex-col relative h-full">
            <CardToggle active={payMode} onChange={setPayMode} />
            <Suspense fallback={<div className='h-4 w-4 border border-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-spin' />}>
                {payMode === 'instacard' ? <PayUsingInstacard /> : payMode === 'other' ? <PayUsingOtherCards /> : <PayUsingBalance />}
            </Suspense>
        </div>
    )
}
