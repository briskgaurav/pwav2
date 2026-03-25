'use client'

import { useState } from 'react'
import { notifyUserCancelled } from '@/lib/bridge'
import PinSetupForm from '@/components/screens/AuthScreens/PinSetupFormScreen'
import SuccessScreen from '@/components/screens/AuthScreens/SuccessScreen'
import { useManagingCard } from '@/hooks/useManagingCard'

export default function CreatePinPage() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const { changePin } = useManagingCard()

  const handleSubmit = async (pin: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    changePin(pin)
    setShowSuccessPopup(true)
  }

  const handlePopupClose = () => {
    setShowSuccessPopup(false)
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
      title="Create New PIN"
      subtitle="Please setup your PIN for this Instacard"
      pinLabel="Enter New PIN"
      confirmPinLabel="Confirm New PIN"
      titleWeight="medium"
      
      onSubmit={handleSubmit}
    />
  )
}
