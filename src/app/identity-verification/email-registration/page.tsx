'use client'

import { useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen'
import ConfirmYourEmailScreen from '@/components/screens/IdentityVerificationScreens/EmailRegistration/ConfirmYourEmailScreen'
import IdentityVerificationProgress from '@/components/ui/IdentityVerificationProgress'
import LayoutSheet from '@/components/ui/LayoutSheet'
import VerificationPageShell from '@/components/ui/VerificationPageShell'
import { useUserData } from '@/hooks/apiHooks/useUserData'
import { sendEmailRegistrationOtp, verifyEmailRegistrationOtp } from '@/lib/api/emailRegistration'
import { routes } from '@/lib/routes'
import { maskEmail } from '@/lib/verification'

const DEFAULT_USER_ID = '1'

export default function EmailRegistrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id') ?? DEFAULT_USER_ID
  const { data: userData, loading, error } = useUserData(userId)

  const [step, setStep] = useState<'confirm' | 'otp'>('confirm')
  const [pendingEmail, setPendingEmail] = useState('')
  const [maskedPendingEmail, setMaskedPendingEmail] = useState('')

  const goKycStatus = (email?: string) => {
    const params = new URLSearchParams()
    params.set('id', userId)
    if (email) params.set('email', email)
    router.push(`${routes.kycStatus}?${params.toString()}`)
  }

  const renderStep = () => {
    if (step === 'otp') {
      return (
        <VerificationCodeScreen
          hideLayerSheet
          title="Verify your Email"
          subtitle="We have sent you a 6-digit code to your email address"
          maskedValue={maskedPendingEmail}
          successRoute=""
          showSuccessPopup
          successPopupContent={{ message: 'Email verified successfully', buttonText: 'Continue' }}
          onVerify={async (code) => {
            await verifyEmailRegistrationOtp({ userId: Number(userId), newEmail: pendingEmail, code })
          }}
          onSuccess={() => goKycStatus(pendingEmail)}
        />
      )
    }

    const masked = userData?.data.email ? maskEmail(userData.data.email) : ''
    return (
      <ConfirmYourEmailScreen
        currentEmailMasked={masked}
        getButtonText={() => 'Continue'}
        onContinue={async ({ choice, newEmail }) => {
          if (choice === 'current') {
            goKycStatus()
            return
          }
          const email = (newEmail ?? '').trim().toLowerCase()
          const res = await sendEmailRegistrationOtp({ userId: Number(userId), newEmail: email })
          setPendingEmail(email)
          setMaskedPendingEmail(res.maskedEmail)
          setStep('otp')
        }}
      />
    )
  }

  return (
    <LayoutSheet routeTitle="Email Registration" progressNode={<IdentityVerificationProgress />} needPadding={false}>
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <VerificationPageShell loading={loading} error={error}>
            {renderStep()}
          </VerificationPageShell>
        </div>
      </div>
    </LayoutSheet>
  )
}
