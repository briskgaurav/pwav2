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






























// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { useDispatch, useSelector } from 'react-redux'
// import { RootState } from '@/store/redux/store'
// import {
//   nextStep,
//   setStep,
//   resetFlow,
//   setHasBvnNin,
//   setNameMatched,
//   setSessionId,
//   setLivenessVerified,
//   setContactDetails,
//   setSelectedVerificationMethod,
//   setIdentityOtpSent,
//   setIdentityOtpVerified,
//   setRegistrationEmailOtpSent,
//   setRegistrationEmailOtpVerified,
// } from '@/store/redux/slices/livenessSlice'
// import LayoutSheet from '@/components/ui/LayoutSheet'
// import IdentityVerificationProgress from '@/components/ui/IdentityVerificationProgress'
// import VerificationPageShell from '@/components/ui/VerificationPageShell'
// import Introduction from '@/components/screens/IdentityVerificationScreens/FaceVerification/IntroductionScreen'
// import FaceScan from '@/components/screens/IdentityVerificationScreens/FaceVerification/FaceScan'
// import ReviewScreen from '@/components/screens/IdentityVerificationScreens/FaceVerification/ReviewScreen'
// import BvnNinEntryScreen from '@/components/screens/IdentityVerificationScreens/FaceVerification/BvnNinEntryScreen'
// import VerificationMethodScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/VerificationMethodScreen'
// import OTPVerificationScreen from '@/components/screens/IdentityVerificationScreens/IDVerification/OTPVerificationScreen'
// import { useUserData } from '@/hooks/apiHooks/useUserData'
// import {
//   startOnboardingSession,
//   submitLiveness,
//   submitNameMatch,
//   submitFaceMatch,
//   getContactDetails,
//   sendIdentityOtp,
//   verifyIdentityOtp,
//   sendRegistrationEmailOtp,
//   verifyRegistrationEmailOtp,
// } from '@/lib/api/idVerification'
// import { clearFromSession, getFromSession } from '@/components/Extras/utils/imageProcessing'
// import { isDobMissing } from '@/lib/verification'
// import { routes } from '@/lib/routes'

// const DEFAULT_USER_ID = '1'

// export default function LivenessVerificationPage() {
//   const dispatch = useDispatch()
//   const currentStep = useSelector((state: RootState) => state.liveness.currentStep)
//   const nameMatched = useSelector((state: RootState) => state.liveness.nameMatched)
//   const sessionId = useSelector((state: RootState) => state.liveness.sessionId)
//   const livenessVerified = useSelector((state: RootState) => state.liveness.livenessVerified)
//   const contactDetails = useSelector((state: RootState) => state.liveness.contactDetails)
//   const selectedVerificationMethod = useSelector((state: RootState) => state.liveness.selectedVerificationMethod)
//   const identityOtpVerified = useSelector((state: RootState) => state.liveness.identityOtpVerified)
//   const identityOtpSent = useSelector(
//     (state: RootState) => state.liveness.identityOtpSent
//   )

//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const userId = searchParams.get('id') ?? DEFAULT_USER_ID
//   const { data: userData, loading, error } = useUserData(userId)
//   const [sessionStarting, setSessionStarting] = useState(false)
//   const [fetchingContactDetails, setFetchingContactDetails] = useState(false)
//   const [sendingOtp, setSendingOtp] = useState(false)

//   // Reset on unmount only — avoids flashing the splash screen during navigation.
//   useEffect(() => {
//     return () => { dispatch(resetFlow()) }
//   }, [dispatch])

//   useEffect(() => {
//     if (sessionId || sessionStarting) return
//     setSessionStarting(true)
//     startOnboardingSession({ customerId: userId })
//       .then((res) => {
//         dispatch(setSessionId(res.sessionId))
//       })
//       .catch((err) => {
//         console.error('[page.tsx:45] Failed to start session:', err, 'API: startOnboardingSession', 'Request:', { customerId: userId })
//         // Use mock sessionId on error
//         dispatch(setSessionId('mock-session-id'))
//       })
//       .finally(() => {
//         setSessionStarting(false)
//       })
//   }, [dispatch, sessionId, sessionStarting, userId])

//   useEffect(() => {
//     if (!userData) return
//     const hasBvnNin =
//       userData.data.bvn_details?.number != null ||
//       userData.data.nin_details?.number != null
//     dispatch(setHasBvnNin(hasBvnNin))
//   }, [dispatch, userData])

