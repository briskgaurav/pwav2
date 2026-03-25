'use client'

import LayoutSheet from '@/components/ui/LayoutSheet'
import React from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { RootState } from '@/store/redux/store'
import { nextStep } from '@/store/redux/slices/idVerificationSlice'
import VerificationMethod from '@/components/screens/IdentityVerificationScreens/IDVerification/VerificationMethod'
import VerificationConfirmScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/VerificationConfirmScreen'
import OTPVerificationScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/OTPVerificationScreen'
import ConfirmBankDetailsScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/ConfirmBankDetailsScreen'

export default function IdVerificationPage() {
  const dispatch = useDispatch()
  const currentStep = useSelector((state: RootState) => state.idVerification.currentStep)
  const router = useRouter()

  const handleContinue = () => {
    switch (currentStep) {
      case 'chooseMethod':
      case 'verificationConfirm':
      case 'otpVerify':
        dispatch(nextStep())
        break
      case 'confirmBankDetails':
        router.push(routes.EmailRegistration)
        break
      default:
        break
    }
  }

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'chooseMethod':
        return <VerificationMethod />

      case 'verificationConfirm':
        return <VerificationConfirmScreen />

      case 'otpVerify':
        return <OTPVerificationScreen />

      case 'confirmBankDetails':
        return <ConfirmBankDetailsScreen />

      default:
        return null
    }
  }

  // Get button text based on current step
  const getButtonText = () => {
    switch (currentStep) {
      case 'chooseMethod':
        return 'Start Verification'
      case 'verificationConfirm':
        return 'Verify'
      case 'otpVerify':
        return 'Confirm'
      case 'confirmBankDetails':
        return 'Done'
      default:
        return 'Continue'
    }
  }

  return (
    <LayoutSheet routeTitle='ID Verification'>
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
