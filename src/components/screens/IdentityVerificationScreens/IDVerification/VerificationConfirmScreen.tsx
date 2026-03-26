'use client'

import ButtonComponent from '@/components/ui/ButtonComponent'
import React, { useEffect, useMemo, useState } from 'react'

type VerificationMethod = 'email' | 'phone' | 'bvn'

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, '')
}

const MAX_PHONE_DIGITS = 13 // e.g. +234 + 10 digits
const COUNTRY_CODE_LENGTH = 3 // e.g. 234

// Mock data - replace with actual data source
const mockUserData = {
  email: 'john@example.com',
  mobile: '+2341234567890',
  maskedEmail: 'j***@example.com',
  maskedMobile: '+234 *** *** 7890',
}

export default function VerificationConfirmScreen({ getButtonText, handleContinue }: { getButtonText: () => string, handleContinue: () => void }) {
  const email = mockUserData.email
  const mobile = mockUserData.mobile
  const maskedEmail = mockUserData.maskedEmail
  const maskedMobile = mockUserData.maskedMobile
  const [method, setMethod] = useState<VerificationMethod | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('kyc_verification_method') as VerificationMethod | null
    setMethod(stored)
  }, [])

  useEffect(() => {
    if (method !== 'phone') return
    // Prefill country code (e.g. +234) by default
    setInputValue((prev) => {
      if (prev.trim().length > 0) return prev
      const digits = normalizePhoneDigits(mobile)
      if (digits.length >= COUNTRY_CODE_LENGTH) return `+${digits.slice(0, COUNTRY_CODE_LENGTH)} `
      return '+'
    })
  }, [method, mobile])

  const { title, subtitle, maskedValue, inputLabel, inputPlaceholder } = useMemo(() => {
    if (method === 'phone') {
      return {
        title: 'Verify your Phone Number',
        subtitle: 'Enter your phone number exactly as registered to receive a 6-digit code.',
        maskedValue: maskedMobile,
        inputLabel: 'PHONE NUMBER',
        inputPlaceholder: 'Enter your phone number',
      }
    }
    // Default to email
    return {
      title: 'Verify your Email',
      subtitle: 'Enter your email address exactly as registered to receive a 6-digit code.',
      maskedValue: maskedEmail,
      inputLabel: 'EMAIL ADDRESS',
      inputPlaceholder: 'Enter your email address',
    }
  }, [method, maskedEmail, maskedMobile])

  const isValid = useMemo(() => {
    if (method === 'phone') {
      const inputDigits = normalizePhoneDigits(inputValue)
      const storedDigits = normalizePhoneDigits(mobile)
      return inputDigits.length >= 10 && inputDigits === storedDigits
    }
    // Email validation
    return normalizeEmail(inputValue) === normalizeEmail(email)
  }, [method, inputValue, email, mobile])

  const showError = touched && !isValid && inputValue.length > 0

  return (
    <div className="h-fit flex flex-col">
      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-xl font-semibold text-text-primary">
          {title}
        </h2>
        <p className="text-sm text-text-secondary ">
          {subtitle}
        </p>

        {/* Masked value display */}
        <div className="border border-gray-200 mt-4 rounded-xl p-4 ">
          <p className="text-text-primary">{maskedValue}</p>
        </div>

        {/* Input field */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-xs ml-2 text-text-secondary font-medium">
            {inputLabel}
          </label>
          <input
            type={method === 'phone' ? 'tel' : 'email'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder={inputPlaceholder}
            className={`w-full border rounded-xl p-4 text-text-primary placeholder:text-text-secondary focus:outline-none! focus:ring-0! focus:ring-primary ${
              showError ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {showError && (
            <p className="text-xs text-red-500">
              {method === 'phone'
                ? 'Phone number does not match our records'
                : 'Email address does not match our records'}
            </p>
          )}
        </div>
      </div>

      <ButtonComponent title={getButtonText()} onClick={handleContinue} disabled={!isValid} />
    </div>
  )
}
