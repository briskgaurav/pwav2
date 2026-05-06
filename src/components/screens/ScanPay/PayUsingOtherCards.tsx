import { AddMoneyCardsSection, CardType, CARD_OPTIONS } from '@/components/ui/AddMoneyCardsSection'
import { PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import ButtonComponent from '@/components/ui/ButtonComponent'
import NiaraSymbol from '@/components/Extras/NiaraSymbol'
import { formatAmountWithCommas } from '@/lib/format-amount'
import { PaymentProcessingOverlay } from '@/components/ui'
import CardPinVerificationDrawer from '../AuthScreens/CardPinVerificationDrawer'
import { usePaymentProcessing } from '@/hooks/usePaymentProcessing'
import OtherCardsNewCardSheet from './OtherCardsNewCardSheet'

type PayUsingOtherCardsProps = {
  amount: number
  onPay: (payload: { card: CardType }) => void
  openPinDrawer?: (opts: {
    fieldLength: number
    subtitle: string
    payingInfo?: string
    onVerified: () => void
    onClose: () => void
  }) => void
}

export default function PayUsingOtherCards({ amount, onPay, openPinDrawer }: PayUsingOtherCardsProps) {
  // Default to first card to guarantee type
  const DEFAULT_CARD: CardType = 'sigma'
  const [selectedCard, setSelectedCard] = useState<CardType>(DEFAULT_CARD)
  const [newCardOpen, setNewCardOpen] = useState(false)
  const [pinDrawerOpen, setPinDrawerOpen] = useState(false)
  const processing = usePaymentProcessing()
  const [payingInfoOverride, setPayingInfoOverride] = useState<string | null>(null)

  const selectedCardOption = CARD_OPTIONS.find((c) => c.id === selectedCard) ?? null
  const payingWithLabel = selectedCardOption
    ? `${selectedCardOption.description} ${selectedCardOption.maskedNumber}`
    : `Card ${selectedCard}`

  const handleSelectCard = (card: CardType) => {
    setSelectedCard(card)
  }

  const openAddCard = () => setNewCardOpen(true)

  const openOtpFlow = (override?: { payingInfo?: string }) => {
    // local fallback (when no root drawer provided)
    if (!openPinDrawer) {
      setPinDrawerOpen(true)
      return
    }

    openPinDrawer({
      fieldLength: 6,
      subtitle: 'Enter Your 6 Digit OTP',
      payingInfo: override?.payingInfo ?? payingWithLabel,
      onClose: () => {
        if (processing.model.open) return
        setPinDrawerOpen(false)
      },
      onVerified: () => {
        setPinDrawerOpen(false)
        processing.start({ minDurationMs: 5000 })
        const cardToPay = selectedCard
        processing.succeedAfterMinDuration(() => {
          onPay({ card: cardToPay })
        }, 5000)
      },
    })
  }

  const handlePayNow = () => {
    openOtpFlow()
  }

  return (
    <>
      <div className='h-full min-h-[75vh] w-full flex flex-col overflow-y-auto pb-24 items-center justify-start px-4 space-y-4'>
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
        <div className=''>

          <ButtonComponent
            title={`Pay Now ₦ ${formatAmountWithCommas(amount.toString())}`}
            onClick={handlePayNow}
          />
        </div>
      </div>



      {!openPinDrawer && (
        <CardPinVerificationDrawer
          visible={pinDrawerOpen}
          fieldLength={6}
          onClose={() => {
            if (processing.model.open) return
            setPinDrawerOpen(false)
          }}
          showTitle={false}
          payingInfo={payingInfoOverride ?? payingWithLabel}
          subtitle="Enter Your 6 Digit OTP"
          onVerified={() => {
            setPinDrawerOpen(false)
            processing.start({ minDurationMs: 5000 })
            const cardToPay = selectedCard
            processing.succeedAfterMinDuration(() => {
              onPay({ card: cardToPay })
            }, 5000)
          }}
        />
      )}

      <PaymentProcessingOverlay
        open={processing.model.open}
        state={processing.model.state}
        title={processing.model.title}
        subtitle={processing.model.subtitle}
        primaryActionLabel={processing.model.state === 'error' ? 'Close' : undefined}
        onPrimaryAction={processing.model.state === 'error' ? processing.close : undefined}
        secondaryActionLabel={processing.model.state === 'error' ? 'Dismiss' : undefined}
        onSecondaryAction={processing.model.state === 'error' ? processing.close : undefined}
      />
      <OtherCardsNewCardSheet
        open={newCardOpen}
        amount={amount}
        onClose={() => setNewCardOpen(false)}
        onContinue={({ payingInfo }) => {
          setPayingInfoOverride(payingInfo)
          setNewCardOpen(false)
          openOtpFlow({ payingInfo })
        }}
      />
    </>
  )
}
