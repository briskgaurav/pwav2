'use client'

import LayoutSheet from '@/components/ui/LayoutSheet'
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { useUserData } from '@/hooks/apiHooks/useUserData'
import SpinnerLoader from '@/components/ui/SpinnerLoader'
import type { UserInfo } from '@/lib/api/idVerification'
import type { UserData } from '@/types/userdata'

export default function IdVerificationPage() {
  const dispatch = useDispatch()
  const currentStep = useSelector((state: RootState) => state.idVerification.currentStep)
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id') ?? '3'
  const { data: userData, loading, error } = useUserData(userId)

  const userInfo: UserInfo | null = userData
    ? {
        id: Number(userId),
        email: userData.data.email ?? '',
        phone_number: userData.data.phone_number ?? '',
      }
    : null

  const userDetails: UserData['data'] | null = userData ? userData.data : null

  const handleContinue = () => {
    switch (currentStep) {
      case 'chooseMethod':
      case 'verificationConfirm':
      case 'otpVerify':
        dispatch(nextStep())
        break
      case 'confirmBankDetails':
        router.push(`${routes.EmailRegistration}?id=${encodeURIComponent(userId)}`)
        break
      default:
        break
    }
  }

  // Render content based on current step
  const renderStepContent = () => {
    if (!userInfo || !userDetails) return null
    switch (currentStep) {
      case 'chooseMethod':
        return <VerificationMethodScreen userInfo={userInfo} getButtonText={getButtonText} handleContinue={handleContinue} />

      case 'verificationConfirm':
        return <VerificationConfirmScreen userInfo={userInfo} getButtonText={getButtonText} handleContinue={handleContinue} />

      case 'otpVerify':
        return <OTPVerificationScreen userInfo={userInfo} getButtonText={getButtonText} handleContinue={handleContinue} />

      case 'confirmBankDetails':
        return <ConfirmBankDetailsScreen userDetails={userDetails} getButtonText={getButtonText} handleContinue={handleContinue} />

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
