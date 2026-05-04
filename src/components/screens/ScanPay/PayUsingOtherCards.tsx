import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import { PlusIcon } from 'lucide-react'

import NiaraSymbol from '@/components/Extras/NiaraSymbol'
import { Button } from '@/components/ui'
import { AddMoneyCardsSection, type CardType } from '@/components/ui/AddMoneyCardsSection'
import { AddNewCardForm, type AddNewCardFormValues } from '@/components/ui/AddNewCardForm'
import BottomSheetModal from '@/components/ui/BottomSheetModal'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { formatAmountWithCommas } from '@/lib/format-amount'
import { routes } from '@/lib/routes'

import CardPinVerificationDrawer from '../AuthScreens/CardPinVerificationDrawer'

type PayUsingOtherCardsProps = {
  amount: number
  onPay: (payload: { card: CardType }) => void
}

export default function PayUsingOtherCards({ amount, onPay }: PayUsingOtherCardsProps) {
  // Default to first card to guarantee type
  const DEFAULT_CARD: CardType = 'sigma'
  const [selectedCard, setSelectedCard] = useState<CardType>(DEFAULT_CARD)
  const [newCardOpen, setNewCardOpen] = useState(false)
  const [newCardValues, setNewCardValues] = useState<AddNewCardFormValues | null>(null)
  const [pinDrawerOpen, setPinDrawerOpen] = useState(false)
  const router = useRouter()

  const handleSelectCard = (card: CardType) => {
    setSelectedCard(card)
  }

  const openAddCard = () => setNewCardOpen(true)

  const handlePayNow = () => {
    setPinDrawerOpen(true)
  }

  return (
    <>
      <div className='h-full w-full flex flex-col overflow-y-auto pb-24 items-center justify-start px-4 space-y-4'>
        <div className="p-4 border border-border rounded-2xl w-full flex items-center justify-between">
          <p className="font-medium text-sm text-text-primary truncate">Total Payable</p>
          <p className="text-md font-bold truncate">
            <span className="line-through mr-1"><NiaraSymbol /></span> {formatAmountWithCommas(amount.toString())}
          </p>
        </div>
        <p className='w-full ml-4 text-text-primary/70 text-xs'>
          * 1% of the amount requested subject to maximum of N 2,000
        </p>
        <AddMoneyCardsSection selectedCard={selectedCard} onSelectCard={handleSelectCard} />
        <button
          type='button'
          onClick={openAddCard}
          className='w-full flex items-center justify-start gap-2 text-primary text-sm font-medium'
        >
          <span className='w-10 h-10 flex rounded-lg bg-background2 p-2 text-text-primary items-center justify-center'>
            <PlusIcon size={18} className='h-full w-full object-contain' />
          </span>
          <span className='text-text-primary'>Pay with new card</span>
        </button>
        <ButtonComponent
          title={`Pay Now ₦ ${formatAmountWithCommas(amount.toString())}`}
          onClick={handlePayNow}
        />
      </div>

      <BottomSheetModal
        visible={newCardOpen}
        onClose={() => setNewCardOpen(false)}
        title="Pay with new card"
        maxHeight={0.7}
      >
        <AddNewCardForm showCheckbox={false} border={false} onChange={(v) => setNewCardValues(v)} />
        <Button 
          fullWidth 
          className='bg-primary text-white mt-4' 
          onClick={() => {
            if (!newCardValues) return
            setNewCardOpen(false)
            setPinDrawerOpen(true)
          }}
        >{`Pay Now ₦ ${formatAmountWithCommas(amount.toString())}`}</Button>
      </BottomSheetModal>

      <CardPinVerificationDrawer
        visible={pinDrawerOpen}
        fieldLength={6}
        onClose={() => setPinDrawerOpen(false)}
        showTitle={false}
        subtitle="Enter Your 6 Digit OTP"
        onVerified={() => {
          setPinDrawerOpen(false)
          onPay({ card: selectedCard })
          router.push(`${routes.paymentSuccess}?amount=${amount}&method=other&cardId=${selectedCard}`)
        }}
      />
    </>
  )
}
