'use client'

import LayoutSheet from '@/components/ui/LayoutSheet'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { routes } from '@/lib/routes'
import Introduction from '@/components/screens/IdentityVerificationScreens/FaceVerification/IntroductionScreen'
import FaceScan from '@/components/screens/IdentityVerificationScreens/FaceVerification/FaceScan'
import ReviewScreen from '@/components/screens/IdentityVerificationScreens/FaceVerification/ReviewScreen'
import BvnNinEntryScreen from '@/components/screens/IdentityVerificationScreens/FaceVerification/BvnNinEntryScreen'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/redux/store'
import { nextStep, setStep, resetFlow, setHasBvnNin, setNameMatched } from '@/store/redux/slices/livenessSlice'
import IdentityVerificationProgress from '@/components/ui/IdentityVerificationProgress'
import SpinnerLoader from '@/components/ui/SpinnerLoader'
import { useUserData } from '@/hooks/apiHooks/useUserData'
import { clearFromSession } from '@/components/Extras/utils/imageProcessing'
import { setUserBvnNinOverride } from '@/lib/api/userdata'

const DEFAULT_USER_ID = '1'

export default function LivenessVerificationPage() {
  const dispatch = useDispatch()
  const currentStep = useSelector((state: RootState) => state.liveness.currentStep)
  const nameMatched = useSelector((state: RootState) => state.liveness.nameMatched)
  const router = useRouter()
  const searchParams = useSearchParams()
  const routeTitle = 'Liveness Verification'

  // Source of truth: URL `?id=`. Only defaults when param is missing.
  const userId = searchParams.get('id') ?? DEFAULT_USER_ID

  const { data: userData, loading, error } = useUserData(userId)

  // Avoid flashing back to the splash screen during navigation.
  // Reset when leaving this route (unmount), not immediately on click.
  useEffect(() => {
    return () => {
      dispatch(resetFlow())
    }
  }, [dispatch])

  useEffect(() => {
    if (!userData) return
    const hasBvnNin = userData.data.bvn_details?.number != null || userData.data.nin_details?.number != null
    dispatch(setHasBvnNin(hasBvnNin))
  }, [dispatch, userData])

  const ninBvnName = userData?.data.bvn_details?.name ?? userData?.data.nin_details?.name ?? userData?.data.name ?? ''
  const bankFullName = userData?.data.bank_details?.user_name ?? ''
  const livenessVerified = userData?.data.LivenessVerified ?? true
  const dobRaw = userData?.data.date_of_birth
  const needsDob =
    dobRaw == null ||
    dobRaw === '' ||
    dobRaw === '00/00/0000' ||
    dobRaw === '0000-00-00'

  const checkNameMatch = (): boolean => {
    if (!bankFullName || !ninBvnName) return true
    return bankFullName.toLowerCase() === ninBvnName.toLowerCase()
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
        dispatch(setNameMatched(namesMatch))
        dispatch(nextStep())
        break
      }
      default:
        break
    }
  }

  const handleBvnNinSubmit = async ({
    type,
    value,
    dob,
  }: {
    type: 'bvn' | 'nin'
    value: string
    dob?: string
  }) => {
    await setUserBvnNinOverride({
      id: Number(userId),
      bvn: type === 'bvn' ? value : undefined,
      nin: type === 'nin' ? value : undefined,
      ...(needsDob ? { date_of_birth: dob ?? null } : {}),
    })
    dispatch(setHasBvnNin(true))
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
      <LayoutSheet needPadding={false} routeTitle={routeTitle} progressNode={<IdentityVerificationProgress /> as any}>
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
        return <BvnNinEntryScreen needsDob={needsDob} onSubmit={handleBvnNinSubmit} />
      case 'facescan':
        return <FaceScan getButtonText={getButtonText} handleContinue={handleContinue} />
      case 'review':
        return (
          <ReviewScreen
            getButtonText={getButtonText}
            handleContinue={() => {
              router.push(`${routes.IdVerification}?id=${encodeURIComponent(userId)}`)
            }}
            handleRetake={handleRetakePhoto}
            nameMatched={nameMatched}
            livenessVerified={livenessVerified}
            bankName={bankFullName}
            ninBvnName={ninBvnName}
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
        <div className="flex-1 flex items-start justify-center">
          {renderStepContent()}
        </div>
      </div>
    </LayoutSheet>
  )
}