//   // Fetch contact details when reaching contactDetails step
//   useEffect(() => {
//     if (
//       currentStep !== 'contactDetails' ||
//       !sessionId ||
//       fetchingContactDetails ||
//       contactDetails
//     ) return

//     setFetchingContactDetails(true)

//     getContactDetails(sessionId)
//       .then((res) => {
//         dispatch(setContactDetails(res))
//         dispatch(nextStep())
//       })
//       .catch((err) => {
//         console.error('[page.tsx] Failed to fetch contact details:', err)

//         // ✅ continue with mock data if API fails
//         dispatch(setContactDetails({
//           email: 'user@example.com',
//           phone: '+234XXXXXXXXXX',
//         }))

//         dispatch(nextStep())
//       })
//       .finally(() => {
//         setFetchingContactDetails(false)
//       })
//   }, [
//     currentStep,
//     sessionId,
//     contactDetails,
//     fetchingContactDetails,
//     dispatch,
//   ])

//   // useEffect(() => {
//   //   if (currentStep !== 'contactDetails' || !sessionId || contactDetails) return
//   //   setFetchingContactDetails(true)
//   //   getContactDetails(sessionId)
//   //     .then((res) => {
//   //       dispatch(setContactDetails(res))
//   //     })
//   //     .catch((err) => {
//   //       console.error('[page.tsx] Failed to fetch contact details:', err, 'API: getContactDetails', 'sessionId:', sessionId)
//   //       // Use mock data on error
//   //       dispatch(setContactDetails({ email: 'user@example.com', phone: '+234XXXXXXXXXX' }))
//   //     })
//   //     .finally(() => {
//   //       setFetchingContactDetails(false)
//   //     })
//   // }, [currentStep, sessionId, contactDetails, dispatch])

//   // Send identity OTP when verification method is selected
//   useEffect(() => {
//     if (
//       currentStep !== 'identityOtpVerify' ||
//       !sessionId ||
//       !selectedVerificationMethod ||
//       sendingOtp ||
//       identityOtpSent // ✅ prevent loop
//     ) return

//     setSendingOtp(true)

//     const contactValue =
//       selectedVerificationMethod === 'email'
//         ? contactDetails?.email ?? ''
//         : contactDetails?.phone ?? ''

//     if (!contactValue) {
//       setSendingOtp(false)
//       return
//     }

//     sendIdentityOtp(sessionId, {
//       contactType: selectedVerificationMethod,
//       contactValue,
//     })
//       .then(() => {
//         dispatch(setIdentityOtpSent(true))
//       })
//       .catch((err) => {
//         console.error(err)

//         // ✅ continue with mock success
//         dispatch(setIdentityOtpSent(true))
//       })
//       .finally(() => {
//         setSendingOtp(false)
//       })
//   }, [
//     currentStep,
//     sessionId,
//     selectedVerificationMethod,
//     contactDetails,
//     sendingOtp,
//     identityOtpSent,
//     dispatch,
//   ])

//   // useEffect(() => {
//   //   if (currentStep !== 'identityOtpVerify' || !sessionId || !selectedVerificationMethod || sendingOtp) return
//   //   setSendingOtp(true)
//   //   const contactValue = selectedVerificationMethod === 'email'
//   //     ? contactDetails?.email ?? ''
//   //     : contactDetails?.phone ?? ''
    
//   //   if (!contactValue) {
//   //     setSendingOtp(false)
//   //     console.error('[page.tsx] Contact value missing for OTP')
//   //     return
//   //   }

//   //   sendIdentityOtp(sessionId, {
//   //     contactType: selectedVerificationMethod,
//   //     contactValue,
//   //   })
//   //     .then(() => {
//   //       dispatch(setIdentityOtpSent(true))
//   //     })
//   //     .catch((err) => {
//   //       console.error('[page.tsx] Failed to send identity OTP:', err, 'API: sendIdentityOtp', 'Request:', {
//   //         contactType: selectedVerificationMethod,
//   //         contactValue,
//   //       })
//   //       // Use mock data on error
//   //       dispatch(setIdentityOtpSent(true))
//   //     })
//   //     .finally(() => {
//   //       setSendingOtp(false)
//   //     })
//   // }, [currentStep, sessionId, selectedVerificationMethod, contactDetails, sendingOtp, dispatch])

//   const ninBvnName =
//     userData?.data.bvn_details?.name ??
//     userData?.data.nin_details?.name ??
//     userData?.data.name ??
//     ''
//   const bankFullName = userData?.data.bank_details?.user_name ?? ''
//   const needsDob = isDobMissing(userData?.data.date_of_birth)

