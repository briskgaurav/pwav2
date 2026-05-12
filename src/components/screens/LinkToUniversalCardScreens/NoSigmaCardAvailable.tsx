'use client'
import React, { useMemo, useState,useEffect } from 'react'
import { Button, SheetContainer } from '@/components/ui'
import { ICONS } from '@/constants/icons'
import Image from 'next/image'
import Link from 'next/link'
import { routes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import SigmaCardOptionsScreen from './SigmaCardOptionsScreen'
import formatCardNumber from '@/lib/formated-card-number'
import LayoutSheet from '@/components/ui/LayoutSheet'
import { UniversalCard } from '@/lib/api/cards'
import CardPinAuth from '@/components/screens/AuthScreens/CardPinAuth'
import UniversalLinkedSuccess from './UniversalLinkedSuccess'
import { useAppSelector } from '@/store/redux/hooks'
import { selectUniversalCards, selectCardsStatus } from '@/store/redux/slices/cardDataWalletSlice'

type LinkState = 'FETCHING' | 'NO_CARDS' | 'SELECT_CARD' | 'VERIFY_PIN' | 'SUCCESS'

export default function LinkCardScreen() {
    const router = useRouter()
    const [state, setState] = useState<LinkState>('FETCHING')
    const universalCards = useAppSelector(selectUniversalCards)
    const cardsStatus = useAppSelector(selectCardsStatus)
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
    const [cardNumber, setCardNumber] = useState('')

    useEffect(() => {
        if (cardsStatus === 'succeeded') {
            if (universalCards.length > 0) {
                setState('SELECT_CARD')
            } else {
                setState('NO_CARDS')
            }
        } else if (cardsStatus === 'failed') {
            setState('NO_CARDS')
        }
    }, [cardsStatus, universalCards])
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '').slice(0, 12)
        setCardNumber(formatCardNumber(rawValue))
    }

    const handleCardSelected = (cardId: string) => {
        setSelectedCardId(cardId)
        setState('VERIFY_PIN')
    }

    const handlePinVerified = () => {
        setState('SUCCESS')
    }

    const renderStep = () => {
        switch (state) {
            case 'FETCHING':
                return (
                    <div className="flex-1 flex justify-center items-center h-full pt-10">
                        <p className="text-sm text-text-secondary">Loading...</p>
                    </div>
                )
            case 'NO_CARDS':
                return (
                    <>
                        <div className="flex-1 flex-col flex justify-start items-center overflow-auto py-10 space-y-4 p-6">
                            {/* <p className="font-medium text-sm">Link this Virtual Instacard to a Universal Instacard</p> */}
                            <div className='h-auto w-full relative '>
                                <Image src='/img/creditcard.png' alt='Credit Card' width={1000} height={1000} className='h-full w-full object-contain' />
                                <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl w-full text-center'>0000 0000 0000 0000</p>
                            </div>

                            <p className='mt-4 text-sm'>You do not have any Universal Instacard available for linking to a Virtual Card issued by <strong>FCMB.</strong></p>
                            <p className='text-sm'> Enter the card number of a Universal or Sigma card that you have with you</p>

                            <div className='flex flex-col items-start justify-start w-full mt-4'>
                                <p className='text-sm text-left'>Universal Card Number</p>
                                <div className='w-full mt-3 p-4  border border-text-primary/20 rounded-2xl flex  items-center justify-between'>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={14}
                                        placeholder="0000 0000 0000"
                                        value={cardNumber}
                                        className="flex-1 outline-none focus:outline-none active:outline-none focus:border-none active:border-none ring-0 focus:ring-none border-none bg-transparent text-text-primary focus-visible:ring-0 focus-visible:outline-none! focus-visible:ring-offset-0"
                                        onChange={handleCardNumberChange}
                                    />
                                    <div className='flex items-center gap-4'>
                                        <Image src={ICONS.mastercard} alt='Mastercard' width={40} height={24} className='object-contain h-4 w-auto' />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" w-full p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
                            <Link href={routes.addUniversalVerifyMobile} className='bg-primary p-4 text-center text-[#fff] flex items-center justify-center  rounded-full w-full'>
                                Apply Now
                            </Link>
                        </div>
                    </>
                )
            case 'SELECT_CARD':
                return <SigmaCardOptionsScreen universalCards={universalCards} onNext={handleCardSelected} />
            case 'VERIFY_PIN':
                const card = universalCards.find(c => c.cardId === selectedCardId)
                return (
                    <CardPinAuth 
                        title="Enter PIN for Universal Card"
                        cardImageSrc="/img/cards/Universal1.png"
                        maskedNumber={card?.maskedCardNumber}
                        onVerified={handlePinVerified} 
                    />
                )
            case 'SUCCESS':
                return <UniversalLinkedSuccess />
            default:
                return null
        }
    }

    if (state === 'SELECT_CARD' || state === 'VERIFY_PIN' || state === 'SUCCESS') {
        return renderStep()
    }

    return (
        <LayoutSheet routeTitle='Link Universal Card' needPadding={false}>
            {renderStep()}
        </LayoutSheet>
    )
}
