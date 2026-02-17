'use client'

import { SheetContainer } from '@/components/ui'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import AddSigmaCardModal from '@/features/link-physical-card/components/AddSigmaCardModal'
import { routes } from '@/lib/routes'

const CARD_OPTIONS = [
    { id: '1', number: '*** *** *** 7872', type: 'Sigma Card' },
    { id: '2', number: '*** *** *** 837', type: 'Universal Card' },
    { id: '3', number: '*** *** *** 9040', type: 'Universal Card', disabled: false },
    { id: '4', number: '*** *** *** 1234', type: 'Universal Card' },
]

export default function SigmaCardOptionsScreen() {
    const [selectedCard, setSelectedCard] = useState<string | null>(null)
    const [consentChecked, setConsentChecked] = useState(false)
    const [showAddCardModal, setShowAddCardModal] = useState(false)
    return (
        <div className='h-screen flex flex-col'>
            <SheetContainer>
                <div className="flex-1 flex-col flex justify-start items-center overflow-auto pt-10 space-y-4  p-6">
                    <p className="font-medium text-sm">Link this Virtual Instacard to a Physical Instacard</p>
                    <div className='h-auto w-full relative '>
                        <Image src='/img/creditcard.png' alt='Credit Card' width={1000} height={1000} className='h-full w-full object-contain' />
                        <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl w-full text-center'>0000 0000 0000 0000</p>
                    </div>

                    <p className='mt-4 text-sm'>You have following Physical Instacard available for linking to this Virtual Card issued by <strong>FCMB.</strong></p>
                    <p className='text-sm text-left w-full'>Select the one you want to link to this Instacard</p>

                    <div className='flex flex-col items-start justify-start w-full mt-4 space-y-3'>
                        {CARD_OPTIONS.map((card) => (
                            <button
                                key={card.id}
                                onClick={() => !card.disabled && setSelectedCard(card.id)}
                                disabled={card.disabled}
                                className={`w-full p-4 border rounded-2xl flex items-center gap-3 transition-all ${card.disabled
                                    ? 'border-dashed border-text-primary/30 opacity-60 cursor-not-allowed'
                                    : selectedCard === card.id
                                        ? 'border-text-primary border-2'
                                        : 'border-text-primary/20'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCard === card.id ? 'border-orange bg-orange' : 'border-text-primary/40'
                                    }`}>
                                    {selectedCard === card.id && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`text-sm ${card.disabled ? 'text-text-primary/50' : 'text-text-primary'}`}>
                                    {card.number} ({card.type})
                                </span>
                            </button>
                        ))}

                        <button
                            onClick={() => setConsentChecked(!consentChecked)}
                            className='w-full p-2 flex items-start gap-3'
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${consentChecked ? 'border-primary bg-primary' : 'border-text-primary/40'
                                }`}>
                                {consentChecked && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <span className='text-sm text-text-primary text-left'>
                                I consent to link this Instacard to my Physical Instacrd I have selected above
                            </span>
                        </button>
                    </div>


                </div>
                <div className=" w-full p-4 space-y-2 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] ">
                    <Link
                        href={routes.faceVerification}
                        className={`bg-primary p-4 text-center text-white flex items-center justify-center rounded-full w-full ${!selectedCard || !consentChecked ? 'opacity-50 pointer-events-none' : ''
                            }`}
                    >
                       Next
                    </Link>
                    <button
                        onClick={() => setShowAddCardModal(true)}
                        className={`border-primary border  p-4  gap-2 text-center text-black flex items-center justify-center rounded-full w-full `}
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