//   const checkNameMatch = (): boolean => {
//     if (!bankFullName || !ninBvnName) return true
//     return bankFullName.toLowerCase() === ninBvnName.toLowerCase()
//   }

//   const handleContinue = async () => {
//     if (!sessionId) return
//     switch (currentStep) {
//       case 'splash':
//       case 'bvnNinEntry':
//         dispatch(nextStep())
//         break
//       case 'facescan':
//         try {
//           const faceImage = getFromSession()
//           // Call liveness API
//           await submitLiveness(sessionId, { livenessData: {} }) // Placeholder
//           // Call face match API
//           if (faceImage) {
//             await submitFaceMatch(sessionId, { faceImage })
//           }
//           // Call name match
//           const nameMatchRes = await submitNameMatch(sessionId, {
//             bvn: userData?.data.bvn_details?.number,
//             nin: userData?.data.nin_details?.number,
//             name: ninBvnName,
//           })
//           dispatch(setNameMatched(nameMatchRes.matched))
//           dispatch(setLivenessVerified(true))
//         } catch (err) {
//           console.error('[page.tsx:85] API calls failed in facescan:', err, 'APIs: submitLiveness, submitFaceMatch, submitNameMatch', 'Request data:', {
//             livenessData: {},
//             faceImage: getFromSession(),
//             nameMatch: {
//               bvn: userData?.data.bvn_details?.number,
//               nin: userData?.data.nin_details?.number,
//               name: ninBvnName,
//             }
//           })
//           // Use mock data on error
//           dispatch(setNameMatched(true))
//           dispatch(setLivenessVerified(true))
//         }
//         dispatch(nextStep())
//         break
//       case 'review':
//         dispatch(nextStep())
//         break
//       case 'contactDetails':
//         dispatch(nextStep())
//         break
//       case 'identityOtpMethod':
//         dispatch(nextStep())
//         break
//       case 'identityOtpVerify':
//         // OTP verification is handled by the OTPVerificationScreen component
//         break
//       case 'registrationEmailOtpVerify':
//         // Email OTP verification is handled by its own component
//         break
//     }
//   }

//   const handleIdentityOtpVerified = async (otp: string) => {
//     if (!sessionId || !selectedVerificationMethod) return
//     try {
//       const contactValue = selectedVerificationMethod === 'email'
//         ? contactDetails?.email ?? ''
//         : contactDetails?.phone ?? ''
      
//       await verifyIdentityOtp(sessionId, {
//         contactValue,
//         otp,
//       })
//       dispatch(setIdentityOtpVerified(true))
//       dispatch(nextStep())
//     } catch (err) {
//       console.error('[page.tsx] Identity OTP verification failed:', err, 'API: verifyIdentityOtp', 'Request:', {
//         contactValue: selectedVerificationMethod === 'email' ? contactDetails?.email : contactDetails?.phone,
//         otp,
//       })
//       throw err
//     }
//   }

//   const handleRegistrationEmailOtpVerified = async (email: string, otp: string) => {
//     if (!sessionId) return
//     try {
//       await verifyRegistrationEmailOtp(sessionId, {
//         email,
//         otp,
//       })
//       dispatch(setRegistrationEmailOtpVerified(true))
//       dispatch(nextStep())
//     } catch (err) {
//       console.error('[page.tsx] Registration email OTP verification failed:', err, 'API: verifyRegistrationEmailOtp', 'Request:', {
//         email,
//         otp,
//       })
//       throw err
//     }
//   }

//   const handleBvnNinSubmit = async ({
//     type,
//     value,
//     dob,
//   }: {
//     type: 'bvn' | 'nin'
//     value: string
//     dob?: string
//   }) => {
//     if (!sessionId) return
//     try {
//       // First, perhaps update user data, but since we're using new APIs, maybe call submitNameMatch
//       await submitNameMatch(sessionId, {
//         [type]: value,
//         name: ninBvnName,
//       })
//       dispatch(setHasBvnNin(true))
//       dispatch(nextStep())
//     } catch (err) {
//       console.error('[page.tsx:105] Name match failed:', err, 'API: submitNameMatch', 'Request:', {
//         [type]: value,
//         name: ninBvnName,
//       })
//       // Use mock data on error
//       dispatch(setNameMatched(true))
//       dispatch(setHasBvnNin(true))
//       dispatch(nextStep())
//     }
//   }

