'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileSection } from '@/components/QRPayments/ProfileSection'
import { AmountDisplay } from '@/components/QRPayments/AmountDisplay'
import { MessageInput } from '@/components/QRPayments/MessageInput'
import { NumberPad } from '@/components/QRPayments/NumberPad'
import { ProceedButton } from '@/components/QRPayments/ProceedButton'
import { BankActionsDrawer, type BankItem } from '@/components/QRPayments/BankActionsDrawer'
import CardPinAuth from '@/features/card-detail/components/CardPinAuth'

const RECIPIENT = {
  name: 'Nirdesh Malik',
  phone: '9876543210',
  upiId: 'nirdeshmalik@okaxis',
}

const BANKS: BankItem[] = [
  { id: 'debit1', name: 'FCMB Bank Debit', subtitle: 'FCMB Debit Card', balance: 'N 12,450.10', cardType: 'debit' },
  { id: 'debit2', name: 'FCMB Bank Debit', subtitle: 'FCMB Debit Card', balance: 'N 8,200.50', cardType: 'debit' },
  { id: 'credit1', name: 'FCMB Credit', subtitle: 'FCMB Credit Card', balance: 'N 50,000.00', cardType: 'credit' },
  { id: 'credit2', name: 'FCMB Credit', subtitle: 'FCMB Credit Card', balance: 'N 35,600.75', cardType: 'credit' },
  { id: 'prepaid1', name: 'FCMB Prepaid', subtitle: 'FCMB Prepaid Card', balance: 'N 9,500.00', cardType: 'prepaid' },
  { id: 'gift1', name: 'FCMB Gift', subtitle: 'FCMB Gift Card', balance: 'N 5,000.00', cardType: 'gift' },
]

const CARD_IMAGES: Record<string, string> = {
  debit: '/img/cards/debit.png',
  credit: '/img/cards/credit.png',
  prepaid: '/img/cards/prepaid.png',
  gift: '/img/cards/gift.png',
}

export default function PaymentAmountPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('0')
  const [message, setMessage] = useState('')
  const [bankDrawerVisible, setBankDrawerVisible] = useState(false)
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null)
  const [pinVisible, setPinVisible] = useState(false)

  const selectedBank = BANKS.find(b => b.id === selectedBankId) ?? BANKS[0]

  const initials = RECIPIENT.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleNumberPress = (num: string) => {
    if (num === '.' && amount.includes('.')) return

    let newAmount: string
    if (amount === '0' && num !== '.') {
      newAmount = num
    } else {
      newAmount = amount + num
    }

    const numericValue = parseFloat(newAmount.replace(/,/g, ''))
    if (numericValue > 1_000_000) return

    setAmount(newAmount)
  }

  const handleBackspace = () => {
    setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'))
  }

  const handleProceed = () => {
    setBankDrawerVisible(true)
  }

  const handleConfirm = () => {
    setBankDrawerVisible(false)
    setTimeout(() => setPinVisible(true), 350)
  }

  const handlePinVerified = () => {
    setPinVisible(false)
    const params = new URLSearchParams({
      amount,
      recipientName: RECIPIENT.name,
      upiId: RECIPIENT.upiId,
      ...(message && { message }),
    })
    router.replace(`/payment-success?${params.toString()}`)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <ProfileSection
        name={RECIPIENT.name}
        phone={RECIPIENT.phone}
        upiId={RECIPIENT.upiId}
        initials={initials}
      />

      <AmountDisplay amount={amount} />

      <MessageInput value={message} onChangeText={setMessage} />

      <div className="px-6 py-4">
        <ProceedButton amount={amount} onPress={handleProceed} />
      </div>

      <NumberPad onNumberPress={handleNumberPress} onBackspace={handleBackspace} />

      <BankActionsDrawer
        visible={bankDrawerVisible}
        amount={amount}
        banks={BANKS}
        selectedBankId={selectedBankId}
        onSelectBank={setSelectedBankId}
        onClose={() => setBankDrawerVisible(false)}
        onAddNew={() => {
          setBankDrawerVisible(false)
          console.log('Add new bank/card')
        }}
        onConfirm={handleConfirm}
      />

      {pinVisible && (
        <div className="fixed inset-0 z-50 bg-white">
          <CardPinAuth
            title="Enter PIN to Pay"
            cardImageSrc={CARD_IMAGES[selectedBank?.cardType ?? 'debit'] ?? CARD_IMAGES.debit}
            maskedNumber={selectedBank?.subtitle ?? 'FCMB Debit Card'}
            onVerified={handlePinVerified}
          />
        </div>
      )}
    </div>
  )
}
