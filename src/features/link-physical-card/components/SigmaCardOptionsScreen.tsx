'use client'

import { SheetContainer } from '@/components/ui'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useRef, useMemo } from 'react'
import AddSigmaCardModal from '@/features/link-physical-card/components/AddSigmaCardModal'
import { routes } from '@/lib/routes'
import { useCardWalletStore } from '@/store/useCardWalletStore'

function maskCardNumber(cardNumber: string): string {
    const digits = cardNumber.replace(/\s/g, '')
    const lastFour = digits.slice(-4)
    return `**** **** **** ${lastFour}`
}

export default function SigmaCardOptionsScreen() {
    const allCards = useCardWalletStore((s) => s.cards)
    const setPendingLinkUniversalCardId = useCardWalletStore((s) => s.setPendingLinkUniversalCardId)
    const universalCards = useMemo(
        () => allCards.filter((c) => c.cardForm === 'universal'),
        [allCards]
    )
    const [selectedCard, setSelectedCard] = useState<string | null>(null)
    const [consentChecked, setConsentChecked] = useState(false)
    const [showAddCardModal, setShowAddCardModal] = useState(false)
    const [shake, setShake] = useState(false)
    const consentRef = useRef<HTMLButtonElement>(null)

    // Check if there are any non-linked cards available
    const hasNonLinkedCards = useMemo(
        () => universalCards.some((card) => !card.linkedVirtualCardId),
        [universalCards]
    )

    const handleNextClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!selectedCard || !consentChecked) {
            e.preventDefault()
            if (!consentChecked && consentRef.current) {
                consentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
                setShake(true)
                setTimeout(() => setShake(false), 500)
            }
        } else {
            setPendingLinkUniversalCardId(selectedCard)
        }
    }

    return (
        <div className='h-screen flex flex-col'>
            <SheetContainer>
                <div className="flex-1 flex-col flex justify-start items-center overflow-auto pt-10 space-y-4  p-6">
                    <p className="font-medium text-sm">Link this Virtual Instacard to a Universal Instacard</p>
                    <div className='h-auto w-full relative '>
                        <Image src='/img/creditcard.png' alt='Credit Card' width={1000} height={1000} className='h-full w-full object-contain' />
                        <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl w-full text-center'>0000 0000 0000 0000</p>
                    </div>

                    <p className='mt-4 text-sm'>You have following Universal Instacard available for linking to this Virtual Card issued by <strong>FCMB.</strong></p>
                    <p className='text-sm text-left w-full'>Select the one you want to link to this Instacard</p>

                    <div className='flex flex-col items-start justify-start w-full mt-4 space-y-3'>
                        {universalCards.length === 0 && (
                            <p className="text-sm text-text-secondary text-center w-full py-4">No universal cards available</p>
                        )}
                        {universalCards.map((card) => {
                            const isLinked = !!card.linkedVirtualCardId
                            return (
                                <button
                                    key={card.id}
                                    onClick={() => !isLinked && setSelectedCard(card.id)}
                                    disabled={isLinked}
                                    className={`w-full p-4 border rounded-2xl flex items-center gap-3 transition-all ${isLinked
                                            ? 'border-text-primary/10 opacity-50'
                                            : selectedCard === card.id
                                                ? 'border-text-primary border-2'
                                                : 'border-text-primary/20'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isLinked
                                            ? 'border-text-primary/20'
                                            : selectedCard === card.id ? 'border-orange bg-orange' : 'border-text-primary/40'
                                        }`}>
                                        {selectedCard === card.id && !isLinked && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm text-text-primary">
                                            {maskCardNumber(card.cardNumber)} ( Universal Card )
                                        </span>
                                        {isLinked && (
                                            <span className="text-xs text-orange">Already linked</span>
                                        )}
                                    </div>
                                </button>
                            )
                        })}

                        {hasNonLinkedCards && (
                            <button
                                ref={consentRef}
                                onClick={() => setConsentChecked(!consentChecked)}
                                className={`w-full p-2 flex items-start gap-3 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                                style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${consentChecked ? 'border-primary bg-primary' : shake ? 'border-red-500' : 'border-text-primary/40'
                                    }`}>
                                    {consentChecked && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`text-sm text-left ${shake ? 'text-red-500' : 'text-text-primary'}`}>
                                    I consent to link this Instacard to my Universal Instacrd I have selected above
                                </span>
                            </button>
                        )}
                    </div>


                </div>
                <div className=" w-full p-4 space-y-2 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] ">
                    <Link
                        href={routes.faceVerification}
                        onClick={handleNextClick}
                        className={`bg-primary p-4 text-center text-white flex items-center justify-center rounded-full w-full ${!selectedCard || !consentChecked ? 'opacity-50' : ''
                            }`}
                    >
                       Next
                    </Link>
                    <button
                        onClick={() => setShowAddCardModal(true)}
                        className={`border-primary border  p-4  gap-2 text-center text-text-primary flex items-center justify-center rounded-full w-full `}
                    >
                        <PlusIcon /> <p>
                            Add New Universal Instacard
                        </p>
                    </button>
                </div>
            </SheetContainer>

            <AddSigmaCardModal
                visible={showAddCardModal}
                onClose={() => setShowAddCardModal(false)}
                onSubmit={(cardNumber) => {
                    console.log('Card number submitted:', cardNumber)
                    // Handle the card number submission here
                }}
            />
        </div>
    )
}
