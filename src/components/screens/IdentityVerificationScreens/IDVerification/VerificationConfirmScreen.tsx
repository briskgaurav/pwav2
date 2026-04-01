'use client'

import ButtonComponent from '@/components/ui/ButtonComponent'
import React, { useEffect, useMemo, useState } from 'react'
import { sendIdVerificationOtp } from '@/lib/api/idVerification'
import type { UserInfo } from '@/lib/api/idVerification'

type VerificationMethod = 'email' | 'phone' | 'bvn'

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, '')
}

const MAX_PHONE_DIGITS = 13 // e.g. +234 + 10 digits
const COUNTRY_CODE_LENGTH = 3 // e.g. 234

export default function VerificationConfirmScreen({
  userInfo,
  getButtonText,
  handleContinue,
}: {
  userInfo: UserInfo
  getButtonText: () => string
  handleContinue: () => void
}) {
  const email = userInfo.email ?? ''
  const mobile = userInfo.phone_number ?? ''
  const maskedEmail = email ? `${email[0]}***@${email.split('@')[1] ?? ''}` : '***'
  const digits = mobile.replace(/\D/g, '')
  const maskedMobile = digits.length >= 4 ? `+${digits.slice(0, 3)} *** *** ${digits.slice(-4)}` : '***'
  const [method, setMethod] = useState<VerificationMethod | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [errorText, setErrorText] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

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

  const canSubmit = inputValue.trim().length > 0 && (method === 'phone' ? normalizePhoneDigits(inputValue).length >= 10 : true)
  const showError = !!errorText

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
            placeholder={inputPlaceholder}
            className={`w-full border rounded-xl p-4 text-text-primary placeholder:text-text-secondary focus:outline-none! focus:ring-0! focus:ring-primary ${
              showError ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {showError && (
            <p className="text-xs text-red-500">{errorText}</p>
          )}
        </div>
      </div>

      <ButtonComponent
        title={sending ? 'Sending...' : getButtonText()}
        onClick={async () => {
          if (!method || method === 'bvn') return
          try {
            setSending(true)
            setErrorText(null)
            await sendIdVerificationOtp({
              userInfo,
              method,
              destination: method === 'phone' ? normalizePhoneDigits(inputValue) : normalizeEmail(inputValue),
            })
            handleContinue()
          } catch (e) {
            setErrorText(e instanceof Error ? e.message : 'Error')
          } finally {
            setSending(false)
          }
        }}
        disabled={!canSubmit || sending || method == null}
      />
    </div>
  )
}
