'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProfileSection } from '@/components/screens/components/QRPayments/ProfileSection'
import { AmountDisplay } from '@/components/screens/components/QRPayments/AmountDisplay'
import { MessageInput } from '@/components/screens/components/QRPayments/MessageInput'
import { OTPKeypad } from '@/components/screens/components/ui/Keypad'
import { ProceedButton } from '@/components/screens/components/QRPayments/ProceedButton'
import { BankActionsDrawer, type BankItem } from '@/components/screens/components/QRPayments/BankActionsDrawer'
import CardPinAuth from '@/components/screens/AuthScreens/CardPinAuth'
import { useAppSelector } from '@/store/redux/hooks'
import { useSlideUpKeypad } from '../../../hooks/useSlideUpKeypad'

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

export default function MakePaymentsScreen() {
  const router = useRouter()
  const amountSectionRef = useRef<HTMLDivElement | null>(null)
  const fullName = useAppSelector((s) => s.user.fullName)
  const mobile = useAppSelector((s) => s.user.mobile)
  const email = useAppSelector((s) => s.user.email)
  const RECIPIENT = {
    name: fullName,
    phone: mobile,
    upiId: email,
  }
  const [amount, setAmount] = useState('0')
  const [message, setMessage] = useState('')
  const [bankDrawerVisible, setBankDrawerVisible] = useState(false)
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null)
  const [pinVisible, setPinVisible] = useState(false)
  const { keypadRef, isKeypadOpen, openKeypad, closeKeypad } = useSlideUpKeypad({
    insideRefs: [amountSectionRef],
  })

  useEffect(() => {
    openKeypad()
  }, [openKeypad])

  const selectedBank = BANKS.find(b => b.id === selectedBankId) ?? BANKS[0]

  const initials = RECIPIENT.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleKeyPress = (key: string) => {
    if (key === 'del') {
      setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'))
      return
    }

    let newAmount: string
    if (amount === '0' && key !== '.') {
      newAmount = key
    } else {
      newAmount = amount + key
    }

    const numericValue = parseFloat(newAmount.replace(/,/g, ''))
    if (numericValue > 1_000_000) return

    setAmount(newAmount)
  }

  const handleProceed = () => {
    closeKeypad()
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
    router.replace(`/scan-and-pay/payment-success?${params.toString()}`)
  }

  return (
    <div className="flex flex-col flex-1 bg-background">
      <div className='space-y-4  flex-1 overflow-y-auto'>

        <ProfileSection
          name={RECIPIENT.name}
          phone={RECIPIENT.phone}
          upiId={RECIPIENT.upiId}
          initials={initials}
        />

        <div ref={amountSectionRef}>
          <AmountDisplay amount={amount} onPress={openKeypad} />
        </div>

        <MessageInput value={message} onChangeText={setMessage} />

        <div className="px-6 text-text-primary py-4">
          <ProceedButton amount={amount} onPress={handleProceed} />
        </div>
      </div>



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

      <div
        ref={keypadRef}
        className={`fixed bottom-0 h-fit left-0 right-0 transition-opacity ${isKeypadOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <OTPKeypad onKeyPress={handleKeyPress} />
      </div>

      {pinVisible && (
        <div className="fixed inset-0 z-50">
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