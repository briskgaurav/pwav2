'use client'


import { useState } from 'react'

import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import Balance from '@/components/ui/Balance'
import CardMockup from '@/components/ui/CardMockup'
import CopyButton from '@/components/ui/CopyButton'
import EyeButton from '@/components/ui/EyeButton'
import FAQModal from '@/components/ui/FAQModal'
import RemoveCardModal from '@/components/ui/RemoveCardModal'
import { ICONS } from '@/constants/icons'
import { useManagingCard } from '@/hooks/useManagingCard'
import { useAuth } from '@/lib/auth-context'
import { shareText } from '@/lib/fetchDataFromKotlin'
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { closeFaq } from '@/store/redux/slices/manageCardSlice'

import { getManageBtns } from '../../../constants/getmanageBtn'
import { useManageCardActions } from '../../../hooks/useManageCardActions'
import CardActionTiles from '../../ui/CardActionTiles'
import LayoutSheet from '../../ui/LayoutSheet'
import ManageBtn from '../../ui/ManageBtn'

export default function ManageGiftCardScreen() {
  const searchParams = useSearchParams()
  const cardMode = (searchParams.get('mode') as 'virtual' | 'universal') || 'virtual'
  const [showActivationCode, setShowActivationCode] = useState(false)
  const dispatch = useAppDispatch()
  const isFaqOpen = useAppSelector((s) => s.manageCard.isFaqOpen)
  const faqData = useAppSelector((s) => s.manageCard.faqData)
  const handleCloseFaq = () => dispatch(closeFaq())
  const { showRemoveModal, setShowRemoveModal, handleCardActionClick, handleRemoveCard } = useManageCardActions()
  const { mockupImageSrc, maskedNumber } = useManagingCard()

  const { isDarkMode } = useAuth()

  return (
    <LayoutSheet needPadding={false} routeTitle="Manage Gift Card">
      <div className="flex-1 overflow-auto pb-10 p-4 space-y-4">
        <CardMockup imageSrc={mockupImageSrc ?? '/img/gift.png'} maskedNumber={maskedNumber} />
        <Balance />

        <div className="flex gap-4 items-start justify-between overflow-x-auto">
          {getManageBtns('gift').map((btn, index) => (
            <ManageBtn href={btn.href} key={index} icon={btn.icon} title={btn.title} />
          ))}
        </div>

        <CardActionTiles cardMode={cardMode} onActionClick={handleCardActionClick} />

        <span className='w-full h-px block my-10 bg-border' />

        <div className='w-full flex  items-center relative justify-center overflow-hidden rounded-2xl min-h-[180px]'>
          <div className={`absolute ${isDarkMode ? 'brightness-200' : ''} inset-0`}>
            <Image src="/img/giftcardbg.png" alt="Gift Card background" width={340} height={215} className="w-full h-full object-cover rounded-2xl" />
          </div>

          <div className='flex items-center flex-col z-10 justify-center gap-5 py-6'>
            <div className='flex items-center gap-2'>
              <p className='text-orange text-xl font-bold'>DS73488QDJ738</p>
              <CopyButton value="DS73488QDJ738" size="sm" className='' />
            </div>

            <div className='flex items-center gap-4'>
              <button
                onClick={() => shareText({
                  title: 'Instacard Gift Card',
                  text: `🎁 Instacard Gift Card\n\nCode: DS73488QDJ738\n\nRedeem your gift card on Instacard!`,
                })}
                className='h-fit py-4 px-4 flex items-center gap-2 border border-primary rounded-full cursor-pointer'
              >
                <span className='w-5 h-5 block'>
                  <Image className='object-contain h-full w-full' src={ICONS.share} alt="Share" width={20} height={20} />
                </span>
                <p className={` text-xs font-medium ${isDarkMode ? 'text-white' : 'text-text-primary'}`}>Share Gift Card</p>
              </button>
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

      <FAQModal visible={isFaqOpen} onClose={handleCloseFaq} data={faqData || undefined} />
      <RemoveCardModal
        visible={showRemoveModal}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={handleRemoveCard}
      />


    </LayoutSheet>
  )
}
