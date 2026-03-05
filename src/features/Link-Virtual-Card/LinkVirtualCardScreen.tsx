'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import CardPinAuth from '@/features/card-detail/components/CardPinAuth'
import VerificationCodeScreen from '@/features/verification/components/VerificationCodeScreen'
import SuccessScreen from '@/features/success/components/SuccessScreen'
import { SheetContainer } from '@/components/ui'
import { routes } from '@/lib/routes'
import Image from 'next/image'
import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import AddSigmaCardModal from '@/features/link-physical-card/components/AddSigmaCardModal'
import { ICONS } from '@/constants/icons'

type LinkVirtualStep = 'pin' | 'selectCard' | 'emailOtp' | 'phoneOtp' | 'success'

interface CardData {
  id: string
  number: string
  type: string
  disabled?: boolean
}

const CARD_OPTIONS: CardData[] = [
  { id: '1', number: '*** *** *** 7872', type: 'Virtual Card' },
  { id: '2', number: '*** *** *** 837', type: 'Virtual Card' },
  { id: '3', number: '*** *** *** 9040', type: 'Virtual Card', disabled: false },
  { id: '4', number: '*** *** *** 1234', type: 'Virtual Card' },
]

export default function LinkVirtualCardScreen() {
  const router = useRouter()
  const [step, setStep] = useState<LinkVirtualStep>('pin')
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [consentChecked, setConsentChecked] = useState(false)
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [shake, setShake] = useState(false)
  const consentRef = useRef<HTMLButtonElement>(null)

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
        cardImageSrc="/img/debitmockup.png"
        maskedNumber="0000 0000 0000 0000"
        onVerified={() => setStep('selectCard')}
      />
    )
  }

  if (step === 'selectCard') {
    return (
      <div className='h-screen flex flex-col'>
        <SheetContainer>
          <div className="flex-1 flex-col flex justify-start items-center overflow-auto pt-10 space-y-4 p-6">
            <p className="font-medium text-sm">Link this Virtual Instacard to a Universal Instacard</p>
            <div className='h-auto w-full relative '>
              <Image src='/img/creditcard.png' alt='Credit Card' width={1000} height={1000} className='h-full w-full object-contain' />
              <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl w-full text-center'>0000 0000 0000 0000</p>
            </div>

            <p className='mt-4 text-sm'>You have following Universal Instacard available for linking to this Virtual Card issued by <strong>FCMB.</strong></p>
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
            </div>
          </div>
          <div className=" w-full p-4 space-y-2 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] ">
            <Link
              href="#"
              onClick={handleNextClick}
              className={`bg-primary p-4 text-center text-white flex items-center justify-center rounded-full w-full ${!selectedCard || !consentChecked ? 'opacity-50' : ''
                }`}
            >
              Next
            </Link>
            {/* <button
              onClick={() => setShowAddCardModal(true)}
              className={`border-primary border p-4 gap-2 text-center text-text-primary flex items-center justify-center rounded-full w-full `}
            >
              <PlusIcon /> <p>
                Add New Virtual Instacard
              </p>
            </button> */}
          </div>
        </SheetContainer>

        <AddSigmaCardModal
          visible={showAddCardModal}
          onClose={() => setShowAddCardModal(false)}
          onSubmit={(cardNumber) => {
            console.log('Card number submitted:', cardNumber)
          }}
        />
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
        successRoute={routes.home}
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
        successRoute={routes.home}
        showKeypad
        onSuccess={() => setStep('success')}
      />
    )
  }

  // Success
  return (
    <SuccessScreen
      title="Virtual Card Linked Successfully"
      description="Your Virtual Instacard has been successfully linked. You can now use it via your Universal Instacard."
      buttonText="Done"
      onButtonClick={() => router.push(routes.home)}
      showCardPreview={false}
    />
  )
}
