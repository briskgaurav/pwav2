'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/redux/store'
import { nextStep, resetFlow } from '@/store/redux/slices/idVerificationSlice'
import LayoutSheet from '@/components/ui/LayoutSheet'
import IdentityVerificationProgress from '@/components/ui/IdentityVerificationProgress'
import VerificationPageShell from '@/components/ui/VerificationPageShell'
import VerificationMethodScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/VerificationMethodScreen'
import VerificationConfirmScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/VerificationConfirmScreen'
import OTPVerificationScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/OTPVerificationScreen'
import ConfirmBankDetailsScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/ConfirmBankDetailsScreen'
import { useUserData } from '@/hooks/apiHooks/useUserData'
import { routes } from '@/lib/routes'
import type { UserInfo, UserDetails } from '@/lib/verification'

const DEFAULT_USER_ID = '1'

export default function IdVerificationPage() {
  const dispatch = useDispatch()
  const currentStep = useSelector((state: RootState) => state.idVerification.currentStep)
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id') ?? DEFAULT_USER_ID
  const { data: userData, loading, error } = useUserData(userId)

  // Reset step state on enter and on leave to prevent stale screens.
  useEffect(() => {
    dispatch(resetFlow())
    return () => { dispatch(resetFlow()) }
  }, [dispatch])

  const userInfo: UserInfo | null = userData
    ? { id: Number(userId), email: userData.data.email ?? '', phone_number: userData.data.phone_number ?? '' }
    : null

  const userDetails: UserDetails | null = userData?.data ?? null

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
    }
  }

  const getButtonText = () => {
    switch (currentStep) {
      case 'chooseMethod':      return 'Start Verification'
      case 'verificationConfirm': return 'Send Code'
      case 'otpVerify':         return 'Confirm'
      case 'confirmBankDetails': return 'Done'
      default:                  return 'Continue'
    }
  }

  const renderStep = () => {
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

  return (
    <LayoutSheet routeTitle="ID Verification" progressNode={<IdentityVerificationProgress />} needPadding={false}>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <VerificationPageShell loading={loading} error={error}>
            {renderStep()}
          </VerificationPageShell>
        </div>
      </div>
    </LayoutSheet>
  )
}
