'use client'

import LayoutSheet from '@/components/ui/LayoutSheet'
import React from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { useDispatch, useSelector } from 'react-redux'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { RootState } from '@/store/redux/store'
import { nextStep } from '@/store/redux/slices/idVerificationSlice'
import VerificationConfirmScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/VerificationConfirmScreen'
import OTPVerificationScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/OTPVerificationScreen'
import ConfirmBankDetailsScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/ConfirmBankDetailsScreen'
import IdentityVerificationProgress from '@/components/ui/IdentityVerificationProgress'
import VerificationMethodScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/VerificationMethodScreen'

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
        return <VerificationMethodScreen getButtonText={getButtonText} handleContinue={handleContinue} />

      case 'verificationConfirm':
        return <VerificationConfirmScreen getButtonText={getButtonText} handleContinue={handleContinue} />

      case 'otpVerify':
        return <OTPVerificationScreen getButtonText={getButtonText} handleContinue={handleContinue} />

      case 'confirmBankDetails':
        return <ConfirmBankDetailsScreen getButtonText={getButtonText} handleContinue={handleContinue} />

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
        return 'Send Code'
      case 'otpVerify':
        return 'Confirm'
      case 'confirmBankDetails':
        return 'Done'
      default:
        return 'Continue'
    }
  }

  return (
    <LayoutSheet
      routeTitle='ID Verification'
      progressNode={<IdentityVerificationProgress />}
      needPadding={false}
    >
      <div className="flex flex-col h-full">
        {/* Step Content */}
        <div className="flex-1">
          {renderStepContent()}
        </div>

        {/* Continue Button */}

      </div>
    </LayoutSheet>
  )
}
