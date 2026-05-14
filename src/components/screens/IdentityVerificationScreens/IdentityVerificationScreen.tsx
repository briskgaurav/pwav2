"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/redux/store'
import {
  nextStep as nextLivenessStep,
  resetFlow as resetLivenessFlow,
  setHasBvnNin,
  setNameMatched,
  setStep as setLivenessStep,
} from '@/store/redux/slices/livenessSlice'
import {
  nextStep as nextIdStep,
  resetFlow as resetIdFlow,
} from '@/store/redux/slices/idVerificationSlice'
import {
  setBankUserProfile,
  setOnboardingSession,
  updateCurrentStep,
  setLivenessVerification,
  setNameMatch,
  setFaceMatch,
  setContactDetails,
  setSelectedVerificationMethod,
  setIdentityOtp,
  setIdentityOtpVerification,
  setRegisteredEmailOtp,
  setRegisteredEmailVerification,
  setUserProfileStatus,
  setMockMode,
  addApiError,
  resetOnboarding,
} from '@/store/redux/slices/onboardingSlice'
import LayoutSheet from '@/components/ui/LayoutSheet'
import IdentityVerificationProgress from '@/components/ui/IdentityVerificationProgress'
import VerificationPageShell from '@/components/ui/VerificationPageShell'
import Introduction from './FaceVerification/IntroductionScreen'
import FaceScan from './FaceVerification/FaceScan'
import ReviewScreen from './FaceVerification/ReviewScreen'
import BvnNinEntryScreen from './FaceVerification/BvnNinEntryScreen'
import VerificationMethodScreen from './IDVerification/VerificationMethodScreen'
import VerificationConfirmScreen from './IDVerification/VerificationConfirmScreen'
import OTPVerificationScreen from './IDVerification/OTPVerificationScreen'
import ConfirmBankDetailsScreen from './IDVerification/ConfirmBankDetailsScreen'
import ConfirmYourEmailScreen from './EmailRegistration/ConfirmYourEmailScreen'
import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen'
import ButtonComponent from '@/components/ui/ButtonComponent'
import { useUserData } from '@/hooks/apiHooks/useUserData'
import { setUserBvnNinOverride } from '@/lib/api/userdata'
import { sendEmailRegistrationOtp, verifyEmailRegistrationOtp } from '@/lib/api/emailRegistration'
import { maskEmail, maskNumber, isDobMissing } from '@/lib/verification'
import { getFromSession, clearFromSession } from '@/components/Extras/utils/imageProcessing'
import { routes } from '@/lib/routes'
import type { UserInfo, UserDetails } from '@/lib/verification'

export type IdentityVerificationMode =
  | 'liveness'
  | 'idVerification'
  | 'emailRegistration'
  | 'kycStatus'

interface IdentityVerificationScreenProps {
  mode: IdentityVerificationMode
}

const DEFAULT_USER_ID = '1'

