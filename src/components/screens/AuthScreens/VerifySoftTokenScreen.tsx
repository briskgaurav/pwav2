'use client'

import { useState } from 'react'

import { Button } from '@/components/ui'
import NativeOTPInput from '@/components/ui/NativeOTPInput'

const MAX_CODE_LENGTH = 6

interface VerifySoftTokenScreenProps {
  title: string
  subtitle: string
  /** Verifier — should reject (throw) on invalid token. */
  onVerify: (code: string) => Promise<void>
  /** Called after `onVerify` resolves. */
  onSuccess?: () => void
}

/**
 * Token-entry screen for bank soft tokens generated locally on the user's
 * device by the bank's authenticator app.
 *
 * Sibling of {@link VerificationCodeScreen}. Shares the visual language
 * (same `NativeOTPInput`, same fonts, same spacing) but intentionally lacks
 * the OTP-only chrome:
 *  - No destination line (there is no email/phone the code was sent to).
 *  - No resend (the authenticator app rotates the code; nothing to resend).
 *  - No "check your messages" copy (irrelevant for an authenticator).
 *  - Autofill disabled — `one-time-code` autofill targets SMS, not soft tokens.
 */
export default function VerifySoftTokenScreen({
  title,
  subtitle,
  onVerify,
  onSuccess,
}: VerifySoftTokenScreenProps) {
  const [code, setCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)

  const isCodeComplete = code.length === MAX_CODE_LENGTH

  const handleContinue = async () => {
    setIsVerifying(true)
    setErrorText(null)
    try {
      await onVerify(code)
    } catch (e) {
      setIsVerifying(false)
      setErrorText(e instanceof Error ? e.message : 'Something went wrong')
      return
    }
    setIsVerifying(false)
    onSuccess?.()
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-center px-5 py-10 text-center gap-3">
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>

        <p className="text-sm text-text-primary">{subtitle}</p>

        <div className="mt-6 mb-6 w-full">
          <NativeOTPInput
            value={code}
            maxLength={MAX_CODE_LENGTH}
            autoFocus={false}
            enableAutoFill={false}
            onChange={(v) => {
              setCode(v)
              setErrorText(null)
            }}
          />
        </div>

        <div className="relative">
          <Button
            className="bg-primary text-white rounded-full px-4 py-2 w-full h-full"
            disabled={!isCodeComplete || isVerifying}
            onClick={handleContinue}
          >
            {isVerifying ? 'Verifying...' : 'Continue'}
          </Button>
        </div>

        {errorText && (
          <p className="mt-2 text-xs text-red-500">{errorText}</p>
        )}
      </div>
    </div>
  )
}
