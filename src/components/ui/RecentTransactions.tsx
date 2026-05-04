
'use client'
import React, { useState } from 'react'

import { TRANSACTION_HISTORY_DATA } from '@/store/TransactionHistory'

type TransactionTab = 'billed' | 'unbilled'

type ToggleOption = {
    label: string
    value: TransactionTab
}

const TOGGLE_OPTIONS: ToggleOption[] = [
    { label: 'Billed', value: 'billed' },
    { label: 'Unbilled', value: 'unbilled' },
]



export default function RecentTransactions() {
    const [activeTab, setActiveTab] = useState<TransactionTab>('billed')

    const filteredTransactions = TRANSACTION_HISTORY_DATA.filter(
        (transaction) => transaction.status === activeTab
    )

    return (
        <div className='p-5 border border-border rounded-2xl'>
            <div>
                <p className='text-text-primary text-md '>Recent Transactions History</p>
            </div>
            
            <div className="flex items-center justify-between gap-2 w-full my-4">
                {TOGGLE_OPTIONS.map((option) => {
                    const isActive = option.value === activeTab

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setActiveTab(option.value)}
                            aria-pressed={isActive}
                            className={[
                                'py-2 px-4 w-full border rounded-full text-center transition-colors',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                                isActive ? 'border-primary' : 'border-text-primary/20',
                            ].join(' ')}
                        >
                            <span className="text-sm">{option.label}</span>
                        </button>
                    )
                })}
            </div>

            <div 
                className="max-h-80 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-400"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}
            >
                {filteredTransactions.map((transaction, index) => (
                    <div key={transaction.id} className={`flex items-center justify-between py-4 ${index !== filteredTransactions.length - 1 ? 'border-b border-text-primary/10' : ''}`}>
                        <div className='flex items-center gap-3'>
                            <div className={`w-10 h-10 ${transaction.color} rounded-lg flex items-center justify-center`}>
                                <span className='text-white font-semibold text-lg'>{transaction.initial}</span>
                            </div>
                            <div className='flex flex-col'>
                                <p className='text-sm font-medium text-text-primary'>{transaction.name}</p>
                                <p className='text-xs text-text-primary'>{transaction.adminName}</p>
                                <p className='text-xs text-text-secondary'>{transaction.date}</p>
                            </div>
                        </div>
                        <p className={`text-sm font-medium ${transaction.type === 'credit' ? 'text-green-500' : 'text-error'}`}>{transaction.amount}</p>
                    </div>
                ))}
            </div>

            <p className='text-xs text-text-secondary text-center mt-3'>Scroll to view more</p>

        </div>
    )
}