//   const getButtonText = () => {
//     switch (currentStep) {
//       case 'splash':      return 'Start Verification'
//       case 'bvnNinEntry': return 'Verify'
//       case 'facescan':    return 'Capture'
//       case 'review':      return 'Looks Good'
//       case 'contactDetails': return 'Continue'
//       case 'identityOtpMethod': return 'Send OTP'
//       case 'identityOtpVerify': return 'Verify OTP'
//       case 'registrationEmailOtpVerify': return 'Verify Email'
//       case 'success': return 'Complete'
//       default:            return 'Continue'
//     }
//   }

//   const renderStep = () => {
//     switch (currentStep) {
//       case 'splash':
//         return <Introduction getButtonText={getButtonText} handleContinue={handleContinue} />
//       case 'bvnNinEntry':
//         return <BvnNinEntryScreen needsDob={needsDob} onSubmit={handleBvnNinSubmit} />
//       case 'facescan':
//         return <FaceScan getButtonText={getButtonText} handleContinue={handleContinue} />
//       case 'review':
//         return (
//           <ReviewScreen
//             getButtonText={getButtonText}
//             handleContinue={handleContinue}
//             handleRetake={() => {
//               clearFromSession()
//               dispatch(setStep('facescan'))
//             }}
//             nameMatched={nameMatched}
//             livenessVerified={livenessVerified}
//             bankName={bankFullName}
//             ninBvnName={ninBvnName}
//           />
//         )
//       case 'contactDetails':
//         // This is just a loading state while contact details are being fetched
//         return (
//           <div className="h-full flex items-center justify-center">
//             <div className="text-center">
//               <div className="flex gap-1 justify-center mb-4">
//                 <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
//                 <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
//                 <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
//               </div>
//               <p className="text-text-secondary">Fetching contact details...</p>
//             </div>
//           </div>
//         )
//       case 'identityOtpMethod':
//         return (
//           <VerificationMethodScreen
//             userInfo={{
//               id: parseInt(userId, 10),
//               email: contactDetails?.email ?? '',
//               phone_number: contactDetails?.phone ?? '',
//             }}
//             getButtonText={getButtonText}
//             handleContinue={() => {
//               dispatch(setSelectedVerificationMethod(
//                 localStorage.getItem('kyc_verification_method') as 'email' | 'phone' ?? 'email'
//               ))
//               dispatch(nextStep())
//             }}
//           />
//         )
//       case 'identityOtpVerify':
//         return (
//           <OTPVerificationScreen
//             userInfo={{
//               id: parseInt(userId, 10),
//               email: contactDetails?.email ?? '',
//               phone_number: contactDetails?.phone ?? '',
//             }}
//             getButtonText={getButtonText}
//             handleContinue={() => {
//               dispatch(setIdentityOtpVerified(true))
//               dispatch(nextStep())
//             }}
//           />
//         )
//       case 'registrationEmailOtpVerify':
//         return (
//           <div className="h-full flex items-center justify-center">
//             <div className="text-center">
//               <p className="text-text-primary font-semibold mb-2">Verify Registration Email</p>
//               <p className="text-text-secondary text-sm">An OTP has been sent to {contactDetails?.email}</p>
//             </div>
//           </div>
//         )
//       case 'success':
//         return (
//           <div className="h-full flex flex-col items-center justify-center px-4">
//             <div className="text-center space-y-6">
//               <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
//                 <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-text-primary mb-2">Verification Complete</h2>
//                 <p className="text-text-secondary">Your identity has been successfully verified.</p>
//               </div>
//               <button
//                 onClick={() => router.push(`${routes.IdVerification}?id=${encodeURIComponent(userId)}`)}
//                 className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-medium"
//               >
//                 Continue to Dashboard
//               </button>
//             </div>
//           </div>
//         )
//       default:
//         return null
//     }
//   }

//   return (
//     <LayoutSheet
//       needPadding={false}
//       routeTitle="Liveness Verification"
//       progressNode={<IdentityVerificationProgress /> as any}
//     >
//       <div className="flex flex-col h-full">
//         <div className="flex-1 flex items-start justify-center">
//           <VerificationPageShell
//             loading={
//               loading || sessionStarting || fetchingContactDetails || sendingOtp
//             }
//             error={
//               error ?? ((!loading && !userData) ? 'Something went wrong' : null)
//             }
//           >
//             {renderStep()}
//           </VerificationPageShell>
//         </div>
//       </div>
//     </LayoutSheet>
//   )
// }
