'use client'
import { useState } from 'react'
import { ICONS } from '@/constants/icons'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import LayoutSheet from '@/components/ui/LayoutSheet'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { useCardJourney } from '@/hooks/useCardJourney'
import { setCardRequestState } from '@/store/redux/slices/cardRequestSlice'
import { selectGiftRecipientDetails } from '@/store/redux/slices/cardRequestSlice'

export default function GCReadyToUsePage() {
    const accountNumber = useAppSelector((s) => s.user.accountNumber)
    const balance = useAppSelector((s) => s.user.balance)
    const [showBalance, setShowBalance] = useState(false)
    const dispatch = useAppDispatch()
    const { state } = useCardJourney()
    const searchParams = useSearchParams()

    const giftRecipientDetails = useAppSelector(selectGiftRecipientDetails)

    const recipientName = giftRecipientDetails?.recipientName || 'Gift Recipient'
    const recipientEmail = giftRecipientDetails?.recipientEmail || 'recipient@example.com'
    const recipientMessage = giftRecipientDetails?.giftMessage || 'Congratulations! Wishing you joy and happiness on this special occasion. Enjoy your gift!'
    const amount = giftRecipientDetails?.giftAmountMinor
        ? giftRecipientDetails.giftAmountMinor / 100
        : 50000 // fallback

    const giftCardDetails = [
        { label: 'Name', value: recipientName },
        { label: 'Email', value: recipientEmail },
        { label: 'Message', value: recipientMessage },
        { label: 'Amount', value: `N ${amount.toLocaleString()}` },
    ]

    const toggleBalance = () => {
        setShowBalance(!showBalance)
    }

    const isBalanceSufficient = true;   //balance <= amount


    const handleProceed = () => {
        if (!isBalanceSufficient) return
        dispatch(setCardRequestState({
            requestId: state?.requestId ?? `gift-${Date.now()}`,
            cardType: 'GIFT_CARD',
            currentState: 'CARD_ISSUED',
            nextAction: {
                code: 'GIFT_CARD_SHARE',
                message: 'Share the gift card with recipient',
            },
            expiresAt: state?.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }))
    }

    const { isDarkMode } = useAuth()
    return (
        <LayoutSheet routeTitle='Gift a Card' needPadding={false} hideLayerSheet={true}>
            <div className="flex-1 overflow-auto pb-10 gap-4 p-4 flex flex-col">
                {/* <CardMockup /> */}

                <div className='w-full rounded-2xl mt-5 space-y-2'>
                    {giftCardDetails.map((detail, index) => (
                        <div key={index} className='p-4 border border-border rounded-2xl'>
                            <p className='text-text-primary text-sm'>{detail.label}</p>
                            <p className='text-text-primary font-sm'>{detail.value}</p>
                        </div>
                    ))}
                </div>
                <span className='h-px w-[90%] mx-auto bg-border block my-5'></span>
                <div className='w-full flex rounded-xl gap-2 '>
                    <div className='flex-1 p-4 py-6  border border-text-primary/20 rounded-2xl  flex flex-col gap-4'>
                        <p className='text-text-primary text-sm'>Gift Card Account</p>
                        <p className='text-text-primary font-medium'>{accountNumber || '—'}</p>
                    </div>
                    <div className='flex-1 p-4 py-6 flex flex-col gap-4 border border-text-primary/20 rounded-2xl'>
                        <p className='text-text-primary text-sm'>Balance</p>
                        <div className='flex items-center justify-between gap-2'>
                            <p className='text-text-primary font-medium'>
                                <span className='line-through mr-2'>N </span>
                                {showBalance ? balance.toLocaleString() : '********'}
                            </p>
                            <button className='w-6 h-6 flex items-center justify-center' type='button' aria-label='Toggle balance visibility' onClick={toggleBalance}>
                                <Image className={`h-full w-full ${isDarkMode ? 'invert' : ''} object-contain`} src={showBalance ? ICONS.eyeOpen : ICONS.eyeClose} alt={showBalance ? 'Show' : 'Hide'} width={16} height={16} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className='text-sm'>

                    <p className='ml-1'>KYC Tier : <span className='text-orange font-medium'>KYC Level 1</span></p>
                    <p className='ml-1'>Max Daily Transaction Limit: <span className='text-orange font-medium'><span className='line-through'>N </span>100,000 </span></p>
                    {!isBalanceSufficient && (
                        <p className='ml-1 text-red-500 font-medium'>Insufficient balance to gift N {amount.toLocaleString()}</p>
                    )}

                </div>

            </div>
            <ButtonComponent title={isBalanceSufficient ? 'Proceed to Gift this Card' : 'Insufficient Balance'} onClick={handleProceed} disabled={!isBalanceSufficient} />


        </LayoutSheet>
    )
}
