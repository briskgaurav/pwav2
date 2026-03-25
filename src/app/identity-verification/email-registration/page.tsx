'use client'

import LayoutSheet from '@/components/screens/components/LayoutSheet'
import React from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import ButtonComponent from '@/components/screens/components/ui/ButtonComponent'
import ConfirmYourEmailScreen from '@/components/screens/IdentityVerificationScreens/EmailRegistration/ConfirmYourEmailScreen'

export default function EmailRegistrationPage() {
  const router = useRouter()

  const handleContinue = () => {
    // TODO: Navigate to next step when ready
    router.push(routes.instacard)
  }

  // Render content based on current step
  const renderStepContent = () => {
    return <ConfirmYourEmailScreen />
  }

  // Get button text based on current step
  const getButtonText = () => {
    return 'Continue'
  }

  return (
    <LayoutSheet routeTitle='Email Registration'>
      <div className="flex flex-col h-full">
        {/* Step Content */}
        <div className="flex-1 flex items-center justify-center">
          {renderStepContent()}
        </div>

        {/* Continue Button */}
        <ButtonComponent title={getButtonText()} onClick={handleContinue} />

      </div>
    </LayoutSheet>
  )
}
