'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/redux/store'
import { nextStep, setStep, resetFlow, setHasBvnNin, setNameMatched } from '@/store/redux/slices/livenessSlice'
import LayoutSheet from '@/components/ui/LayoutSheet'
import IdentityVerificationProgress from '@/components/ui/IdentityVerificationProgress'
import VerificationPageShell from '@/components/ui/VerificationPageShell'
import Introduction from '@/components/screens/IdentityVerificationScreens/FaceVerification/IntroductionScreen'
import FaceScan from '@/components/screens/IdentityVerificationScreens/FaceVerification/FaceScan'
import ReviewScreen from '@/components/screens/IdentityVerificationScreens/FaceVerification/ReviewScreen'
import BvnNinEntryScreen from '@/components/screens/IdentityVerificationScreens/FaceVerification/BvnNinEntryScreen'
import { useUserData } from '@/hooks/apiHooks/useUserData'
import { setUserBvnNinOverride } from '@/lib/api/userdata'
import { clearFromSession } from '@/components/Extras/utils/imageProcessing'
import { isDobMissing } from '@/lib/verification'
import { routes } from '@/lib/routes'

const DEFAULT_USER_ID = '1'

export default function LivenessVerificationPage() {
  const dispatch = useDispatch()
  const currentStep = useSelector((state: RootState) => state.liveness.currentStep)
  const nameMatched = useSelector((state: RootState) => state.liveness.nameMatched)
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id') ?? DEFAULT_USER_ID
  const { data: userData, loading, error } = useUserData(userId)

  // Reset on unmount only — avoids flashing the splash screen during navigation.
  useEffect(() => {
    return () => { dispatch(resetFlow()) }
  }, [dispatch])

  useEffect(() => {
    if (!userData) return
    const hasBvnNin =
      userData.data.bvn_details?.number != null ||
      userData.data.nin_details?.number != null
    dispatch(setHasBvnNin(hasBvnNin))
  }, [dispatch, userData])

  const ninBvnName =
    userData?.data.bvn_details?.name ??
    userData?.data.nin_details?.name ??
    userData?.data.name ??
    ''
  const bankFullName = userData?.data.bank_details?.user_name ?? ''
  const livenessVerified = userData?.data.LivenessVerified ?? true
  const needsDob = isDobMissing(userData?.data.date_of_birth)

  const checkNameMatch = (): boolean => {
    if (!bankFullName || !ninBvnName) return true
    return bankFullName.toLowerCase() === ninBvnName.toLowerCase()
  }

  const handleContinue = () => {
    switch (currentStep) {
      case 'splash':
      case 'bvnNinEntry':
        dispatch(nextStep())
        break
      case 'facescan':
        dispatch(setNameMatched(checkNameMatch()))
        dispatch(nextStep())
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

  const getButtonText = () => {
    switch (currentStep) {
      case 'splash':      return 'Start Verification'
      case 'bvnNinEntry': return 'Verify'
      case 'facescan':    return 'Capture'
      case 'review':      return 'Looks Good'
      default:            return 'Continue'
    }
  }

  const renderStep = () => {
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
            handleContinue={() =>
              router.push(`${routes.IdVerification}?id=${encodeURIComponent(userId)}`)
            }
            handleRetake={() => {
              clearFromSession()
              dispatch(setStep('facescan'))
            }}
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
      routeTitle="Liveness Verification"
      progressNode={<IdentityVerificationProgress /> as any}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-start justify-center">
          <VerificationPageShell loading={loading} error={error ?? ((!loading && !userData) ? 'Something went wrong' : null)}>
            {renderStep()}
          </VerificationPageShell>
        </div>
      </div>
    </LayoutSheet>
  )
}
