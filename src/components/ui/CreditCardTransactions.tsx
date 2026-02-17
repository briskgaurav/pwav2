'use client'

import React, { useState } from 'react'
import { FileQuestionMark, HelpCircle } from 'lucide-react'
import FAQModal from '@/components/modals/FAQModal'
import FaqIconButton from './FaqIconButton'

type Transaction = {
    id: string
    name: string
    companyName: string
    date: string
    amount: string
    initial: string
    color: string
}

type FAQModalProps = {
    heading: string
    bulletPoints: string[]
}
const faqData: FAQModalProps = {
    heading: 'Unbilled Transactions',
    bulletPoints: [
        'Unbilled transactions are transactions that have not been billed yet.',
    ],
}

const transactionData: Transaction[] = [
    {
        id: '1',
        name: 'Paid to',
        companyName: 'XYZ Limited',
        date: 'Jan 01, 2025 | 8:00 PM',
        amount: '- ₦ 1,500',
        initial: 'X',
        color: 'bg-orange'
    },
    {
        id: '2',
        name: 'Paid to',
        companyName: 'XYZ Limited',
        date: 'May 01, 2025 | 9:00 PM',
        amount: '- ₦ 2,500',
        initial: 'Y',
        color: 'bg-gray-400'
    }
]

export default function CreditCardTransactions() {
    const [faqVisible, setFaqVisible] = useState(false)

    const totalAmount = transactionData.reduce((sum, t) => {
        const numericAmount = parseFloat(t.amount.replace(/[^0-9.-]/g, ''))
        return sum + Math.abs(numericAmount)
    }, 0)

    return (
        <>
            <div className=' border border-border relative  overflow-hidden  rounded-2xl'>
                <div className='flex flex-col px-5 py-4 bg-background2 gap-2'>
                    <p className='text-text-primary text-md font-medium'>Unbilled Transactions</p>
                    <div className='flex items-center gap-2 w-full justify-between'>
                    <div className='flex items-center '>
                        <span className='text-text-primary text-sm'>Total</span>
                    </div>
                    <p className='text-sm font-medium text-error'>- ₦ {totalAmount.toLocaleString()}</p>
                    </div>
                    <FaqIconButton
                        size="sm"
                        onClick={() => setFaqVisible(true)}
                        className="absolute top-2 right-2"
                    />
                </div>

                {transactionData.map((transaction, index) => (
                    <div key={transaction.id} className={`flex p-5 items-start justify-between py-4 ${index !== transactionData.length - 1 ? 'border-b border-text-primary/10' : ''}`}>
                        <div className='flex items-center gap-3'>
                            <div className={`w-10 h-10 ${transaction.color} rounded-lg flex items-center justify-center`}>
                                <span className='text-white font-semibold text-lg'>{transaction.initial}</span>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-sm font-medium text-text-primary'>{transaction.name}</p>
                                <p className='text-xs text-text-primary'>{transaction.companyName}</p>
                                <p className='text-xs text-text-secondary'>{transaction.date}</p>
                            </div>
                        </div>
                        <p className='text-sm font-medium text-error'>{transaction.amount}</p>
                    </div>
                ))}
            </div>

            <FAQModal
                visible={faqVisible}
                data={faqData}
                onClose={() => setFaqVisible(false)}
            />
        </>
    )
}
