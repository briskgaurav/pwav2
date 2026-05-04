'use client'
import React, { useEffect, useRef } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button, CardMockup, SheetContainer } from '@/components/ui'
import { CARD_IMAGE_PATHS } from '@/constants/cardData'
import { notifyCardAdded, notifyNavigation } from '@/lib/bridge';
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { linkVirtualCard, setPendingLinkUniversalCardId } from '@/store/redux/slices/cardWalletSlice'


export default function UniversalLinkedSuccess() {
  const dispatch = useAppDispatch()
  const managingCardId = useAppSelector((s) => s.cardWallet.managingCardId)
  const pendingLinkUniversalCardId = useAppSelector((s) => s.cardWallet.pendingLinkUniversalCardId)
  const cards = useAppSelector((s) => s.cardWallet.cards)
  const linkedRef = useRef(false)
  const router = useRouter()

  const linkedVirtualCard = cards.find((c) => c.id === managingCardId)
  const universalCard = cards.find((c) => c.id === pendingLinkUniversalCardId) || cards.find((c) => c.cardType === 'debit')

  useEffect(() => {
    notifyNavigation('linked-success');
  }, []);

  useEffect(() => {
    if (!linkedRef.current && pendingLinkUniversalCardId && managingCardId) {
      linkedRef.current = true
      dispatch(linkVirtualCard({ universalCardId: pendingLinkUniversalCardId, virtualCardId: managingCardId }))
      dispatch(setPendingLinkUniversalCardId(null))
    }
  }, [pendingLinkUniversalCardId, managingCardId, linkVirtualCard, setPendingLinkUniversalCardId])

  const handleDone = () => {

    router.push('/')
    notifyCardAdded({
      cardId: linkedVirtualCard?.id || `card-${Date.now()}`,
      cardType: linkedVirtualCard?.cardType || 'debit',
      lastFourDigits: linkedVirtualCard?.cardNumber.slice(-4) || '1234',
    });
  };

  return (
    <div className='h-dvh w-full flex flex-col overflow-hidden'>
      <SheetContainer>
        <div className='flex-1 w-full flex flex-col justify-between items-center overflow-auto pt-10 space-y-4 p-6'>
          <p className='text-sm text-text-secondary'>This Instacard has been successfully linked to your Universal Card</p>
        <CardMockup 
        imageSrc={linkedVirtualCard ? CARD_IMAGE_PATHS[linkedVirtualCard.imageId] : '/img/creditcard.png'}
        maskedNumber={linkedVirtualCard
          ? `**** **** **** ${linkedVirtualCard.cardNumber.slice(-4)}`
          : '0000 0000 0000 0000'
        }
        isclickable={false}
        showActions={false}
        showNumber={true}
        />

          <div className="w-full flex-1 flex relative flex-col items-center justify-center animate-scale-in">
            <Image
              src={'/img/success.png'}
              alt="Success"
              width={200}
              height={200}
              className="w-[70%] h-auto absolute top-[100px] left-[55%] -translate-x-1/2 -translate-y-1/2 object-contain pointer-events-none"
              priority
            />
            <div className="w-full bg-white/60 flex items-center justify-center gap-2 flex-col border-text-secondary/20 space-y-4 py-6 z-5 relative border rounded-2xl p-4 backdrop-blur-sm text-center mt-4">
              <p className="text-lg font-medium leading-[1.2] text-text-primary">
                This Instacard has been successfully linked to your Universal Card
              </p>
              <div className='h-auto w-[100px] flex items-center justify-center rounded-lg overflow-hidden'>
                <Image
                  src={universalCard ? CARD_IMAGE_PATHS[universalCard.imageId] : '/svg/debitcard.svg'}
                  alt='Universal Card'
                  width={100}
                  height={60}
                  className='object-contain h-full w-full'
                />
              </div>
              <p className="text-sm text-text-secondary">
                **** **** **** {universalCard?.cardNumber.slice(-4) || '1234'} (Universal card)
              </p>
            </div>
          </div>
        </div>
        <div className='p-4 pb-[max(env(safe-area-inset-bottom),24px)] pt-2'>
          <Button fullWidth onClick={handleDone}>Back to Home</Button>
        </div>
      </SheetContainer>
    </div>
  )
}
