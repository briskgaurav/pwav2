'use client'
import { SheetContainer } from '@/components/ui'
import Image from 'next/image'
import { ICONS } from '@/constants/icons'

import { useState } from 'react'
import CopyButton from '@/components/ui/CopyButton'
import CardMockup from '@/components/ui/CardMockup'
import ManageBtn from './ManageBtn'
import { getManageBtns } from '../constants'
import Balance from '@/components/ui/Balance'
import RemoveCardModal from '@/components/modals/RemoveCardModal'
import FAQModal from '@/components/modals/FAQModal'
import { useManageCardStore } from '../store/useManageCardStore'
import { useSearchParams } from 'next/navigation'
import EyeButton from '@/components/ui/EyeButton'
import CardActionTiles from './CardActionTiles'
import { useManageCardActions } from '../hooks/useManageCardActions'
import { useManagingCard } from '@/hooks/useManagingCard'
import { useAuth } from '@/lib/auth-context'

export default function ManageGiftCardScreen() {
  const searchParams = useSearchParams()
  const cardMode = (searchParams.get('mode') as 'virtual' | 'universal') || 'virtual'
  const [showActivationCode, setShowActivationCode] = useState(false)
  const { isFaqOpen, faqData, closeFaq } = useManageCardStore()
  const { showRemoveModal, setShowRemoveModal, handleCardActionClick, handleRemoveCard } = useManageCardActions()
  const { mockupImageSrc, maskedNumber } = useManagingCard()

  const { isDarkMode } = useAuth()

  return (
    <div className="h-screen flex flex-col">
      <SheetContainer>
        <div className="flex-1 overflow-auto pb-10 p-4 space-y-4">
          <CardMockup imageSrc={mockupImageSrc ?? '/img/gift.png'} maskedNumber={maskedNumber} />
          <Balance />

          <div className="flex gap-4 items-start justify-between overflow-x-auto">
            {getManageBtns('gift').map((btn, index) => (
              <ManageBtn href={btn.href} key={index} icon={btn.icon} title={btn.title} />
            ))}
          </div>

          <CardActionTiles cardMode={cardMode} onActionClick={handleCardActionClick} />

          <span className='w-full h-px block my-10 bg-border'></span>

          <div className='w-full flex  items-center relative justify-center overflow-hidden rounded-2xl min-h-[180px]'>
            <div className={`absolute ${isDarkMode ? 'brightness-200' : ''} inset-0`}>
              <Image src="/img/giftcardbg.png" alt="Gift Card background" width={340} height={215} className="w-full h-full object-cover rounded-2xl" />
            </div>

            <div className='flex items-center flex-col z-10 justify-center gap-5 py-6'>
              <div className='flex items-center gap-2'>
                <p className='text-orange text-xl font-bold'>DS73488QDJ738</p>
                <CopyButton value="DS73488QDJ738" size="sm" />
              </div>

              <div className='flex items-center gap-4'>
                <div className='h-fit py-4 px-4 flex items-center gap-2 border border-primary rounded-full'>
                  <span className='w-5 h-5 block'>
                            <Image className='object-contain h-full w-full' src={ICONS.share} alt="Share" width={20} height={20} />
                  </span>
                  <p className={` text-xs font-medium ${isDarkMode ? 'text-white' : 'text-text-primary'}`}>Share Gift Card</p>
                </div>
                <div className='h-fit py-4 px-4 flex items-center gap-2 border border-primary rounded-full'>
                  <span className='w-5 h-5 block'>
                            <Image className={`object-contain h-full ${isDarkMode ? 'brightness-0' : ''} w-full`} src={ICONS.mail} alt="Download" width={20} height={20} />
                  </span>
                  <p className={` text-xs font-medium ${isDarkMode ? 'text-white' : 'text-text-primary'}`}>Download Card</p>
                </div>
              </div>
            </div>
          </div>

          <p className='mt-2 font-medium'>One time Activation Code</p>
          <div className='w-full flex items-center justify-between h-fit py-5 px-4 border border-border rounded-2xl'>
            <p className='text-text-primary text-sm font-medium'>
              {showActivationCode ? '4668 4782 3787 78378' : '***** **** **** ****'}
            </p>
            <div className='flex items-center gap-3'>
              <CopyButton value="4668 4782 3787 78378" />
              <EyeButton isVisible={showActivationCode} onToggle={setShowActivationCode} />
            </div>
          </div>
          <p className='text-text-primary text-sm'>(Please ensure that you are giving the activation code to the person you are gifting this card to. If you share this code with someone you were not looking to gif this card, Instacard  & the Issuer would have no accountability to any exposure that you may encounter against the money you may have loaded)</p>




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
