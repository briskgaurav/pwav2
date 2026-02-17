'use client'

import { Button } from '@/components/ui'
import InputField from '@/components/ui/InputField'
import Image from 'next/image'
import React from 'react'

const RECOMMENDED_AMOUNTS = ['1,000', '2,000', '5,000', '10,000', '20,000', '50,000']

export interface AddMoneyFormProps {
    amount: string
    onAmountChange: (value: string) => void
    onSelectRecommended: (value: string) => void
    onOpenModal: () => void
    showKycTier?: boolean
    btnTitle?: string
}

export function AddMoneyForm({ amount, onAmountChange, onSelectRecommended, onOpenModal, showKycTier = true, btnTitle = 'Add Money' }: AddMoneyFormProps) {
    const isButtonDisabled = !amount || amount.trim() === ''

    return (
        <div className='space-y-5 '>
            {showKycTier && (
                <div className='ml-1.5'>
                <p className='text-text-primary text-sm'>
                    KYC Tier : <span className='text-text-primary font-medium'>KYC Level 1</span>
                </p>
                <p className='text-text-primary text-sm'>
                    Max Amount allowed to be loaded:{' '}
                    <span className='text-text-primary font-medium'>
                        <span className='line-through'>N</span> 50,000
                    </span>
                </p>
            </div>
            )}

            <div className='border border-border rounded-2xl space-y-5 px-4 py-5'>
                <div className='flex items-center gap-2'>
                    <span className='w-6 h-6 block'>
                        <Image
                            src='/svg/addcard.svg'
                            alt='Wallet'
                            width={20}
                            height={20}
                            className='size-full object-contain'
                        />
                    </span>
                    <p className='text-text-primary text-md font-medium'>Add Money</p>
                </div>

                <InputField
                    value={amount}
                   
                    onChange={(e) => onAmountChange(e.target.value)}
                    placeholder='Enter Amount'
                />

                <p className='text-text-primary text-md ml-1'>Recommended</p>

                <div className='grid grid-cols-3 gap-2'>
                    {RECOMMENDED_AMOUNTS.map((recommended) => {
                        const isActive = amount === recommended
                        return (
                            <button
                                key={recommended}
                                type='button'
                                onClick={() => onSelectRecommended(recommended)}
                                className={`flex border rounded-xl px-4 py-2 items-center justify-center gap-2 transition-colors ${
                                    isActive ? 'border-text-primary' : 'border-border hover:border-primary/40'
                                }`}
                            >
                                <p className='text-text-primary text-md font-medium'>
                                    <span className='line-through'>N</span> {recommended}
                                </p>
                            </button>
                        )
                    })}
                </div>

                <Button fullWidth className='bg-primary text-white' onClick={onOpenModal} disabled={isButtonDisabled}>
                    {btnTitle}
                </Button>
            </div>
        </div>
    )
}
