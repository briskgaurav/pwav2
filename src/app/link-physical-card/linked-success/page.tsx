'use client'
import { Button, SheetContainer } from '@/components/ui'
import { notifyCardAdded, notifyNavigation } from '@/lib/bridge';
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import { useCardWalletStore } from '@/store/useCardWalletStore'
import { CARD_IMAGE_PATHS } from '@/components/StackingCard/cardData'
import { useRouter } from 'next/navigation'

export default function LinkedSuccessPage() {
  const linkVirtualCard = useCardWalletStore((s) => s.linkVirtualCard)
  const managingCardId = useCardWalletStore((s) => s.managingCardId)
  const pendingLinkUniversalCardId = useCardWalletStore((s) => s.pendingLinkUniversalCardId)
  const setPendingLinkUniversalCardId = useCardWalletStore((s) => s.setPendingLinkUniversalCardId)
  const cards = useCardWalletStore((s) => s.cards)
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
      linkVirtualCard(pendingLinkUniversalCardId, managingCardId)
      setPendingLinkUniversalCardId(null)
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
    <div className='h-[100dvh] w-full flex flex-col overflow-hidden'>
      <SheetContainer>
        <div className='flex-1 w-full flex flex-col justify-between items-center overflow-auto pt-10 space-y-4 p-6'>
          <p className='text-sm text-text-secondary'>This Instacard has been successfully linked to your Universal Card</p>
          <div className='h-auto w-full relative'>
            <Image
              src={linkedVirtualCard ? CARD_IMAGE_PATHS[linkedVirtualCard.imageId] : '/img/creditcard.png'}
              alt='Credit Card'
              width={1000}
              height={1000}
              className='h-full w-full object-contain'
              priority
            />
            <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl w-full text-center select-none'>
              {linkedVirtualCard
                ? `**** **** **** ${linkedVirtualCard.cardNumber.slice(-4)}`
                : '0000 0000 0000 0000'
              }
            </p>
          </div>

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
