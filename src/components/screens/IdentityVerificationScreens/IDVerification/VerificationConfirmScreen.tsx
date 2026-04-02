'use client'

import ButtonComponent from '@/components/ui/ButtonComponent'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { sendIdVerificationOtp } from '@/lib/api/idVerification'
import type { UserInfo } from '@/lib/api/idVerification'

type VerificationMethod = 'email' | 'phone' | 'bvn'

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, '')
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

const MIN_PHONE_DIGITS = 10
const MAX_PHONE_DIGITS = 14
const COUNTRY_CODE_LENGTH = 3
const MAX_EMAIL_LENGTH = 254

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
  const mobileDigits = mobile.replace(/\D/g, '')
  const maskedMobile = mobileDigits.length >= 4
    ? `+${mobileDigits.slice(0, 3)} *** *** ${mobileDigits.slice(-4)}`
    : '***'

  const [method, setMethod] = useState<VerificationMethod | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [touched, setTouched] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('kyc_verification_method') as VerificationMethod | null
    setMethod(stored)
  }, [])

  useEffect(() => {
    if (method !== 'phone') return
    setInputValue((prev) => {
      if (prev.trim().length > 0) return prev
      const d = normalizePhoneDigits(mobile)
      if (d.length >= COUNTRY_CODE_LENGTH) return `+${d.slice(0, COUNTRY_CODE_LENGTH)} `
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
    return {
      title: 'Verify your Email',
      subtitle: 'Enter your email address exactly as registered to receive a 6-digit code.',
      maskedValue: maskedEmail,
      inputLabel: 'EMAIL ADDRESS',
      inputPlaceholder: 'Enter your email address',
    }
  }, [method, maskedEmail, maskedMobile])

  const validationError = useMemo<string | null>(() => {
    if (!touched || inputValue.trim().length === 0) return null

    if (method === 'phone') {
      const digits = normalizePhoneDigits(inputValue)
      if (digits.length < MIN_PHONE_DIGITS) return `Phone number must be at least ${MIN_PHONE_DIGITS} digits`
      if (digits.length > MAX_PHONE_DIGITS) return `Phone number must not exceed ${MAX_PHONE_DIGITS} digits`
      return null
    }

    const trimmed = inputValue.trim()
    if (trimmed.length > MAX_EMAIL_LENGTH) return `Email must not exceed ${MAX_EMAIL_LENGTH} characters`
    if (!isValidEmail(trimmed)) return 'Please enter a valid email address'
    return null
  }, [method, inputValue, touched])

  const isValid = useMemo(() => {
    if (method === 'phone') {
      const digits = normalizePhoneDigits(inputValue)
      return digits.length >= MIN_PHONE_DIGITS && digits.length <= MAX_PHONE_DIGITS
    }
    const trimmed = inputValue.trim()
    return trimmed.length > 0 && trimmed.length <= MAX_EMAIL_LENGTH && isValidEmail(trimmed)
  }, [method, inputValue])

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value
    raw = raw.replace(/[^\d+ ]/g, '')
    if (raw.includes('+')) {
      raw = '+' + raw.replace(/\+/g, '')
    }
    const digits = raw.replace(/\D/g, '')
    if (digits.length < COUNTRY_CODE_LENGTH) {
      const cc = normalizePhoneDigits(mobile).slice(0, COUNTRY_CODE_LENGTH)
      raw = `+${cc} `
    }
    if (digits.length > MAX_PHONE_DIGITS) {
      const limited = digits.slice(0, MAX_PHONE_DIGITS)
      raw = `+${limited.slice(0, COUNTRY_CODE_LENGTH)} ${limited.slice(COUNTRY_CODE_LENGTH)}`
    }
    setInputValue(raw)
  }, [mobile])

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val.length <= MAX_EMAIL_LENGTH) {
      setInputValue(val)
    }
  }, [])

  const displayError = validationError || errorText
  const showError = !!displayError

  return (
    <div className="h-fit flex flex-col">
      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-xl font-semibold text-text-primary">
          {title}
        </h2>
        <p className="text-sm text-text-secondary">
          {subtitle}
        </p>

        <div className="border border-gray-200 mt-4 rounded-xl p-4">
          <p className="text-text-primary">{maskedValue}</p>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="text-xs ml-2 text-text-secondary font-medium">
            {inputLabel}
          </label>
          <input
            type={method === 'phone' ? 'tel' : 'email'}
            inputMode={method === 'phone' ? 'tel' : 'email'}
            value={inputValue}
            onChange={method === 'phone' ? handlePhoneChange : handleEmailChange}
            onBlur={() => setTouched(true)}
            placeholder={inputPlaceholder}
            maxLength={method === 'phone' ? MAX_PHONE_DIGITS + 4 : MAX_EMAIL_LENGTH}
            className={`w-full border rounded-xl p-4 text-text-primary placeholder:text-text-secondary focus:outline-none! focus:ring-0! focus:ring-primary ${
              showError ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {showError && (
            <p className="text-xs text-red-500">{displayError}</p>
          )}
        </div>
      </div>

      <ButtonComponent
        title={sending ? 'Sending...' : getButtonText()}
        onClick={async () => {
          setTouched(true)
          if (!method || method === 'bvn' || !isValid) return
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
            setErrorText(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
          } finally {
            setSending(false)
          }
        }}
        disabled={!isValid || sending || method == null}
      />
    </div>
  )
}
