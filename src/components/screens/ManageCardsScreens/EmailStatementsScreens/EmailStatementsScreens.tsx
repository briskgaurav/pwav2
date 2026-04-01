'use client'
import { SheetContainer } from '@/components/ui'
import Balance from '@/components/ui/Balance'
import CardMockup from '@/components/ui/CardMockup'
import CreditDueBalance from '@/components/ui/CreditDueBalance'
import EmailStatements from '@/components/ui/EmailStatements'
import RecentTransactions from '@/components/ui/RecentTransactions'
import { useManagingCard } from '@/hooks/useManagingCard'
import LayoutSheet from '../../../ui/LayoutSheet'
import FloatingBottomBarLayoutClient from '../../InstacardScreens/FloatingBottomBarLayoutClient'

type CardType = 'debit' | 'credit' | 'prepaid' | 'gift'

interface EmailStatementsScreensProps {
    cardType: CardType
}

const defaultImages: Record<CardType, string> = {
    debit: '/img/frontside.png',
    credit: '/img/creditcard.png',
    prepaid: '/img/prepaid.png',
    gift: '/img/gift.png',
}

export default function EmailStatementsScreens({ cardType }: EmailStatementsScreensProps) {
    const { imageSrc, maskedNumber } = useManagingCard()

    return (
        <LayoutSheet routeTitle='Email Statements' needPadding={false}>
            <div className="flex-1 overflow-auto pb-[10vh] p-4 space-y-5">
                <CardMockup imageSrc={imageSrc ?? defaultImages[cardType]} maskedNumber={maskedNumber} />
                {cardType === 'credit' ? <CreditDueBalance /> : <Balance />}
                <EmailStatements />
                <RecentTransactions />
            </div>
            <FloatingBottomBarLayoutClient hidescan={true} />
        </LayoutSheet>
    )
}
