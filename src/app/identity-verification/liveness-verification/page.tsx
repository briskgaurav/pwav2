'use client'

import LayoutSheet from '@/components/ui/LayoutSheet'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { routes } from '@/lib/routes'
import Introduction from '@/components/screens/IdentityVerificationScreens/FaceVerification/IntroductionScreen'
import FaceScan from '@/components/screens/IdentityVerificationScreens/FaceVerification/FaceScan'
import ReviewScreen from '@/components/screens/IdentityVerificationScreens/FaceVerification/ReviewScreen'
import IndentityCompleted from '@/components/screens/IdentityVerificationScreens/FaceVerification/IndentityCompleted'
import NameMismatchScreen from '@/components/screens/IdentityVerificationScreens/FaceVerification/NameMismatchScreen'
import BvnNinEntryScreen from '@/components/screens/IdentityVerificationScreens/FaceVerification/BvnNinEntryScreen'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/redux/store'
import { nextStep, setStep, resetFlow, setHasBvnNin } from '@/store/redux/slices/livenessSlice'
import IdentityVerificationProgress from '@/components/ui/IdentityVerificationProgress'
import SpinnerLoader from '@/components/ui/SpinnerLoader'
import { useUserData } from '@/hooks/apiHooks/useUserData'
import { clearFromSession } from '@/components/Extras/utils/imageProcessing'

const SIMULATED_BANK_NAME = 'John ADE OKAFOR'
const ALLOWED_USER_IDS = ['user_both', 'user_bvn_only', 'user_nin_only', 'user_none'] as const

export default function LivenessVerificationPage() {
  const dispatch = useDispatch()
  const currentStep = useSelector((state: RootState) => state.liveness.currentStep)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [simulateMismatch, setSimulateMismatch] = useState(false)
  const routeTitle = currentStep === 'review' ? 'Review Photo' : 'Liveness Verification'

  const userId = (() => {
    const raw = searchParams.get('id')
    if (raw && (ALLOWED_USER_IDS as readonly string[]).includes(raw)) return raw
    return 'user_none'
  })()

  const { data: userData, loading, error } = useUserData(userId)

  useEffect(() => {
    if (!userData) return
    const hasBvnNin = userData.data.bvn !== null || userData.data.nin !== null
    dispatch(setHasBvnNin(hasBvnNin))
  }, [dispatch, userData])

  const ninBvnName = userData
    ? `${userData.data.first_name} ${userData.data.middle_name} ${userData.data.last_name}`
    : ''

  const checkNameMatch = (): boolean => {
    if (!simulateMismatch) return true
    return SIMULATED_BANK_NAME.toLowerCase() === ninBvnName.toLowerCase()
  }

  const handleContinue = () => {
    switch (currentStep) {
      case 'splash':
        dispatch(nextStep())
        break
      case 'bvnNinEntry':
        dispatch(nextStep())
        break
      case 'facescan': {
        const namesMatch = checkNameMatch()
        if (namesMatch) {
          dispatch(nextStep())
        } else {
          dispatch(setStep('nameMismatch'))
        }
        break
      }
      case 'review':
        dispatch(nextStep())
        break
      case 'verifydone':
        router.push(routes.IdVerification)
        break
      default:
        break
    }
  }

  const handleBvnNinSubmit = (type: 'bvn' | 'nin', value: string) => {
    console.log(`${type.toUpperCase()} submitted:`, value)
    dispatch(nextStep())
  }

  const handleGoBackToStart = () => {
    dispatch(resetFlow())
  }

  const handleRetakePhoto = () => {
    clearFromSession()
    dispatch(setStep('facescan'))
  }

  const getButtonText = () => {
    switch (currentStep) {
      case 'splash':
        return 'Start Verification'
      case 'bvnNinEntry':
        return 'Verify'
      case 'facescan':
        return 'Capture'
      case 'review':
        return 'Looks Good'
      case 'verifydone':
        return 'Continue to ID Verification'
      default:
        return 'Continue'
    }
  }

  if (loading) {
    return (
      <SpinnerLoader  />
    )
  }

  if (error || !userData) {
    return (
      <LayoutSheet needPadding={false} routeTitle='Liveness Verification' progressNode={<IdentityVerificationProgress /> as any}>
        <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
          <p className="text-red-500 text-sm">{error || 'Something went wrong'}</p>
          <button onClick={() => window.location.reload()} className="text-primary text-sm font-medium underline">
            Retry
          </button>
        </div>
      </LayoutSheet>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'splash':
        return <Introduction getButtonText={getButtonText} handleContinue={handleContinue} />
      case 'bvnNinEntry':
        return <BvnNinEntryScreen onSubmit={handleBvnNinSubmit} />
      case 'facescan':
        return <FaceScan getButtonText={getButtonText} handleContinue={handleContinue} />
      case 'review':
        return (
          <ReviewScreen
            getButtonText={getButtonText}
            handleContinue={handleContinue}
            handleRetake={handleRetakePhoto}
          />
        )
      case 'verifydone':
        return <IndentityCompleted  handleRetake={handleRetakePhoto} getButtonText={getButtonText} handleContinue={handleContinue} userData={userData} />
      case 'nameMismatch':
        return (
          <NameMismatchScreen
            bankName={SIMULATED_BANK_NAME}
            ninBvnName={ninBvnName}
            handleGoBack={handleGoBackToStart}
          />
        )
      default:
        return null
    }
  }

  return (
    <LayoutSheet
      needPadding={false}
      routeTitle={routeTitle}
      progressNode={<IdentityVerificationProgress /> as any}
    >
      <div className="flex flex-col h-full">
        {(currentStep === 'splash' || currentStep === 'facescan') && (
          <div className="flex items-center fixed bottom-0 right-[5vw] z-9999 justify-center gap-2 px-4 pb-2">
            <div
              onClick={() => setSimulateMismatch(!simulateMismatch)}
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer select-none border-2 ${simulateMismatch ? 'bg-red-500 border-primary' : 'bg-white border-text-secondary'
                }`}
            >
              <span className="text-xs font-medium">!Name</span>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-start justify-center">
          {renderStepContent()}
        </div>
      </div>
    </LayoutSheet>
  )
}
