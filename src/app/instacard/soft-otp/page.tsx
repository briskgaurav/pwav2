'use client'

import Link from 'next/link'
import { useRef, useState } from 'react';
import LayoutSheet from '@/components/ui/LayoutSheet'
import Image from "next/image";
import { useInstaCard } from '@/app/context-data/contextData';
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { SheetContainer, Button } from '@/components/ui';
import OtpInput from '@/components/ui/OtpInput';
import { notifyNavigation } from '@/lib/bridge';
import { routes } from '@/lib/routes';
import type { CardType } from '@/lib/types';
import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import { useAppSelector } from '@/store/redux/hooks';

export default function SoftOtp() {

      const [code, setCode] = useState('')
      const [isVerifying, setIsVerifying] = useState(false)
      const [showSuccessPopup, setShowSuccessPopup] = useState(false)
      const [errorText, setErrorText] = useState<string | null>(null)
      const otpInputRef = useRef<HTMLDivElement>(null)
      const popupOverlayRef = useRef<HTMLDivElement>(null)
      const popupContentRef = useRef<HTMLDivElement>(null)
    
      const successRoute = '/instacard/otp2';
    //   const {
    //     type,
    //     requestId,
    //     customerId,
    //     mobileAppUserId,
    //     issuerBankCode,
    //     country,
    //     customerName,
    //     registeredEmail,
    //     bvn,
    //     nin,
    //     otpStatus,
    //   } = useInstaCard();

const [state, setState] = useState({
    type: 'debit',
    requestId: '',
    customerId: '',
    mobileAppUserId: '',
    issuerBankCode: '',
    country: '',
    customerName: '',
    registeredEmail: '',
    bvn: '',
    nin: '',
    otpStatus: '',
  });

  const {
    type,
    requestId,
    customerId,
    mobileAppUserId,
    issuerBankCode,
    country,
    customerName,
    registeredEmail,
    bvn,
    nin,
    otpStatus,
  } = state;

  const handleClickSoftToken = async () => {
    const token = "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJDVVNUMTIzIiwiaXNzIjoiYXV0aC1zZXJ2aWNlIiwiYXVkIjoidXNlci1zZXJ2aWNlIiwicm9sZSI6IlJPTEVfVVNFUiIsImVtYWlsIjoibmlwZW5kcmEua3VtYXJAZ21haWwuY29tIiwiY3VzdG9tZXJJZCI6IkNVU1QxMjMiLCJtb2JpbGVBcHBVc2VySWQiOiJNQkExMjM0NTYiLCJpc3N1ZXJCYW5rQ29kZSI6IkZDTUIiLCJpYXQiOjE3Nzc2MzgwNjIsImV4cCI6MTc3NzY1NjA2Mn0.W9iJHanEKoHrws5uej7WC9suOIv_64HL0mQ2HAJCiCTnExgMP8pqwt3C7E9fE1suFCI_2-zz9umA-SemDXj6oP2fV6K9UsXzwd1y6YWFN71SozaXYXGz05LnhBPx34oVPwpO-Tob-K88aVq9AJzVLMT6mg9D9B_bRT4GTkrFisL94G7DlP81mepP4erOPVGJS6ETlMKG_jIvbf0wR1kcQvOmY1Bx8EL77i_UJhxmvleBLCUVrTttM4cH94xE9iXVn7K2oashZmwQUX5pGR1q8cE-6hfVl5beYBOJ3abvaZg7-BERC8S2R20JYM2-lNA2eOJuQ6rFXc-Dfvcuc08n6w"

    try {
        // STEP 1 → Verify OTP
        const verifyRes = await fetch("", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            requestId: requestId,
            issuerBankCode: issuerBankCode,
            country: country,
            mobileAppUserId: mobileAppUserId,
            customerId: customerId,
            customerName: customerName,
            bvn: bvn,
            nin: nin,
            registeredEmail: "amit.sharma@example.com",
            //otp: code,
        }),
        })

        const verifyData = await verifyRes.json()

        if (!verifyRes.ok) {
        throw new Error(verifyData.message || "OTP Verification failed")
        }

        // STEP 2 → Card Request API
        // if(apiEndpoint2.length >0){
        // const requestRes = await fetch(apiEndpoint2, {
        //     method: "POST",
        //     headers: {
        //     "Content-Type": "application/json",
        //     "Authorization": `Bearer ${token}`,
        //     },
        //     body: JSON.stringify({
        //     "requestId": requestId,
        //     "issuerBankCode": issuerBankCode,
        //     "country": country,
        //     "mobileAppUserId": mobileAppUserId,
        //     customerId: customerId,
        //     customerName: customerName,
        //     bvn: bvn,
        //     nin: nin,  
        //     }),
        // })

        // const requestData = await requestRes.json()

        // if (!requestRes.ok) {
        //     throw new Error(requestData.message || "Card request failed")
        // }
        // }
        setIsVerifying(false)

        router.replace(`/instacard/otp2?type=${cardType}
            &requestId=${requestId}
            &issuerBankCode=${issuerBankCode}
            &country=${country}
            &mobileAppUserId=${mobileAppUserId}
            &customerId=${customerId}
            &customerName=${encodeURIComponent(customerName || "")}
            &bvn=${bvn}
            &nin=${nin}
            &registeredEmail= ${registeredEmail}`
        )

        // if (enableSuccessPopup) {
        // setShowSuccessPopup(true)
        // } else if (onSuccess) {
        // onSuccess()
        // } else {
        // //router.replace(successRoute)
        //             //`${successRoute}

        // router.replace(`/instacard/otp2?type=${cardType}
        //     &requestId=${requestId}
        //     &issuerBankCode=${issuerBankCode}
        //     &country=${country}
        //     &mobileAppUserId=${mobileAppUserId}
        //     &customerId=${customerId}
        //     &customerName=${encodeURIComponent(customerName || "")}
        //     &bvn=${bvn}
        //     &nin=${nin}
        //     &registeredEmail= ${registeredEmail}`
        // )

        // }

    } catch (e) {
        setIsVerifying(false)
        setErrorText(
        e instanceof Error ? e.message : "Something went wrong"
        )
    }

  };
const handleClickOTP = () => {
  const params = new URLSearchParams({
    type: cardType,
    requestId,
    issuerBankCode,
    country,
    mobileAppUserId,
    customerId,
    customerName: customerName || "",
    bvn,
    nin,
    registeredEmail,
  });

  router.replace(`${successRoute}?${params.toString()}`);
};

    //---------------------
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardType = (searchParams.get('type') as CardType) || 'debit';
  //---------------------
return (
  <LayoutSheet needPadding={false} routeTitle=''>
    <div className='flex-1 w-full flex flex-col items-center justify-center gap-4 min-h-full px-6'>

      <button
        onClick={handleClickSoftToken}
        className="w-full bg-primary text-white text-base font-medium px-8 py-4 rounded-full transition-transform active:scale-95"
      >
        Go with Soft Token
      </button>

      <button
        onClick={handleClickOTP}
        className="w-full bg-primary text-white text-base font-medium px-8 py-4 rounded-full transition-transform active:scale-95"
      >
        Go with OTP
      </button>

    </div>
  </LayoutSheet>
);

}