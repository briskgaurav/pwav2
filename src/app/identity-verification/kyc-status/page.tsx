'use client'
import ButtonComponent from "@/components/ui/ButtonComponent";
import IdentityVerificationProgress from "@/components/ui/IdentityVerificationProgress";
import LayoutSheet from "@/components/ui/LayoutSheet";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { getFromSession } from "@/components/Extras/utils/imageProcessing";
import { useEffect, useState } from "react";

export default function page() {
  const router = useRouter()
  const [faceScanImage, setFaceScanImage] = useState<string | null>(null)

  useEffect(() => {
    const image = getFromSession()
    if (image) {
      setFaceScanImage(image)
    }
  }, [])

  return (
    <LayoutSheet
      routeTitle="KYC Status"
      progressNode={<IdentityVerificationProgress />}
      needPadding={false}
    >
      <div className="p-4 space-y-8">
        <h1 className="text-center">Identity Verification Status</h1>

        <div className="flex items-center relative p-4 pt-10 border border-border rounded-xl justify-between">
          <div className="w-10 h-10 rounded-full absolute top-0 left-1/2 border border-green-500 -translate-x-1/2 -translate-y-1/2 bg-primary flex items-center justify-center overflow-hidden">
            {faceScanImage ? (
              <img src={faceScanImage} alt="Face scan" className="w-full h-full object-cover" />
            ) : null}
          </div>
          <p className="text-text-primary text-sm " >Face Capture & Liveness</p>
          <p className="text-green-500 text-sm ">Successful</p>
        </div>
        <div className="flex items-center flex-col gap-2 relative p-4 pt-10 border border-border rounded-xl justify-between">
          <div className="w-fit px-4 bg-white h-fit rounded-full absolute top-0 left-1/2 border border-text-primary py-2 -translate-x-1/2 -translate-y-1/2  flex items-center justify-center">
            <p className="text-sm text-text-primary">BVN : 1234567890</p>
          </div>
          <div className="w-full flex items-center justify-between">
            <p className="text-text-primary text-sm " >Face Verfication</p>
            <p className="text-red-500 text-sm ">Reject</p>
          </div>
          <div className="w-full flex items-center justify-between">
            <p className="text-text-primary text-sm " >Contact Verfication</p>
            <p className="text-green-500 text-sm ">Successful</p>
          </div>
          <div className="w-full flex items-center justify-between">
            <p className="text-text-primary text-sm " >BVN Verfication Status</p>
            <p className="text-green-500 text-sm ">Successful</p>
          </div>
        </div>
        <div className="flex items-center flex-col gap-2 relative p-4 pt-10 border border-border rounded-xl justify-between">
          <div className="w-fit px-4 bg-white h-fit rounded-full absolute top-0 left-1/2 border border-text-primary py-2 -translate-x-1/2 -translate-y-1/2  flex items-center justify-center">
            <p className="text-sm text-text-primary">nirdeshmalik@gmail.com</p>
          </div>
          <div className="w-full flex items-center justify-between">
            <p className="text-text-primary text-sm " >Email Registration</p>
            <p className="text-green-500 text-sm ">Successful</p>
          </div>
         
        </div>
      </div>
      <ButtonComponent title="Let's Get Started" onClick={() => {router.replace(routes.instacard)}} /> 
    </LayoutSheet>
  );
}
