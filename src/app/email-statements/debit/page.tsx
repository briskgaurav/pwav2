'use client'
import { SheetContainer } from '@/components/ui'
import Balance from '@/components/ui/Balance'
import CardMockup from '@/components/ui/CardMockup'
import EmailStatements from '@/components/ui/EmailStatements'
import RecentTransactions from '@/components/ui/RecentTransactions'
import { useManagingCard } from '@/hooks/useManagingCard'

export default function DebitEmailStatementsPage() {
  const { imageSrc, maskedNumber } = useManagingCard()
  return (
    <div className='h-screen flex flex-col'>
      <SheetContainer>
        <div className="flex-1 overflow-auto pb-10 p-4 space-y-5">
          <CardMockup imageSrc={imageSrc ?? '/img/frontside.png'} maskedNumber={maskedNumber} />
          <Balance />
          <EmailStatements />
          <RecentTransactions />
        </div>
      </SheetContainer>
    </div>
  )
}
