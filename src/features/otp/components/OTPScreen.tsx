'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SheetContainer, Button } from '@/components/ui';
import OtpInput from '@/components/ui/OtpInput';
import { notifyNavigation } from '@/lib/bridge';
import { routes } from '@/lib/routes';
import type { CardType } from '@/lib/types';
import VerificationCodeScreen from '@/features/verification/components/VerificationCodeScreen';

const MAX_CODE_LENGTH = 6;

// function OTPScreenContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const cardType = (searchParams.get('type') as CardType) || 'debit';
//   const [code, setCode] = useState('');
//   const [isVerifying, setIsVerifying] = useState(false);

//   useEffect(() => {
//     notifyNavigation('otp-verification');
//   }, []);

  

//   const handleResend = () => {
//     setCode('');
//     // TODO: Implement resend OTP API call
//   };

//   const isCodeComplete = code.length === MAX_CODE_LENGTH;

//   return (
//     <div className="h-screen flex flex-col">
//       {/* <Header title="Verify Phone" showBackButton onBack={handleBack} /> */}

//       <SheetContainer>
//         <div className="flex-1 flex justify-between flex-col">
//           <div className="p-6 py-14 px-5  text-center flex flex-col items-center justify-center gap-2">
//             <h2 className="text-xl font-semibold text-text-primary m-0">
//               Verify your Phone Number
//             </h2>
//             <p className="text-[13px] text-text-primary m-0">
//               We have sent you a 6-digit code to your number
//             </p>
//             <p className="text-md leading-none font-semibold text-text-primary m-0">
//               XXXXXX0955
//             </p>
//             <p className="text-[13px] text-text-primary m-0">
//               Please check your messages and enter it here
//             </p>

//             <OtpInput
//               length={6}
//               onChange={setCode}
//               onComplete={setCode}
//               autoFocus
//               boxSize='55px'
//             />


//           </div>

//           <div className='p-6 pb-10 text-center'>

//             <Button
//               className="mt-8"
//               fullWidth
//               onClick={handleContinue}
//               disabled={!isCodeComplete || isVerifying}
//             >
//               {isVerifying ? 'Verifying...' : 'Continue'}
//             </Button>

//             <p className="my-3 text-sm ">
//               Didn&apos;t receive the Code?{' '}
//               <button
//                 onClick={handleResend}
//                 className="bg-transparent border-none text-primary font-semibold cursor-pointer p-0 text-sm"
//                 type="button"
//               >
//                 Resend
//               </button>
//             </p>

//           </div>

//         </div>
//       </SheetContainer>
//     </div>
//   );
// }

export default function OTPScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardType = (searchParams.get('type') as CardType) || 'debit';
  const handleContinue = async () => {
    if (cardType === 'gift') {
      router.push(routes.giftACard);
    } else {
      router.push(routes.linkedSuccess);
    }
  };
  return (
    <VerificationCodeScreen
    title="Verify your Phone Number"
    subtitle="We have sent you a 6-digit code to your Registered Phone Number"
    maskedValue="+234802**** 0955"
    successRoute={cardType === 'gift' ? routes.giftACard : routes.linkedSuccess}
    showKeypad
  />
   
  );
}