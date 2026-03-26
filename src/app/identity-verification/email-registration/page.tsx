'use client'

import LayoutSheet from '@/components/ui/LayoutSheet'
import React from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import ButtonComponent from '@/components/ui/ButtonComponent'
import ConfirmYourEmailScreen from '@/components/screens/IdentityVerificationScreens/EmailRegistration/ConfirmYourEmailScreen'
import IdentityVerificationProgress from '@/components/ui/IdentityVerificationProgress'

export default function EmailRegistrationPage() {
  const router = useRouter()

  const handleContinue = () => {
    // TODO: Navigate to next step when ready
    router.push(routes.kycStatus)
  }

  // Render content based on current step
  const renderStepContent = () => {
    return <ConfirmYourEmailScreen getButtonText={getButtonText} handleContinue={handleContinue} />
  }

  // Get button text based on current step
  const getButtonText = () => {
    return 'Continue'
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
          {renderStepContent()}
        </div>

        {/* Continue Button */}

      </div>
    </LayoutSheet>
  )
}
