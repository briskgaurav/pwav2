'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SheetContainer, Button } from '@/components/ui'
import { routes } from '@/lib/routes'
import { useAppSelector } from '@/store/redux/hooks'

type VerificationMethod = 'email' | 'phone' | 'bvn'

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, '')
}

const MAX_PHONE_DIGITS = 13 // e.g. +234 + 10 digits
const COUNTRY_CODE_LENGTH = 3 // e.g. 234

export default function ConfirmVerificationDestinationScreen() {
  const router = useRouter()
  const email = useAppSelector((s) => s.user.email)
  const mobile = useAppSelector((s) => s.user.mobile)
  const maskedEmail = useAppSelector((s) => s.user.maskedEmail)
  const maskedMobile = useAppSelector((s) => s.user.maskedMobile)
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
    if (!method) {
      return {
        title: '',
        subtitle: '',
        maskedValue: '',
        inputLabel: '',
        inputPlaceholder: '',
      }
    }

    if (method === 'phone') {
      return {
        title: 'Verify your Phone Number',
        subtitle: 'Enter your phone number exactly as registered to receive a 6-digit code.',
        maskedValue: maskedMobile || '',
        inputLabel: 'Phone Number',
        inputPlaceholder: 'Enter your phone number',
      }
    }

    return {
      title: 'Verify your Email',
      subtitle: 'Enter your email address exactly as registered to receive a 6-digit code.',
      maskedValue: maskedEmail || '***@***.com',
      inputLabel: 'Email Address',
      inputPlaceholder: 'Enter your email address',
    }
  }, [maskedEmail, maskedMobile, method])

  const isMatch = useMemo(() => {
    if (!method) return false
    if (method === 'phone') {
      const expected = normalizePhoneDigits(mobile)
      const entered = normalizePhoneDigits(inputValue)
      return expected.length > 0 && entered === expected
    }
    const expected = normalizeEmail(email)
    const entered = normalizeEmail(inputValue)
    return expected.length > 0 && entered === expected
  }, [email, inputValue, method, mobile])

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    // Allow only digits, leading +, and spaces
    let sanitized = raw.replace(/[^\d+ ]/g, '')
    // Ensure + is only at the start
    if (sanitized.includes('+')) {
      const withoutPlus = sanitized.replace(/\+/g, '')
      sanitized = '+' + withoutPlus
    }
    
    // Get the digits only
    const digits = sanitized.replace(/\D/g, '')
    
    // Prevent deleting the country code
    if (digits.length < COUNTRY_CODE_LENGTH) {
      const mobileDigits = normalizePhoneDigits(mobile)
      const countryCode = mobileDigits.slice(0, COUNTRY_CODE_LENGTH)
      sanitized = `+${countryCode} `
    }
    
    // Limit total digits (excluding + and spaces)
    if (digits.length > MAX_PHONE_DIGITS) {
      const limitedDigits = digits.slice(0, MAX_PHONE_DIGITS)
      sanitized = `+${limitedDigits.slice(0, COUNTRY_CODE_LENGTH)} ${limitedDigits.slice(COUNTRY_CODE_LENGTH)}`
    }
    
    setInputValue(sanitized)
  }

  const handleSendCode = () => {
    setTouched(true)
    if (!isMatch) return
    router.push(routes.registrationVerificationOtp)
  }

  if (!method) return null

  return (
    <div className="h-fit flex flex-col">
      <SheetContainer>
        <div className="flex-1 flex flex-col p-6 py-10">
          <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          <p className="text-sm text-text-secondary mt-2 mb-6">{subtitle}</p>

          <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-sm font-semibold text-text-primary">{maskedValue}</p>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              {inputLabel}
            </label>
            <input
              value={inputValue}
              onChange={method === 'phone' ? handlePhoneInputChange : (e) => setInputValue(e.target.value)}
              onBlur={() => setTouched(true)}
              type={method === 'phone' ? 'tel' : 'email'}
              inputMode={method === 'phone' ? 'numeric' : 'email'}
              pattern={method === 'phone' ? '[0-9+ ]*' : undefined}
              maxLength={method === 'phone' ? MAX_PHONE_DIGITS + 2 : undefined}
              placeholder={inputPlaceholder}
              className="w-full px-4 py-3 focus:outline-none! rounded-xl bg-white border border-gray-200 text-sm text-text-primary outline-none focus:ring-0 focus:border-primary"
            />
            {touched && !isMatch && (
              <p className="text-xs text-red-500">
                Please enter the exact {method === 'phone' ? 'phone number' : 'email address'} to
                continue.
              </p>
            )}
          </div>
        </div>

        <div className="p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          <Button fullWidth onClick={handleSendCode} disabled={!isMatch}>
            Send code
          </Button>
        </div>
      </SheetContainer>
    </div>
  )
}
