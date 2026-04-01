'use client'

import LayoutSheet from '@/components/ui/LayoutSheet'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { routes } from '@/lib/routes'
import ButtonComponent from '@/components/ui/ButtonComponent'
import ConfirmYourEmailScreen from '@/components/screens/IdentityVerificationScreens/EmailRegistration/ConfirmYourEmailScreen'
import IdentityVerificationProgress from '@/components/ui/IdentityVerificationProgress'
import { useUserData } from '@/hooks/apiHooks/useUserData'
import SpinnerLoader from '@/components/ui/SpinnerLoader'
import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen'
import { sendEmailRegistrationOtp, verifyEmailRegistrationOtp } from '@/lib/api/emailRegistration'

function maskEmail(email: string) {
  const value = (email ?? '').trim().toLowerCase()
  const [local, domain] = value.split('@')
  if (!local || !domain) return ''
  return `${local[0]}***@${domain}`
}

export default function EmailRegistrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id') ?? '3'
  const { data: userData, loading, error } = useUserData(userId)
  const [step, setStep] = React.useState<'confirm' | 'otp'>('confirm')
  const [pendingEmail, setPendingEmail] = React.useState<string>('')
  const [maskedPendingEmail, setMaskedPendingEmail] = React.useState<string>('')

  const goKycStatus = () => router.push(`${routes.kycStatus}?id=${encodeURIComponent(userId)}`)

  // Render content based on current step
  const renderStepContent = () => {
    if (step === 'otp') {
      return (
        <VerificationCodeScreen
          hideLayerSheet
          title="Verify your Email"
          subtitle="We have sent you a 6-digit code to your email address"
          maskedValue={maskedPendingEmail}
          successRoute=""
          showKeypad
          showSuccessPopup
          successPopupContent={{ message: 'Email verified successfully', buttonText: 'Continue' }}
          onVerify={async (code) => {
            await verifyEmailRegistrationOtp({
              userId: Number(userId),
              newEmail: pendingEmail,
              code,
            })
          }}
          onSuccess={goKycStatus}
        />
      )
    }

    const masked = userData?.data.email ? maskEmail(userData.data.email) : ''
    return (
      <ConfirmYourEmailScreen
        currentEmailMasked={masked}
        getButtonText={getButtonText}
        onContinue={async ({ choice, newEmail }) => {
          if (choice === 'current') {
            goKycStatus()
            return
          }
          const email = (newEmail ?? '').trim().toLowerCase()
          const res = await sendEmailRegistrationOtp({
            userId: Number(userId),
            newEmail: email,
          })
          setPendingEmail(email)
          setMaskedPendingEmail(res.maskedEmail)
          setStep('otp')
        }}
      />
    )
  }

  // Get button text based on current step
  const getButtonText = () => {
    return step === 'otp' ? 'Verify' : 'Continue'
  }

  return (
    <LayoutSheet
      routeTitle='Email Registration'
      progressNode={<IdentityVerificationProgress />}
      needPadding={false}
    >
      <div className="flex flex-col h-full">
        {/* Step Content */}
        <div className="flex-1 flex items-center justify-center">
          {loading ? (
            <SpinnerLoader />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
              <p className="text-red-500 text-sm">Failed to load user</p>
              <button onClick={() => window.location.reload()} className="text-primary text-sm font-medium underline">
                Retry
              </button>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>

        {/* Continue Button */}

      </div>
    </LayoutSheet>
  )
}
