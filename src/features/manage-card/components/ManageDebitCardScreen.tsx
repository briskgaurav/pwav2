'use client'

import FAQModal from '@/components/modals/FAQModal'
import RemoveCardModal from '@/components/modals/RemoveCardModal'
import ManageBtn from './ManageBtn'
import { SheetContainer } from '@/components/ui'
import React from 'react'

import { getManageBtns } from '../constants'
import { useManageCardStore } from '../store/useManageCardStore'
import CardMockup from '@/components/ui/CardMockup'
import CardActionTiles from './CardActionTiles'
import { useManageCardActions } from '../hooks/useManageCardActions'

export default function ManageDebitCardScreen() {
  const { isFaqOpen, faqData, closeFaq } = useManageCardStore()
  const { showRemoveModal, setShowRemoveModal, handleCardActionClick, handleRemoveCard } = useManageCardActions()

  return (
    <div className="h-screen flex flex-col">
      <SheetContainer>
        <div className="flex-1 overflow-auto pb-10 p-4 space-y-4">
          <CardMockup imageSrc='/img/debitmockup.png' />

          <div className="flex gap-4 overflow-x-auto">
            {getManageBtns('debit').map((btn, index) => (
              <ManageBtn href={btn.href} key={index} icon={btn.icon} title={btn.title} />
            ))}
          </div>

          <CardActionTiles onActionClick={handleCardActionClick} />
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

