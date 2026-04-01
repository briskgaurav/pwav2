'use client'
import ButtonComponent from "@/components/ui/ButtonComponent";
import IdentityVerificationProgress from "@/components/ui/IdentityVerificationProgress";
import LayoutSheet from "@/components/ui/LayoutSheet";
import { routes } from "@/lib/routes";
import { useRouter, useSearchParams } from 'next/navigation'
import { getFromSession } from "@/components/Extras/utils/imageProcessing";
import { useEffect, useMemo, useState } from "react";
import { useUserData } from "@/hooks/apiHooks/useUserData";
import SpinnerLoader from "@/components/ui/SpinnerLoader";
import { setUserBvnNinOverride } from "@/lib/api/userdata";

export default function page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('id') ?? '1'
  const { data: userData, loading, error } = useUserData(userId)
  const [faceScanImage, setFaceScanImage] = useState<string | null>(null)

  useEffect(() => {
    const image = getFromSession()
    if (image) {
      setFaceScanImage(image)
    }
  }, [])

  const { bvnNumber, ninNumber, email, livenessVerified, dobVerified } = useMemo(() => {
    const data = userData?.data
    const bvnNumber = data?.bvn_details?.number ?? null
    const ninNumber = data?.nin_details?.number ?? null
    const email = data?.email ?? null
    const livenessVerified = data?.LivenessVerified ?? true
    const dob = data?.date_of_birth ?? null
    const dobVerified =
      dob != null &&
      dob !== '' &&
      dob !== '00/00/0000' &&
      dob !== '0000-00-00'
    return { bvnNumber, ninNumber, email, livenessVerified, dobVerified }
  }, [userData])

  const maskNumber = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 4) return '****'
    return `****${digits.slice(-4)}`
  }

  return (
    <LayoutSheet
      routeTitle="KYC Status"
      progressNode={<IdentityVerificationProgress />}
      needPadding={false}
    >
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
        <div className="p-4 space-y-8">
          <h1 className="text-center">Identity Verification Status</h1>

          <div className="flex items-center relative p-4 pt-10 border border-border rounded-xl justify-between">
            <div className="w-10 h-10 rounded-full absolute top-0 left-1/2 border border-green-500 -translate-x-1/2 -translate-y-1/2 bg-primary flex items-center justify-center overflow-hidden">
              {faceScanImage ? (
                <img src={faceScanImage} alt="Face scan" className="w-full h-full object-cover" />
              ) : null}
            </div>
            <p className="text-text-primary text-sm " >Face Capture & Liveness</p>
            <p className={`${livenessVerified ? 'text-green-500' : 'text-red-500'} text-sm `}>
              {livenessVerified ? 'Successful' : 'Failed'}
            </p>
          </div>
          <div className="flex items-center flex-col gap-2 relative p-4 pt-10 border border-border rounded-xl justify-between">
            <div className="w-fit px-4 bg-white h-fit rounded-full absolute top-0 left-1/2 border border-text-primary py-2 -translate-x-1/2 -translate-y-1/2  flex items-center justify-center">
              <p className="text-sm text-text-primary">
                {bvnNumber ? `BVN : ${bvnNumber}` : ninNumber ? `NIN : ${ninNumber}` : 'BVN/NIN : Not provided'}
              </p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-text-primary text-sm " >Face Verfication</p>
              <p className="text-green-500 text-sm ">Successful</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-text-primary text-sm " >Contact Verfication</p>
              <p className="text-green-500 text-sm ">Successful</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-text-primary text-sm " >BVN/NIN Verification Status</p>
              <p className={`${bvnNumber || ninNumber ? 'text-green-500' : 'text-red-500'} text-sm `}>
                {bvnNumber || ninNumber ? 'Successful' : 'Pending'}
              </p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-text-primary text-sm " >DOB Verified</p>
              <p className={`${dobVerified ? 'text-green-500' : 'text-red-500'} text-sm `}>
                {dobVerified ? 'Successful' : 'Pending'}
              </p>
            </div>
          </div>
          <div className="flex items-center flex-col gap-2 relative p-4 pt-10 border border-border rounded-xl justify-between">
            <div className="w-fit px-4 bg-white h-fit rounded-full absolute top-0 left-1/2 border border-text-primary py-2 -translate-x-1/2 -translate-y-1/2  flex items-center justify-center">
              <p className="text-sm text-text-primary">{email ?? 'Email not available'}</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <p className="text-text-primary text-sm " >Email Registration</p>
              <p className="text-green-500 text-sm ">Successful</p>
            </div>

          </div>
        </div>
      )}
      <ButtonComponent
        title="Let's Get Started"
        onClick={async () => {
          await setUserBvnNinOverride({ id: Number(userId), kyc_completed: true })
          try {
            localStorage.setItem('active_user_id', userId)
            localStorage.setItem(`kyc_completed_${userId}`, 'true')
            localStorage.setItem('kyc_completed', 'true')
            if (userData) {
              // Persist full user payload for reuse across the app
              localStorage.setItem('active_user', JSON.stringify(userData))
              localStorage.setItem(`user_${userId}`, JSON.stringify(userData))
            }
          } catch {
            // ignore
          }
          router.replace(routes.instacard)
        }}
      />
    </LayoutSheet>
  );
}
