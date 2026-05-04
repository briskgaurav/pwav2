'use client'

import { useRouter } from 'next/navigation'

import SuccessScreen from '@/components/screens/AuthScreens/SuccessScreen'
import { routes } from '@/lib/routes'

export default function AddMoneySuccessPage() {
  const router = useRouter()
  return (
    <SuccessScreen
      title="Payment was Successful!"
      description="Your Payment Limits have been successfully updated"
      buttonText="Back to Home"
      onButtonClick={() => router.push(routes.instacard)}
    />
  )
}
