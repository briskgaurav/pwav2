'use client'

import React, { useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import CardPinAuth from '@/components/screens/AuthScreens/CardPinAuth'
import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen'
import SuccessScreen from '@/components/screens/AuthScreens/SuccessScreen'
import { CardMockup, SheetContainer } from '@/components/ui'
import { routes } from '@/lib/routes'
import Image from 'next/image'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import AddSigmaCardModal from '@/features/link-physical-card/components/AddSigmaCardModal'
import { ICONS } from '@/constants/icons'
import { useManagingCard } from '@/hooks/useManagingCard'
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { linkVirtualCard as linkVirtualCardAction } from '@/store/redux/slices/cardWalletSlice'

type LinkVirtualStep = 'pin' | 'selectCard' | 'emailOtp' | 'phoneOtp' | 'success'

function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\s/g, '')
  const lastFour = digits.slice(-4)
  return `**** **** **** ${lastFour}`
}

export default function LinkVirtualCardScreen() {
  const dispatch = useAppDispatch()
  const allCards = useAppSelector((s) => s.cardWallet.cards)
  const managingCardId = useAppSelector((s) => s.cardWallet.managingCardId)

  // Get unlinked virtual cards
  const unlinkedVirtualCards = useMemo(
    () => allCards.filter((c) =>
      c.cardForm === 'virtual' &&
      !allCards.some(u => u.cardForm === 'universal' && u.linkedVirtualCardId === c.id)
    ),
    [allCards]
  )

  // Get linked virtual cards (already linked to a universal card)
  const linkedVirtualCards = useMemo(
    () => allCards.filter((c) =>
      c.cardForm === 'virtual' &&
      allCards.some(u => u.cardForm === 'universal' && u.linkedVirtualCardId === c.id)
    ),
    [allCards]
  )

  const router = useRouter()
  const [step, setStep] = useState<LinkVirtualStep>('pin')
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [consentChecked, setConsentChecked] = useState(false)
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [shake, setShake] = useState(false)
  const consentRef = useRef<HTMLButtonElement>(null)
  const { imageSrc, maskedNumber } = useManagingCard()
  const handleNextClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!selectedCard || !consentChecked) {
      e.preventDefault()
      if (!consentChecked && consentRef.current) {
        consentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setShake(true)
        setTimeout(() => setShake(false), 500)
      }
    } else {
      e.preventDefault()
      setStep('emailOtp')
    }
  }

  if (step === 'pin') {
    return (
      <CardPinAuth

        title="Enter PIN for Selected Instacard"
        cardImageSrc={imageSrc || ''}
        maskedNumber={maskedNumber}
        onVerified={() => setStep('selectCard')}
      />
    )
  }

  if (step === 'selectCard') {
    return (
      <div className='h-screen flex flex-col overflow-hidden'>
        <SheetContainer>
          <div className="flex-1 flex-col flex justify-start items-center overflow-auto pt-10 space-y-4 p-6">
            {unlinkedVirtualCards.length === 0 && linkedVirtualCards.length === 0 ? (
              <p className="text-sm text-text-secondary absolute w-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center  py-4">No virtual cards available, Please add a virtual card first!</p>
            ) : (
              <>
                <p className="font-medium text-sm">Link this Virtual Instacard to a Universal Instacard</p>
                <div className='-mt-5'>

                  <CardMockup
                    imageSrc={imageSrc || ''}
                    maskedNumber={maskedNumber}
                    isclickable={false}
                    showActions={false}
                    showNumber={true}
                  />

                </div>


                <p className='mt-4 text-sm'>You have following Universal Instacard available for linking to this Virtual Card issued by <strong>FCMB.</strong></p>
                <p className='text-sm text-left w-full'>Select the one you want to link to this Instacard</p>

                <div className='flex flex-col items-start justify-start w-full mt-4 space-y-3'>

                  {/* Unlinked Virtual Cards */}
                  {unlinkedVirtualCards.length > 0 && (
                    <>
                      <p className='text-xs text-text-secondary font-medium'>Available Virtual Cards</p>
                      {unlinkedVirtualCards.map((card) => (
                        <button
                          key={card.id}
                          onClick={() => setSelectedCard(card.id)}
                          className={`w-full p-4 border rounded-2xl flex items-center gap-3 transition-all ${selectedCard === card.id
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
                          <span className="text-sm text-text-primary">
                            {maskCardNumber(card.cardNumber)} ( Virtual Card )
                          </span>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Linked Virtual Cards */}
                  {linkedVirtualCards.length > 0 && (
                    <>
                      <p className='text-xs text-text-secondary font-medium mt-4'>Already Linked Virtual Cards</p>
                      {linkedVirtualCards.map((card) => (
                        <button
                          key={card.id}
                          disabled
                          className="w-full p-4 border rounded-2xl flex items-center gap-3 transition-all border-text-primary/10 opacity-50"
                        >
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-text-primary/20">
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm text-text-primary">
                              {maskCardNumber(card.cardNumber)} ( Virtual Card )
                            </span>
                            <span className="text-xs text-orange">Already linked</span>
                          </div>
                        </button>
                      ))}
                    </>
                  )}

                  {unlinkedVirtualCards.length > 0 && (
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
                        I consent to link this Instacard to my Virtual Instacard I have selected above
                      </span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          <div className=" w-full p-4 space-y-2 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] flex-shrink-0">
            {/* {unlinkedVirtualCards.length > 0 && ( */}
            <Link
              href="#"
              onClick={handleNextClick}
              className={`bg-primary p-4 text-center text-[#fff] flex items-center justify-center rounded-full w-full ${!selectedCard || !consentChecked ? 'opacity-50' : ''
                }`}
            >
              Next
            </Link>
            <Link
              href={routes.addInstacard}
              className={`border-primary border p-4 gap-2 text-center text-text-primary flex items-center justify-center rounded-full w-full `}
            >
              <PlusIcon /> <p>
                Add New Virtual Instacard
              </p>
            </Link>
            {/* )} */}
          </div>
        </SheetContainer>

      </div>
    )
  }

  if (step === 'emailOtp') {
    return (
      <VerificationCodeScreen
        key="emailOtp"
        title="Verify your Registered Email"
        subtitle="We have sent you a 6-digit code to your Registered Email"
        maskedValue="******@gmail.com"
        successRoute={routes.instacard}
        showKeypad
        onSuccess={() => setStep('phoneOtp')}
      />
    )
  }

  if (step === 'phoneOtp') {
    return (
      <VerificationCodeScreen
        key="phoneOtp"
        title="Verify your Phone Number"
        subtitle="We have sent you a 6-digit code to your Registered Phone Number"
        maskedValue="+234802****0955"
        successRoute={routes.instacard}
        showKeypad
        onSuccess={() => {
          if (managingCardId && selectedCard) {
            dispatch(linkVirtualCardAction({ universalCardId: managingCardId, virtualCardId: selectedCard }))
          }
          setStep('success')
        }}
      />
    )
  }

  return (
    <SuccessScreen
      title="Virtual Card Linked Successfully"
      description="Your Virtual Instacard has been successfully linked. You can now use it via your Universal Instacard."
      buttonText="Done"
      onButtonClick={() => router.push(routes.instacard)}
      showCardPreview={false}
    />
  )
}
