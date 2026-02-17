'use client'

import SuccessScreen from '@/features/success/components/SuccessScreen'
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
