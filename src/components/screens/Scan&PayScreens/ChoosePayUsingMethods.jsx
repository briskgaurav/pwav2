'use client'
import { useMemo, useState } from "react"
import { useRouter } from 'next/navigation'
import GooeyToggleWrapper from '../../ui/GooeyToggleWrapper'
import PayUsingInstacard from '../ScanPay/PayUsingInstacard'
import PayUsingBalance from '../ScanPay/PayUsingBalance'
import PayUsingOtherCards from '../ScanPay/PayUsingOtherCards'
import CardPinVerificationDrawer from '../AuthScreens/CardPinVerificationDrawer'
import { routes } from '@/lib/routes'
import { CARD_IMAGE_PATHS } from '@/constants/cardData'

const TAB_CONTENT = [
  { title: 'Instacard', id: 'instacard' },
  { title: 'Other Cards', id: 'other' },
  { title: 'Balance Accounts', id: 'balance' },
]

export default function ChoosePayUsingMethods({ amount = 0, message = '', recipientName = '' } = {}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const [pinOpen, setPinOpen] = useState(false)
  const [pinFieldLength, setPinFieldLength] = useState(4)
  const [pinSubtitle, setPinSubtitle] = useState('Enter your PIN to continue')
  const [pinPayingInfo, setPinPayingInfo] = useState('')
  const [pinVerify, setPinVerify] = useState(() => () => true)
  const [pinOnVerified, setPinOnVerified] = useState(() => () => {})
  const [pinOnClose, setPinOnClose] = useState(() => () => {})

  const openPinDrawer = useMemo(() => {
    return ({ fieldLength, subtitle, payingInfo, verifyPin, onVerified, onClose }) => {
      setPinFieldLength(fieldLength)
      setPinSubtitle(subtitle)
      setPinPayingInfo(payingInfo ?? '')
      setPinVerify(() => verifyPin ?? (() => true))
      setPinOnVerified(() => onVerified ?? (() => {}))
      setPinOnClose(() => onClose ?? (() => {}))
      setPinOpen(true)
    }
  }, [])

  const pushPaymentSuccess = (params) => {
    const usp = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => usp.set(k, String(v)))
    router.push(`${routes.paymentSuccess}?${usp.toString()}`)
  }

  const handlePayInstacard = ({ card, amount: finalAmount }) => {
    pushPaymentSuccess({
      amount: finalAmount ?? 0,
      method: 'instacard',
      cardId: card?.id ?? '',
      cardImageSrc: CARD_IMAGE_PATHS?.[card?.imageId] ?? '',
      maskedNumber: card?.cardNumber ?? '',
      ...(message.trim() ? { message: message.trim() } : {}),
      ...(recipientName.trim() ? { recipientName: recipientName.trim() } : {}),
    })
  }

  const handlePayBalance = ({ accountId, amount: finalAmount }) => {
    pushPaymentSuccess({
      amount: finalAmount ?? amount ?? 0,
      method: 'balance',
      accountId,
      ...(message.trim() ? { message: message.trim() } : {}),
      ...(recipientName.trim() ? { recipientName: recipientName.trim() } : {}),
    })
  }

  const handlePayOtherCard = ({ card }) => {
    pushPaymentSuccess({
      amount: amount ?? 0,
      method: 'other',
      cardId: card ?? '',
      ...(message.trim() ? { message: message.trim() } : {}),
      ...(recipientName.trim() ? { recipientName: recipientName.trim() } : {}),
    })
  }

  return (
    <>
      <GooeyToggleWrapper
        tabs={TAB_CONTENT}
        activeIndex={activeTab}
        onChange={setActiveTab}
        layoutId="active-tab"
        renderAnimatedContent={() => (
          <div className="pt-6 pb-4">
            {TAB_CONTENT[activeTab]?.id === 'instacard' ? (
              <PayUsingInstacard amount={amount} onPay={handlePayInstacard} openPinDrawer={openPinDrawer} />
            ) : TAB_CONTENT[activeTab]?.id === 'other' ? (
              <PayUsingOtherCards amount={amount} onPay={handlePayOtherCard} openPinDrawer={openPinDrawer} />
            ) : (
              <PayUsingBalance amount={amount} onPay={handlePayBalance} openPinDrawer={openPinDrawer} />
            )}
          </div>
        )}
      >
        <div />
      </GooeyToggleWrapper>

      {/* Root-level drawer (NOT inside gooey filter layer) */}
      <CardPinVerificationDrawer
        visible={pinOpen}
        fieldLength={pinFieldLength}
        showTitle={false}
        payingInfo={pinPayingInfo}
        subtitle={pinSubtitle}
        verifyPin={(pin) => pinVerify(pin)}
        onClose={() => {
          pinOnClose()
          setPinOpen(false)
        }}
        onVerified={() => {
          pinOnVerified()
          setPinOpen(false)
        }}
      />
    </>
  )
}
