'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import PinSetupForm from '@/components/screens/AuthScreens/PinSetupFormScreen'
import SuccessScreen from '@/components/screens/AuthScreens/SuccessScreen'
import { useManagingCard } from '@/hooks/useManagingCard'
import { notifyUserCancelled } from '@/lib/bridge'


export default function PinChangeSetupPage() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const { changePin } = useManagingCard()
  const router = useRouter()
  const handleSubmit = async (pin: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    changePin(pin)
    setShowSuccessPopup(true)
  }

  const handlePopupClose = () => {
    setShowSuccessPopup(false)
    router.push('/instacard')
    notifyUserCancelled()
  }

  if (showSuccessPopup) {
    return (
      <SuccessScreen
        title="PIN Updated Successfully!"
        description="Your card PIN has been successfully updated."
        buttonText="Back to Home"
        onButtonClick={handlePopupClose}
        showCardPreview={false}
      />
    )
  }

  return (
    <PinSetupForm
      title="PIN Setup"
      subtitle="Please setup your PIN for this Instacard"
      pinLabel="Enter 4-digit PIN"
      confirmPinLabel="Re-Enter PIN"
      onSubmit={handleSubmit}
    />
  )
}
