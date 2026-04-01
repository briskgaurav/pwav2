'use client'

import React from 'react'
import VerificationCodeScreen from '../../AuthScreens/VerificationCodeScreen'
import { verifyIdVerificationOtp, type IdVerificationMethod } from '@/lib/api/idVerification'
import { useEffect, useMemo, useState } from 'react'
import type { UserInfo } from '@/lib/api/idVerification'

export default function OTPVerificationScreen({
  userInfo,
  getButtonText,
  handleContinue,
}: {
  userInfo: UserInfo
  getButtonText: () => string,
  handleContinue: () => void,
}) {
  const [method, setMethod] = useState<IdVerificationMethod>('email')

  useEffect(() => {
    const stored = localStorage.getItem('kyc_verification_method') as IdVerificationMethod | null
    if (stored === 'email' || stored === 'phone') setMethod(stored)
  }, [])

  const maskedValue = useMemo(() => {
    const email = userInfo.email ?? ''
    const phone = userInfo.phone_number ?? ''
    if (method === 'phone') {
      const digits = phone.replace(/\D/g, '')
      if (digits.length < 4) return ''
      return `+${digits.slice(0, 3)} *** *** ${digits.slice(-4)}`
    }
    if (!email) return ''
    const domain = email.split('@')[1] ?? ''
    return `${email[0]}***@${domain}`
  }, [method, userInfo])

  return (
   <VerificationCodeScreen
    hideLayerSheet={true}
    title={method === 'phone' ? 'Verify your Phone Number' : 'Verify your Email'}
    subtitle={method === 'phone'
      ? 'We have sent you a 6-digit code to your Registered Phone Number'
      : 'We have sent you a 6-digit code to your Registered Email'}
    maskedValue={maskedValue}
    successRoute={''}
    showSuccessPopup
    successPopupContent={{
      message: 'Identity Verified successfully',
      buttonText: 'Continue',
    }}
    onVerify={async (code) => {
      await verifyIdVerificationOtp({ userInfo: { id: userInfo.id }, method, code })
    }}
    onSuccess={handleContinue}
    showKeypad
  />
  ) 
}
