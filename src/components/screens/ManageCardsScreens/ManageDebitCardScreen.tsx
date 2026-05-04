'use client'

import React from 'react'

import { useSearchParams } from 'next/navigation'

import CardMockup from '@/components/ui/CardMockup'
import FAQModal from '@/components/ui/FAQModal'
import RemoveCardModal from '@/components/ui/RemoveCardModal'
import { useManagingCard } from '@/hooks/useManagingCard'
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { closeFaq } from '@/store/redux/slices/manageCardSlice'

import { getManageBtns } from '../../../constants/getmanageBtn'
import { useManageCardActions } from '../../../hooks/useManageCardActions'
import CardActionTiles from '../../ui/CardActionTiles'
import LayoutSheet from '../../ui/LayoutSheet'
import ManageBtn from '../../ui/ManageBtn'

export default function ManageDebitCardScreen() {
  const searchParams = useSearchParams()
  const cardMode = (searchParams.get('mode') as 'virtual' | 'universal') || 'virtual'
  const dispatch = useAppDispatch()
  const isFaqOpen = useAppSelector((s) => s.manageCard.isFaqOpen)
  const faqData = useAppSelector((s) => s.manageCard.faqData)
  const handleCloseFaq = () => dispatch(closeFaq())
  const { showRemoveModal, setShowRemoveModal, handleCardActionClick, handleRemoveCard } = useManageCardActions()
  const { mockupImageSrc, maskedNumber } = useManagingCard()

  return (
    <LayoutSheet needPadding={false} routeTitle="Manage Debit Card">
        <div className="flex-1 overflow-auto pb-10 p-4 space-y-4">
          <CardMockup imageSrc={mockupImageSrc ?? '/img/debitmockup.png'} maskedNumber={maskedNumber} />

          <div className="flex gap-4 overflow-x-auto">
            {getManageBtns('debit').map((btn, index) => (
              <ManageBtn href={btn.href} key={index} icon={btn.icon} title={btn.title} />
            ))}
          </div>

          <CardActionTiles cardMode={cardMode} onActionClick={handleCardActionClick} />
        </div>

        <FAQModal visible={isFaqOpen} onClose={handleCloseFaq} data={faqData || undefined} />
        <RemoveCardModal
          visible={showRemoveModal}
          onClose={() => setShowRemoveModal(false)}
          onConfirm={handleRemoveCard}
        />
    </LayoutSheet>
  )
}

