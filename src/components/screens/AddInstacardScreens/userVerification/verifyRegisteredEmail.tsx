'use client';

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import type { UserInstaCardSteps } from '@/types/userVerificationSteps';
import { GiftsendBankOtp, GiftverifyEmailOtp, sendBankOtp, verifyEmailOtp } from '@/lib/api/cards';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import {
  selectCardRequestEmail,
  selectCardRequestId,
  selectSelectedCardType,
  setBankOtpSent,
  setEmailOtpVerified,
} from '@/store/redux/slices/cardRequestSlice';
import { MOCK_HOST_CONTEXT } from '@/lib/api/__mocks__/hostContext';

interface VerifyRegisteredEmailProps {
  onNext: (nextStep: UserInstaCardSteps) => void;
}

export default function VerifyRegisteredEmail({
  onNext,
}: VerifyRegisteredEmailProps) {
  const dispatch = useAppDispatch();
  const requestId = useAppSelector(selectCardRequestId);
  const registeredEmail = useAppSelector(selectCardRequestEmail);
     const selectedType = useAppSelector(selectSelectedCardType);  
  

  const handleVerify = async (code: string) => {

    console.log("27 , verifyRegisterdEmail.tsx , requestId : ", requestId);
    console.log("28 , verifyRegisterdEmail.tsx , registeredEmail : ", registeredEmail);

    if (!requestId || !registeredEmail) {
      throw new Error('Card request not initialised. Please restart the flow.');
    }
    console.log("requestId : ", requestId);
    console.log("registeredEmail : ", registeredEmail);

    // 1) Verify the email OTP. Backend returns 400 on invalid OTP, which
    //    fetchWithAuth surfaces as an ApiError — VerificationCodeScreen
    //    catches it and shows the message under the input.

    if(selectedType == "GIFT_CARD"){
      const verifyResponse = await GiftverifyEmailOtp({
        requestId,
        issuerBankCode: MOCK_HOST_CONTEXT.issuerBankCode,
        country: MOCK_HOST_CONTEXT.country,
        mobileAppUserId: MOCK_HOST_CONTEXT.mobileAppUserId,
        customerId: MOCK_HOST_CONTEXT.customerId,
        customerName: MOCK_HOST_CONTEXT.customerName,
        bvn: MOCK_HOST_CONTEXT.bvn,
        nin: MOCK_HOST_CONTEXT.nin,
        registeredEmail,
        otp: code,
      });

      dispatch(
        setEmailOtpVerified({
          emailOtpMatchStatus: verifyResponse.status,
        })
      );

    // Gift flow does NOT return bankOtpDestination / bankOtpChannel / otpStatus
    // so this dispatch is wrong for GiftsendBankOtp()

    const sendResponse = await GiftsendBankOtp({
      requestId,
      issuerBankCode: MOCK_HOST_CONTEXT.issuerBankCode,
      country: MOCK_HOST_CONTEXT.country,
      mobileAppUserId: MOCK_HOST_CONTEXT.mobileAppUserId,
      customerId: MOCK_HOST_CONTEXT.customerId,
      customerName: MOCK_HOST_CONTEXT.customerName,
      bvn: MOCK_HOST_CONTEXT.bvn,
      nin: MOCK_HOST_CONTEXT.nin,
    });

    // Use gift-specific state update instead of setBankOtpSent
      dispatch(setBankOtpSent({
        bankOtpDestination: sendResponse.issuerBankCode,
        bankOtpChannel: sendResponse.bankOtpChannel,
        bankOtpStatus: sendResponse.status,
      }));

    }else{
      const verifyResponse = await verifyEmailOtp({
        requestId,
        registeredEmail,
        otp: code,
      });
      dispatch(setEmailOtpVerified({
        emailOtpMatchStatus: verifyResponse.otpMatchStatus,
      }));

      // 2) Email is verified — now trigger the bank OTP. /bank-otp/send is
      //    the source of truth for bank channel info; we ignore any bank
      //    fields the verify response may include. If this call fails, the
      //    error surfaces on this screen rather than the next.
      const sendResponse = await sendBankOtp({ requestId });
      dispatch(setBankOtpSent({
        bankOtpDestination: sendResponse.bankOtpDestination,
        bankOtpChannel: sendResponse.bankOtpChannel,
        bankOtpStatus: sendResponse.otpStatus,
      }));
    }
  };

  const handleSuccess = () => {
    onNext('bank_verification');
  };

  // No backend endpoint for email-OTP resend yet — mocked.
  // TODO: wire to real endpoint once backend ships it.
  const handleResend = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  };

  return (
    <VerificationCodeScreen
      title="Verify OTP"
      subtitle="We have sent you a 6-digit code to your"
      maskedValue={registeredEmail ?? ''}
      onVerify={handleVerify}
      onResend={handleResend}
      onSuccess={handleSuccess}
    />
  );
}
