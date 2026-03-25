'use client'

import SuccessScreen from '@/components/screens/AuthScreens/SuccessScreen'
import { notifyUserCancelled } from '@/lib/bridge'

export default function AddMoneySuccessPage() {
  return (
    <SuccessScreen
      title="Payment was Successful!"
      description="Your Payment Limits have been successfully updated"
      buttonText="Back to Home"
      onButtonClick={notifyUserCancelled}
    />
  )
}
