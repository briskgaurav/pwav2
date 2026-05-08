'use client'

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen'
import LayoutSheet from '@/components/ui/LayoutSheet'
import { routes } from '@/lib/routes'
import { useAppSelector } from '@/store/redux/hooks'
import { Layout } from 'lucide-react'

export default function VerifyEmailPage() {
  const maskedEmail = useAppSelector((s) => s.user.maskedEmail)
  return (
    <LayoutSheet routeTitle='Verify Email' needPadding={false}>

      <VerificationCodeScreen
        title="Verify your Registered Email"
        subtitle="We have sent you a 6-digit code to your Registered Email"
        maskedValue={maskedEmail}
        successRoute={routes.addUniversalPinSetup}
      />
    </LayoutSheet>
  )
}
