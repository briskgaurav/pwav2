'use client'
import { useState } from 'react'

import { useAppSelector } from '@/store/redux/hooks'

import EyeButton from './EyeButton'

export default function Balance() {
    const accountNumber = useAppSelector((s) => s.user.accountNumber)
    const [showBalance, setShowBalance] = useState(false)

    return (
        <div className='w-full  flex rounded-xl gap-2 '>
            <div className='flex-1 p-4 py-6  border border-text-primary/20 rounded-2xl  flex flex-col gap-4'>
                <p className='text-text-primary text-sm'>Prepaid Account</p>
                <p className='text-text-primary font-medium'>{accountNumber || '—'}</p>
            </div>
            <div className='flex-1 p-4 py-6 flex flex-col gap-4 border border-text-primary/20 rounded-2xl'>
                <p className='text-text-primary text-sm'>Balance</p>
                <div className='flex items-center justify-start gap-2'>
                    <p className='text-text-primary flex items-center gap-2 font-medium'>
                        <span className='line-through mr-2'>N</span>
                        <span className='inline-block min-w-[52px]'>{showBalance ? '2,500' : '********'}</span>
                    </p>
                    <EyeButton isVisible={showBalance} onToggle={setShowBalance} size="md" />
                </div>

            </div>
        </div>
    )
}
