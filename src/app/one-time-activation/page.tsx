'use client'
import { Button, SheetContainer } from '@/components/ui'
import CardMockup from '@/components/ui/CardMockup'
import CopyButton from '@/components/ui/CopyButton'
import { useRouter } from 'next/navigation'
import React from 'react'
import { notifyUserCancelled, notifyCardAdded } from '@/lib/bridge'

export default function page() {
    const router = useRouter()

    const handleExitPWA = () => {
        // notifyCardAdded({
        //     cardId: `card-${Date.now()}`,
        //     cardType: 'gift',
        //     lastFourDigits: '1234',
        //   });
        notifyUserCancelled()
    }

    return (
        <div className='h-screen flex flex-col'>
            <SheetContainer>
                <div className="flex-1 overflow-auto pb-10 p-4 space-y-2">
                    <CardMockup  isclickable={false} imageSrc='/img/gift.png' />
                    <p className='text-text-primary text-lg ml-1 mt-4'>One time Activation Code</p>
                    <div className='p-4 border flex items-center justify-between border-border my-4 rounded-2xl'>
                        <p className='text-text-primary text-md font-medium'>4668-4782-3787-78378</p>
                        <CopyButton value="4668-4782-3787-78378" size="sm" />
                    </div>
                    <p className='text-text-primary text-sm '>(Please ensure that you are giving the activation code to the person you are gifting this card to. If you share this code with someone you were not looking to gif this card, Instacard  & the Issuer would have no accountability to any exposure that you may encounter against the money you may have loaded)</p>
                    <div className='mt-2 absolute bottom-5 left-1/2 -translate-x-1/2 px-4 w-full'>

                        <Button onClick={handleExitPWA} fullWidth variant='primary' size='md'>
                            Go to Home Screen
                        </Button>
                    </div>
                </div>
            </SheetContainer>
        </div>
    )
}
