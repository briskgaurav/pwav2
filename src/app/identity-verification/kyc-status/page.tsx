'use client'

import { useEffect, useMemo, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { getFromSession } from '@/components/Extras/utils/imageProcessing'
import ButtonComponent from '@/components/ui/ButtonComponent'
import IdentityVerificationProgress from '@/components/ui/IdentityVerificationProgress'
import LayoutSheet from '@/components/ui/LayoutSheet'
import VerificationPageShell from '@/components/ui/VerificationPageShell'
import { useUserData } from '@/hooks/apiHooks/useUserData'
import { setUserBvnNinOverride } from '@/lib/api/userdata'
import { routes } from '@/lib/routes'
import { maskNumber, isDobMissing } from '@/lib/verification'
import { useAppDispatch } from '@/store/redux/hooks'
import { syncUserFromVerifiedStorage } from '@/store/redux/slices/userSlice'

const DEFAULT_USER_ID = '1'

export default function KycStatusPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id') ?? DEFAULT_USER_ID
  const emailOverride = searchParams.get('email')
  const { data: userData, loading, error } = useUserData(userId)
  const [faceScanImage, setFaceScanImage] = useState<string | null>(null)

  useEffect(() => {
    const image = getFromSession()
    if (image) setFaceScanImage(image)
  }, [])

  const { bvnNumber, ninNumber, email, livenessVerified, dobVerified } = useMemo(() => {
    const d = userData?.data
    return {
      bvnNumber: d?.bvn_details?.number ?? null,
      ninNumber: d?.nin_details?.number ?? null,
      email: emailOverride ?? d?.email ?? null,
      livenessVerified: d?.LivenessVerified ?? true,
      dobVerified: !isDobMissing(d?.date_of_birth),
    }
  }, [emailOverride, userData])

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
      // localStorage may be unavailable in some browsers
    }
    dispatch(syncUserFromVerifiedStorage())
    router.replace(routes.instacard)
  }

  const statusText = (ok: boolean) => (
    <p className={`${ok ? 'text-green-500' : 'text-red-500'} text-sm`}>
      {ok ? 'Successful' : 'Pending'}
    </p>
  )

  return (
    <LayoutSheet routeTitle="KYC Status" progressNode={<IdentityVerificationProgress />} needPadding={false}>
      <VerificationPageShell loading={loading} error={error}>
        <div className="p-4 space-y-8">
          <h1 className="text-center">Identity Verification Status</h1>

          {/* Liveness */}
          <div className="flex items-center relative p-4 pt-10 border border-border rounded-xl justify-between">
            <div className="w-10 h-10 rounded-full absolute top-0 left-1/2 border border-green-500 -translate-x-1/2 -translate-y-1/2 bg-primary flex items-center justify-center overflow-hidden">
              {faceScanImage && (
                <img src={faceScanImage} alt="Face scan" className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-text-primary text-sm">Face Capture &amp; Liveness</p>
            {statusText(livenessVerified)}
          </div>

          {/* BVN / NIN */}
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

          {/* Email */}
          <div className="flex items-center flex-col gap-2 relative p-4 pt-10 border border-border rounded-xl justify-between">
            <div className="w-fit px-4 bg-white h-fit rounded-full absolute top-0 left-1/2 border border-text-primary py-2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <p className="text-sm text-text-primary">{email ?? 'Email not available'}</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-text-primary text-sm">Email Registration</p>
              {statusText(!!email)}
            </div>
          </div>
        </div>
      </VerificationPageShell>

      <ButtonComponent title="Let's Get Started" onClick={handleGetStarted} />
    </LayoutSheet>
  )
}
