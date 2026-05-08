'use client'

import React, { useState } from 'react'
import { routes } from '@/lib/routes'
import { ICONS } from '@/constants/icons'
import Image from 'next/image'
import formatCardNumber from '@/lib/formated-card-number'
import ButtonComponent from '@/components/ui/ButtonComponent'
import type { UserUniveralCardSteps } from '@/types/userVerificationSteps'

interface EnterUniversalProps {
    handleMethodChange: (method: string) => void,
    handleNext: (step: UserUniveralCardSteps) => void
}


export default function EnterUniversalCard({ handleMethodChange, handleNext }: EnterUniversalProps) {
    const [cardNumber, setCardNumber] = useState('')
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '').slice(0, 16)
        setCardNumber(formatCardNumber(rawValue))
    }

    return (
        <div className="flex-1 flex-col flex justify-start items-center overflow-auto py-10 space-y-4 p-6">
            <div className='h-auto w-full relative'>
                <Image src='/img/cards/universal.png' alt='Credit Card' width={1000} height={1000} className='h-full w-full object-contain' />
            </div>

            <p className='text-sm'>Enter the card number of a Universal that you have with you</p>

            <div className='flex flex-col items-start justify-start w-full mt-4'>
                <p className='text-sm text-left'>Universal Card Number</p>
                <div className='w-full mt-3 p-4 border border-text-primary/20 rounded-2xl flex items-center justify-between'>
                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="sigma-code"
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        className="flex-1 outline-none  focus:outline-none active:outline-none focus:border-none active:border-none ring-0 focus:ring-none border-none bg-transparent text-text-primary focus-visible:ring-0 focus-visible:outline-none! focus-visible:ring-offset-0"
                        onChange={handleCardNumberChange}
                    />
                    <div className='flex items-center gap-4'>
                        <Image src={ICONS.mastercard} alt='Mastercard' width={40} height={24} className='object-contain h-4 w-auto' />

                        <button onClick={() => handleMethodChange('scan')} >
                            <Image src={ICONS.scan} alt='scan' width={40} height={24} className='object-contain invert h-5 w-auto' />
                        </button>
                    </div>
                </div>
            </div>
            <ButtonComponent title='Continue' onClick={() => handleNext('registered_email_verification')} />
        </div>
    )
}
