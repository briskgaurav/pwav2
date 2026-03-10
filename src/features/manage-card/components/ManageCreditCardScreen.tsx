'use client'

import FAQModal from '@/components/modals/FAQModal'
import RemoveCardModal from '@/components/modals/RemoveCardModal'
import ManageBtn from './ManageBtn'
import { SheetContainer } from '@/components/ui'
import React from 'react'

import { useManageCardStore } from '../store/useManageCardStore'
import { routes } from '@/lib/routes'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import CardMockup from '@/components/ui/CardMockup'
import CardActionTiles from './CardActionTiles'
import { useManageCardActions } from '../hooks/useManageCardActions'
import { useManagingCard } from '@/hooks/useManagingCard'
import { RepaymentIcon, StatementsIcon } from '@/constants/icons'

const creditCardDetails = [
  { label: 'Approved Credit Limit', value: '₦ 1,000,000' },
  { label: 'Available Limit', value: '₦ 275,000' },
  { label: 'Total Outstanding', value: '₦ 625,000' },
  { label: 'Unbilled Amount', value: '₦ 1000,000' },
  { label: 'Payment Due Date', value: '16-Aug-2024' },
  { label: 'Payment Status', value: 'Due In 2 Days' },
]

export default function ManageCreditCardScreen() {
  const searchParams = useSearchParams()
  const cardMode = (searchParams.get('mode') as 'virtual' | 'universal') || 'virtual'
  const { isFaqOpen, faqData, closeFaq } = useManageCardStore()
  const { showRemoveModal, setShowRemoveModal, handleCardActionClick, handleRemoveCard } = useManageCardActions()
  const { mockupImageSrc, maskedNumber } = useManagingCard()

  return (
    <div className="h-screen flex flex-col">
      <SheetContainer>
        <div className="flex-1 overflow-auto pb-10 p-4 space-y-4">
          <CardMockup showActions={true} imageSrc={mockupImageSrc ?? '/img/creditcard.png'} maskedNumber={maskedNumber} />

          <div className='w-full rounded-2xl bg-background2 border border-border py-6 px-4 space-y-4'>
            <div className='flex items-center pl-2 justify-between'>
              <div>
                <p className='text-text-primary text-sm'>Minimum Payment Due</p>
                <p className='text-text-primary text-xl font-medium'>₦ 62,500.00</p>
              </div>
              <Link href={routes.makeRepayments} className='bg-primary text-white px-6 py-2.5 rounded-full '>
                Pay Now
              </Link>
            </div>

            <div className='grid grid-cols-2 gap-2'>
              {creditCardDetails.map((detail, index) => (
                <div key={index} className='px-4 py-3 border bg-white border-border rounded-2xl space-y-2 text-center'>
                  <p className='text-text-primary text-xs'>{detail.label}</p>
                  <p className='text-text-primary font-sm'>{detail.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 w-full">
            {[
              { icon: StatementsIcon, title: 'View Statements', href: routes.emailStatements('credit') },
              { icon: RepaymentIcon, title: 'Make Repayments', href: routes.makeRepayments },
            ].map((btn, index) => (
              <ManageBtn fullWidth href={btn.href} key={index} icon={btn.icon} title={btn.title} />
            ))}
          </div>

          <CardActionTiles cardMode={cardMode} onActionClick={handleCardActionClick} />
        </div>
      </SheetContainer>

      <FAQModal visible={isFaqOpen} onClose={closeFaq} data={faqData || undefined} />
      <RemoveCardModal
        visible={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={handleRemoveCard}
      />
    </div>
  )
}
