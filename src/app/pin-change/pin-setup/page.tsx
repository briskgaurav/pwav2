'use client'

import { useState } from 'react'
import { notifyUserCancelled } from '@/lib/bridge'
import PinSetupForm from '@/features/pin/components/PinSetupForm'
import PinSuccessPopup from '@/features/pin/components/PinSuccessPopup'

export default function PinChangeSetupPage() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)

  const handleSubmit = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setShowSuccessPopup(true)
  }

  const handlePopupClose = () => {
    setShowSuccessPopup(false)
    notifyUserCancelled()
  }

  if (showSuccessPopup) {
    return (
      <PinSuccessPopup
        title="PIN Updated Successfully!"
        description="Your card PIN has been successfully updated."
        buttonText="Back to Home"
        onButtonClick={handlePopupClose}
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
