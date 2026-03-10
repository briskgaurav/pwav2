'use client'
import { SheetContainer } from '@/components/ui'
import CardMockup from '@/components/ui/CardMockup'
import CreditCardTransactions from '@/components/ui/CreditCardTransactions'
import CreditDueBalance from '@/components/ui/CreditDueBalance'
import EmailStatements from '@/components/ui/EmailStatements'
import RecentTransactions from '@/components/ui/RecentTransactions'
import { useManagingCard } from '@/hooks/useManagingCard'

export default function page() {
    const { imageSrc, maskedNumber } = useManagingCard()
    return (
        <div className='h-screen flex flex-col'>
            <SheetContainer>
                <div className="flex-1 overflow-auto pb-10 p-4 space-y-5">
                    <CardMockup imageSrc={imageSrc ?? '/img/creditcard.png'} maskedNumber={maskedNumber} />
                    <CreditDueBalance />
                    <EmailStatements />
                    <RecentTransactions  />
                </div>
            </SheetContainer>
        </div>
    )
}
