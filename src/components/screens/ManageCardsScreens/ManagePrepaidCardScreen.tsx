'use client'

import FAQModal from '@/components/ui/FAQModal'
import RemoveCardModal from '@/components/ui/RemoveCardModal'
import ManageBtn from '../../ui/ManageBtn'
import { SheetContainer } from '@/components/ui'
import EyeButton from '@/components/ui/EyeButton'
import React, { useState } from 'react'

import { getManageBtns } from '../../../constants/getmanageBtn'
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { closeFaq } from '@/store/redux/slices/manageCardSlice'
import { useSearchParams } from 'next/navigation'
import CardMockup from '@/components/ui/CardMockup'
import CardActionTiles from '../../ui/CardActionTiles'
import { useManageCardActions } from '../../../hooks/useManageCardActions'
import { useManagingCard } from '@/hooks/useManagingCard'

export default function ManagePrepaidCardScreen() {
  const searchParams = useSearchParams()
  const cardMode = (searchParams.get('mode') as 'virtual' | 'universal') || 'virtual'
  const dispatch = useAppDispatch()
  const isFaqOpen = useAppSelector((s) => s.manageCard.isFaqOpen)
  const faqData = useAppSelector((s) => s.manageCard.faqData)
  const handleCloseFaq = () => dispatch(closeFaq())
  const [showBalance, setShowBalance] = useState(false)
  const { showRemoveModal, setShowRemoveModal, handleCardActionClick, handleRemoveCard } = useManageCardActions()
  const { mockupImageSrc, maskedNumber } = useManagingCard()

  return (
    <div className="h-screen flex flex-col">
      <SheetContainer>
        <div className="flex-1 overflow-auto pb-10 p-4 space-y-4">
         <CardMockup imageSrc={mockupImageSrc ?? '/img/prepaid.png'} maskedNumber={maskedNumber} />
          <div className='w-full flex rounded-xl mt-4 gap-2 '>
            <div className='flex-1 p-4 py-6  border border-text-primary/20 rounded-2xl  flex flex-col gap-4'>
              <p className='text-text-primary text-sm'>Wallet Account</p>
              <p className='text-text-primary font-medium'>12344567890</p>
            </div>
            <div className='flex-1 p-4 py-6 flex flex-col gap-4 border border-text-primary/20 rounded-2xl'>
              <p className='text-text-primary text-sm'>Balance</p>
              <div className='flex items-center justify-between gap-2'>
                <p className='text-text-primary font-medium'>
                  <span className='line-through mr-2'>N </span>
                  {showBalance ? '50,000.00' : '********'}
                </p>
                <EyeButton
                  isVisible={showBalance}
                  onToggle={setShowBalance}
                  size="md"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto">
            {getManageBtns('prepaid').map((btn, index) => (
              <ManageBtn href={btn.href} key={index} icon={btn.icon} title={btn.title} />
            ))}
          </div>

          <CardActionTiles cardMode={cardMode} onActionClick={handleCardActionClick} />
        </div>
      </SheetContainer>

      <FAQModal visible={isFaqOpen} onClose={handleCloseFaq} data={faqData || undefined} />
      <RemoveCardModal
        visible={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={handleRemoveCard}
      />
    </div>
  )
}
