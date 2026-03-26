
import React from 'react'
import VerificationCodeScreen from '../../AuthScreens/VerificationCodeScreen'
import { routes } from '@/lib/routes'

export default function OTPVerificationScreen({
  getButtonText,
  handleContinue,
}: {
  getButtonText: () => string,
  handleContinue: () => void,
}) {
  return (
   <VerificationCodeScreen
    hideLayerSheet={true}
    title="Verify your Phone Number"
    subtitle="We have sent you a 6-digit code to your Registered Phone Number"
    maskedValue="+234802**** 0955"
    successRoute={''}
    onSuccess={handleContinue}
    showKeypad
  />
  ) 
}
