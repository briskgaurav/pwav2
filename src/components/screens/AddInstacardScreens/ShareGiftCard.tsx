'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import LayoutSheet from '@/components/ui/LayoutSheet'
import ButtonComponent from '@/components/ui/ButtonComponent'
import CopyButton from '@/components/ui/CopyButton'
import { routes } from '@/lib/routes'
import { ICONS } from '@/constants/icons'
import { shareText } from '@/lib/fetchDataFromKotlin'
import { useAppDispatch } from '@/store/redux/hooks'
import { useCardJourney } from '@/hooks/useCardJourney'
import { setCardRequestState } from '@/store/redux/slices/cardRequestSlice'

export default function ShareGiftCard() {
  const dispatch = useAppDispatch()
  const { state } = useCardJourney()
  const searchParams = useSearchParams()

  const recipientName = searchParams.get('name') || 'Gift Recipient'
  const recipientEmail = searchParams.get('email') || 'recipient@example.com'
  const recipientMessage = searchParams.get('message') || ''
  const amount = searchParams.get('amount') || '0.00'
  const activationCode = searchParams.get('code') || 'DS73488QDJ738'

  const shareLink = useMemo(() => {
    if (typeof window === 'undefined') return ''

    const url = new URL(window.location.origin + routes.giftCardActivationCode)
    url.searchParams.set('name', recipientName)
    url.searchParams.set('email', recipientEmail)
    url.searchParams.set('message', recipientMessage)
    url.searchParams.set('amount', amount)
    return url.toString()
  }, [recipientName, recipientEmail, recipientMessage, amount])

  const shareTextBody = `🎁 Instacard Gift Card\n\nCode: ${activationCode}\nName: ${recipientName}\nAmount: N ${amount}\n\nRedeem here: ${shareLink}`

  const handleShare = async () => {
    await shareText({
      title: 'Instacard Gift Card',
      text: shareTextBody,
    })
  }

  const handleDownload = () => {
    if (typeof window === 'undefined') return

    const blob = new Blob([shareTextBody], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `Instacard-${activationCode}.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleNext = () => {
    dispatch(setCardRequestState({
      requestId: state?.requestId ?? `gift-${Date.now()}`,
      cardType: 'GIFT_CARD',
      currentState: 'ACTIVATION_PENDING',
      nextAction: {
        code: 'GIFT_CARD_ACTIVATION',
        message: 'Enter activation code',
      },
      expiresAt: state?.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }))
  }

  return (
    <LayoutSheet routeTitle='Share Gift Card' needPadding={false} hideLayerSheet={true}>
      <div className='flex-1 overflow-auto pb-10 gap-4 p-4 flex flex-col'>
        <div className='space-y-3'>
          <div className='rounded-3xl border border-border bg-white p-4 shadow-sm'>
            <div className='grid gap-3'>
              {[
                { label: 'Name', value: recipientName },
                { label: 'Email', value: recipientEmail },
                { label: 'Message', value: recipientMessage || 'No message provided' },
              ].map((item) => (
                <div key={item.label} className='rounded-3xl border border-border bg-background p-4'>
                  <p className='text-text-secondary text-xs'>{item.label}</p>
                  <p className='text-text-primary font-medium break-words'>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='rounded-[2rem] bg-primary p-5 text-white shadow-2xl overflow-hidden'>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <p className='text-xs uppercase tracking-[0.35em] opacity-80'>Activation Code</p>
                <p className='mt-3 text-2xl font-semibold tracking-[0.22em]'>
                  {activationCode}
                </p>
              </div>
              <div className='rounded-2xl bg-white/10 p-2'>
                <CopyButton value={activationCode} size='sm' className='text-white' />
              </div>
            </div>

            <div className='mt-6 flex flex-row gap-3 flex-wrap'>
              <button
                type='button'
                onClick={handleShare}
                className='flex-1 min-w-[120px] rounded-full border border-white/40 bg-white/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] transition hover:bg-white/15'
              >
                <span className='inline-flex items-center justify-center gap-2'>
                  <Image src={ICONS.share} alt='Share Gift Card' width={18} height={18} className='object-contain' />
                  Share Gift Card
                </span>
              </button>
              <button
                type='button'
                onClick={handleDownload}
                className='flex-1 min-w-[120px] rounded-full border border-white/40 bg-white/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.08em] transition hover:bg-white/15'
              >
                <span className='inline-flex items-center justify-center gap-2'>
                  <Image src={ICONS.mail} alt='Download Card' width={18} height={18} className='object-contain' />
                  Download Card
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ButtonComponent title='Get Activation Code' onClick={handleNext} />
    </LayoutSheet>
  )
}