export default function IdentityVerificationScreen({ mode }: IdentityVerificationScreenProps) {
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id') ?? DEFAULT_USER_ID
  const { data: userData, loading, error } = useUserData(userId)

  const currentLivenessStep = useSelector((state: RootState) => state.liveness.currentStep)
  const nameMatched = useSelector((state: RootState) => state.liveness.nameMatched)
  const currentIdStep = useSelector((state: RootState) => state.idVerification.currentStep)

  const onboardingState = useSelector((state: RootState) => state.onboarding)
  //const { currentStep, sessionId, bankUserProfile, isMockMode } = onboardingState

  const [emailStep, setEmailStep] = useState<'confirm' | 'otp'>('confirm')
  const [pendingEmail, setPendingEmail] = useState('')
  const [maskedPendingEmail, setMaskedPendingEmail] = useState('')

  const userInfo: UserInfo | null = userData
    ? { id: Number(userId), email: userData.data.email ?? '', phone_number: userData.data.phone_number ?? '' }
    : null

  const userDetails: UserDetails | null = userData?.data ?? null

  const hasBvnNin = useMemo(
    () =>
      Boolean(
        userData?.data.bvn_details?.number != null ||
        userData?.data.nin_details?.number != null,
      ),
    [userData],
  )

  const ninBvnName =
    userData?.data.bvn_details?.name ??
    userData?.data.nin_details?.name ??
    userData?.data.name ??
    ''

  const bankFullName = userData?.data.bank_details?.user_name ?? ''
  const livenessVerified = userData?.data.LivenessVerified ?? true
  const needsDob = isDobMissing(userData?.data.date_of_birth)
  const [faceScanImage, setFaceScanImage] = useState<string | null>(null)

  const kycSummary = useMemo(() => {
    const d = userData?.data
    return {
      bvnNumber: d?.bvn_details?.number ?? null,
      ninNumber: d?.nin_details?.number ?? null,
      email: searchParams.get('email') ?? d?.email ?? null,
      dobVerified: !isDobMissing(d?.date_of_birth),
    }
  }, [searchParams, userData])

  useEffect(() => {
    if (mode === 'liveness') {
      return () => {
        dispatch(resetLivenessFlow())
      }
    }
    if (mode === 'idVerification') {
      dispatch(resetIdFlow())
      return () => {
        dispatch(resetIdFlow())
      }
    }
    return undefined
  }, [dispatch, mode])

  useEffect(() => {
    if (!userData) return
    dispatch(setHasBvnNin(hasBvnNin))
  }, [dispatch, hasBvnNin, userData])

  useEffect(() => {
    const image = getFromSession()
    if (image) setFaceScanImage(image)
  }, [])

  const checkNameMatch = () => {
    if (!bankFullName || !ninBvnName) return true
    return bankFullName.toLowerCase() === ninBvnName.toLowerCase()
  }

  const handleLivenessContinue = () => {
    switch (currentLivenessStep) {
      case 'splash':
      case 'bvnNinEntry':
        dispatch(nextLivenessStep())
        break
      case 'facescan':
        dispatch(setNameMatched(checkNameMatch()))
        dispatch(nextLivenessStep())
        break
      default:
        break
    }
  }

  const handleBvnNinSubmit = async ({ type, value, dob }: { type: 'bvn' | 'nin'; value: string; dob?: string }) => {
    await setUserBvnNinOverride({
      id: Number(userId),
      bvn: type === 'bvn' ? value : undefined,
      nin: type === 'nin' ? value : undefined,
      ...(needsDob ? { date_of_birth: dob ?? null } : {}),
    })
    dispatch(setHasBvnNin(true))
    dispatch(nextLivenessStep())
  }

  const handleReviewRetake = () => {
    clearFromSession()
    dispatch(setLivenessStep('facescan'))
  }

  const handleIdContinue = () => {
    switch (currentIdStep) {
      case 'chooseMethod':
      case 'verificationConfirm':
      case 'otpVerify':
        dispatch(nextIdStep())
        break
      case 'confirmBankDetails':
        router.push(`${routes.EmailRegistration}?id=${encodeURIComponent(userId)}`)
        break
      default:
        break
    }
  }

  const goKycStatus = (email?: string) => {
    const params = new URLSearchParams()
    params.set('id', userId)
    if (email) params.set('email', email)
    router.push(`${routes.kycStatus}?${params.toString()}`)
  }

  const handleGetStarted = async () => {
    await setUserBvnNinOverride({ id: Number(userId), kyc_completed: true })
    try {
      localStorage.setItem('active_user_id', userId)
      localStorage.setItem(`kyc_completed_${userId}`, 'true')
      localStorage.setItem('kyc_completed', 'true')
      if (userData) {
        localStorage.setItem('active_user', JSON.stringify(userData))
        localStorage.setItem(`user_${userId}`, JSON.stringify(userData))
      }
    } catch {
      // ignore localStorage issues
    }
    router.replace(routes.instacard)
  }

  const stepContent = () => {
    if (mode === 'liveness') {
      switch (currentLivenessStep) {
        case 'splash':
          return <Introduction getButtonText={() => 'Start Verification'} handleContinue={handleLivenessContinue} />
        case 'bvnNinEntry':
          return <BvnNinEntryScreen needsDob={needsDob} onSubmit={handleBvnNinSubmit} />
        case 'facescan':
          return <FaceScan getButtonText={() => 'Capture'} handleContinue={handleLivenessContinue} />
        case 'review':
          return (
            <ReviewScreen
              getButtonText={() => 'Looks Good'}
              handleContinue={() => router.push(`${routes.IdVerification}?id=${encodeURIComponent(userId)}`)}
              handleRetake={handleReviewRetake}
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

    if (mode === 'idVerification') {
      if (!userInfo || !userDetails) return null
      switch (currentIdStep) {
        case 'chooseMethod':
          return <VerificationMethodScreen userInfo={userInfo} getButtonText={() => 'Start Verification'} handleContinue={handleIdContinue} />
        case 'verificationConfirm':
          return <VerificationConfirmScreen userInfo={userInfo} getButtonText={() => 'Send Code'} handleContinue={handleIdContinue} />
        case 'otpVerify':
          return <OTPVerificationScreen userInfo={userInfo} getButtonText={() => 'Confirm'} handleContinue={handleIdContinue} />
        case 'confirmBankDetails':
          return <ConfirmBankDetailsScreen userDetails={userDetails} getButtonText={() => 'Done'} handleContinue={handleIdContinue} />
        default:
          return null
      }
    }

    if (mode === 'emailRegistration') {
      if (emailStep === 'otp') {
        return (
          <VerificationCodeScreen
            title="Verify your Email"
            subtitle="We have sent you a 6-digit code to your email address"
            maskedValue={maskedPendingEmail}
            successRoute=""
            showSuccessPopup
            successPopupContent={{ message: 'Email verified successfully', buttonText: 'Continue' }}
            onVerify={async (code) => {
              await verifyEmailRegistrationOtp({ userId: Number(userId), newEmail: pendingEmail, code })
            }}
            onSuccess={() => goKycStatus(pendingEmail)}
          />
        )
      }

      const masked = userData?.data.email ? maskEmail(userData.data.email) : ''
      return (
        <ConfirmYourEmailScreen
          currentEmailMasked={masked}
          getButtonText={() => 'Continue'}
          onContinue={async ({ choice, newEmail }) => {
            if (choice === 'current') {
              goKycStatus()
              return
            }
            const email = (newEmail ?? '').trim().toLowerCase()
            const res = await sendEmailRegistrationOtp({ userId: Number(userId), newEmail: email })
            setPendingEmail(email)
            setMaskedPendingEmail(res.maskedEmail)
            setEmailStep('otp')
          }}
        />
      )
    }

    if (mode === 'kycStatus') {
      const { bvnNumber, ninNumber, email, dobVerified } = kycSummary

      const statusText = (ok: boolean) => (
        <p className={`${ok ? 'text-green-500' : 'text-red-500'} text-sm`}>
          {ok ? 'Successful' : 'Pending'}
        </p>
      )

      return (
        <div className="p-4 space-y-8">
          <h1 className="text-center">Identity Verification Status</h1>

          <div className="flex items-center relative p-4 pt-10 border border-border rounded-xl justify-between">
            <div className="w-10 h-10 rounded-full absolute top-0 left-1/2 border border-green-500 -translate-x-1/2 -translate-y-1/2 bg-primary flex items-center justify-center overflow-hidden">
              {faceScanImage && (
                <img src={faceScanImage} alt="Face scan" className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-text-primary text-sm">Face Capture &amp; Liveness</p>
            {statusText(livenessVerified)}
          </div>

          <div className="flex items-center flex-col gap-2 relative p-4 pt-10 border border-border rounded-xl justify-between">
            <div className="w-fit px-4 bg-white h-fit rounded-full absolute top-0 left-1/2 border border-text-primary py-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <p className="text-sm text-text-primary">
                {bvnNumber
                  ? `BVN : ${maskNumber(bvnNumber)}`
                  : ninNumber
                  ? `NIN : ${maskNumber(ninNumber)}`
                  : 'BVN/NIN : Not provided'}
              </p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-text-primary text-sm">Face Verification</p>
              {statusText(true)}
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-text-primary text-sm">Contact Verification</p>
              {statusText(true)}
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-text-primary text-sm">BVN/NIN Verification</p>
              {statusText(!!(bvnNumber || ninNumber))}
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-text-primary text-sm">DOB Verified</p>
              {statusText(dobVerified)}
            </div>
          </div>

          <div className="flex items-center flex-col gap-2 relative p-4 pt-10 border border-border rounded-xl justify-between">
            <div className="w-fit px-4 bg-white h-fit rounded-full absolute top-0 left-1/2 border border-text-primary py-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <p className="text-sm text-text-primary">{email ?? 'Email not available'}</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-text-primary text-sm">Email Registration</p>
              {statusText(!!email)}
            </div>
          </div>

          <ButtonComponent title="Let's Get Started" onClick={handleGetStarted} />
        </div>
      )
    }

    return null
  }

  const routeTitle =
    mode === 'liveness'
      ? 'Liveness Verification'
      : mode === 'idVerification'
      ? 'ID Verification'
      : mode === 'emailRegistration'
      ? 'Email Registration'
      : 'KYC Status'

  return (
    <LayoutSheet routeTitle={routeTitle} progressNode={<IdentityVerificationProgress />} needPadding={false}>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <VerificationPageShell loading={loading} error={error}>
            {stepContent()}
          </VerificationPageShell>
        </div>
      </div>
    </LayoutSheet>
  )
}
