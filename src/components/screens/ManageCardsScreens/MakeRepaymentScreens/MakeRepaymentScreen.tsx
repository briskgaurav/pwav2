'use client'
import CardMockup from '@/components/ui/CardMockup'
import { useManagingCard } from '@/hooks/useManagingCard'
import MakeRepayment from '@/components/ui/MakeRepayment'
import { SheetContainer } from '@/components/ui/sheet-container'
import React from 'react'
import LayoutSheet from '../../../ui/LayoutSheet'

const paymentDetails = [
    { label: 'Total Outstanding', value: '₦ 625,000' },
    { label: 'Payment Due Date', value: '16-Aug-2020' },
    { label: 'Min Payment Due', value: '₦ 62,500' },
    { label: 'Payment Status', value: 'Due In 2 Days' },
]

export default function MakeRepaymentScreen() {
    const { imageSrc, maskedNumber } = useManagingCard()
    return (
        <LayoutSheet routeTitle='Make Repayments' needPadding={false}>
            <div className="flex-1 overflow-auto pb-[10vh] p-4 space-y-5">
                <CardMockup imageSrc={imageSrc ?? '/img/creditcard.png'} maskedNumber={maskedNumber} />

                <div className="grid grid-cols-2 gap-3">
                    {paymentDetails.map((item, index) => (
                        <div key={index} className="border border-border rounded-xl p-4 gap-2 flex flex-col items-center justify-center">
                            <p className="text-text-primary text-sm">{item.label}</p>
                            <p className="text-text-primary text-lg font-medium">{item.value}</p>
                        </div>
                    ))}
                </div>
                <MakeRepayment />
            </div>
        </LayoutSheet>
    )
}
