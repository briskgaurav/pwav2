'use client'
import { useState } from 'react'
import { Button, SheetContainer } from '@/components/ui'
import { ICONS } from '@/constants/icons'
import Image from 'next/image'

import { Copy } from 'lucide-react'
import CardMockup from '@/components/ui/CardMockup'
import { useRouter, useSearchParams } from 'next/navigation'
import { routes } from '@/lib/routes'
import { useAuth } from '@/lib/auth-context'
import LayoutSheet from '@/components/ui/LayoutSheet'
import ButtonComponent from '@/components/ui/ButtonComponent'

export default function page() {
    const [showBalance, setShowBalance] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    const recipientName = searchParams.get('name') || 'Gift Recipient'
    const recipientEmail = searchParams.get('email') || 'recipient@example.com'
    const recipientMessage = searchParams.get('message') || 'Congratulations! Wishing you joy and happiness on this special occasion. Enjoy your gift!'
    const amount = searchParams.get('amount') || '50,000.00'


    const giftCardDetails = [
        { label: 'Name', value: recipientName },
        { label: 'Email', value: recipientEmail },
        { label: 'Message', value: recipientMessage },
    ]

    const toggleBalance = () => {
        setShowBalance(!showBalance)
    }

    const handleProceed = () => {
        const params = new URLSearchParams({
            name: recipientName,
            email: recipientEmail,
            message: recipientMessage,
            amount,
        })

        router.push(`${routes.shareGiftCard}?${params.toString()}`)
    }

    const { isDarkMode } = useAuth()
    return (
        <LayoutSheet routeTitle='Gift a Card' needPadding={false}>
            <div className="flex-1 overflow-auto pb-10 gap-4 p-4 flex flex-col">
                {/* <CardMockup /> */}

                <div className='w-full rounded-2xl mt-5 space-y-2'>
                    {giftCardDetails.map((detail, index) => (
                        <div key={index} className='p-4 border border-border rounded-2xl'>
                            <p className='text-text-primary text-sm'>{detail.label}</p>
                            <p className='text-text-primary font-sm'>{detail.value}</p>
                        </div>
                    ))}
                </div>
                <span className='h-px w-[90%] mx-auto bg-border block my-5'></span>
                <div className='w-full flex rounded-xl gap-2 '>
                    <div className='flex-1 p-4 py-6  border border-text-primary/20 rounded-2xl  flex flex-col gap-4'>
                        <p className='text-text-primary text-sm'>Wallet Account</p>
                        <p className='text-text-primary font-medium'>12344567890</p>
                    </div>
                    <div className='flex-1 p-4 py-6 flex flex-col gap-4 border border-text-primary/20 rounded-2xl'>
                        <p className='text-text-primary text-sm'>Balance</p>
                        <div className='flex items-center justify-between gap-2'>
                            <p className='text-text-primary font-medium'>
                                <span className='line-through mr-2'>N </span>
                                {showBalance ? amount : '********'}
                            </p>
                            <button className='w-6 h-6 flex items-center justify-center' type='button' aria-label='Toggle balance visibility' onClick={toggleBalance}>
                                <Image className={`h-full w-full ${isDarkMode ? 'invert' : ''} object-contain`} src={showBalance ? ICONS.eyeOpen : ICONS.eyeClose} alt={showBalance ? 'Show' : 'Hide'} width={16} height={16} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className='text-sm'>

                    <p className='ml-1'>KYC Tier : <span className='text-orange font-medium'>KYC Level 1</span></p>
                    <p className='ml-1'>Max Daily Transaction Limit: <span className='text-orange font-medium'><span className='line-through'>N </span>100,000 </span></p>

                </div>

            </div>
            <ButtonComponent title='Proceed to Gift this Card' onClick={handleProceed} />


        </LayoutSheet>
    )
}
