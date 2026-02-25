'use client'

import { useState } from 'react'
import { notifyUserCancelled } from '@/lib/bridge'
import PinSetupForm from '@/features/pin/components/PinSetupForm'
import PinSuccessPopup from '@/features/pin/components/PinSuccessPopup'

export default function CreatePinPage() {
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
      title="Create New PIN"
      subtitle="Please setup your PIN for this Instacard"
      pinLabel="Enter New PIN"
      confirmPinLabel="Confirm New PIN"
      titleWeight="medium"
      
      onSubmit={handleSubmit}
    />
  )
}
