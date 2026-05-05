'use client'

import BottomSheetModal from '@/components/ui/BottomSheetModal'
import { Button } from '@/components/ui'
import { useAppSelector } from '@/store/redux/hooks'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { routes } from '@/lib/routes'

type CardPinVerificationDrawerProps = {
  visible: boolean
  onClose: () => void
  title?: string
  showTitle?: boolean
  subtitle?: string
  onVerified: () => void
  fieldLength: number
  verifyPin?: (pin: string) => boolean
  onDonePressed?: () => void
}

/* ---------------- PIN INPUT ---------------- */

function NativePinInput({
  value,
  maxLength,
  onChange,
  resetKey,
  onDone,
  useDots = true,
}: {
  value: string
  maxLength: number
  onChange: (v: string) => void
  resetKey: number
  onDone?: () => void
  useDots?: boolean
}) {
  const hiddenRef = useRef<HTMLInputElement | null>(null)
  const digits = Array.from({ length: maxLength }, (_, i) => value[i] || '')

  const focus = () => hiddenRef.current?.focus()

  useEffect(() => {
    const t = window.setTimeout(focus, 150)
    return () => window.clearTimeout(t)
  }, [resetKey])

  return (
    <div className="relative w-full" onClick={focus}>
      <input
        ref={hiddenRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        pattern="\d*"
        enterKeyHint="done"
        maxLength={maxLength}
        value={value}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onDone?.()
          }
        }}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/\D/g, '').slice(0, maxLength)
          onChange(cleaned)
        }}
        className="absolute -left-[9999px] top-0 w-px h-px opacity-0"
      />

      <div className="flex w-full justify-center px-5" style={{ gap: maxLength > 6 ? 6 : 10 }}>
        {digits.map((digit, i) => {
          const isCursor = i === value.length && value.length < maxLength
          return (
            <div
              key={i}
              className={`border flex items-center justify-center text-base font-semibold shrink-0 transition-colors ${
                maxLength > 6 ? 'w-10 h-10 rounded-lg' : 'w-12 h-12 rounded-xl'
              } ${
                isCursor
                  ? 'border-primary'
                  : digit
                  ? 'border-text-primary'
                  : 'border-text-secondary'
              }`}
            >
              {digit ? (
                useDots ? (
                  <span
                    style={{
                      width: maxLength > 6 ? 8 : 12,
                      height: maxLength > 6 ? 8 : 12,
                      background: 'currentColor',
                      borderRadius: '9999px',
                    }}
                  />
                ) : (
                  digit
                )
              ) : isCursor ? (
                <span className="w-0.5 h-5 bg-primary animate-pulse rounded-full" />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function CardPinVerificationDrawer({
  showTitle = true,
  visible,
  onClose,
  fieldLength = 4,
  title = 'PIN Verification',
  subtitle = 'Enter your PIN to continue',
  onVerified,
  verifyPin,
  onDonePressed,
}: CardPinVerificationDrawerProps) {
  const globalPin = useAppSelector((s) => s.card.pin)

  const pinLength = fieldLength > 0 ? fieldLength : 4

  const verifier = useMemo(() => {
    if (pinLength === 6) {
      return verifyPin ?? ((p: string) => p === '111111')
    }
    return verifyPin ?? ((p: string) => p === globalPin)
  }, [globalPin, verifyPin, pinLength])

  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resetKey, setResetKey] = useState(0)

  // 🔥 KEYBOARD OFFSET STATE
  const [keyboardOffset, setKeyboardOffset] = useState(0)

  /* ---------------- RESET ON CLOSE ---------------- */

  useEffect(() => {
    if (!visible) {
      setPin('')
      setError(null)
      setKeyboardOffset(0)
      setResetKey((k) => k + 1)
      return
    }
    setResetKey((k) => k + 1)
  }, [visible])

  /* ---------------- KEYBOARD HANDLER ---------------- */

  useEffect(() => {
    if (!visible) return

    const vv = window.visualViewport
    if (!vv) return

    const update = () => {
      const offset = Math.max(0, window.innerHeight - vv.height)
      setKeyboardOffset(offset)
    }

    update()

    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)

    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [visible])

  /* ---------------- VERIFY ---------------- */

  const handleContinue = useCallback((): boolean => {
    const ok = verifier(pin)
    if (ok) {
      onDonePressed?.()
      onVerified()
      return true
    }

    setError('Incorrect PIN')
    setPin('')
    setResetKey((k) => k + 1)
    return false
  }, [onDonePressed, onVerified, pin, verifier])

  const isComplete = pin.length === pinLength

  /* ---------------- UI ---------------- */

  return (
    <BottomSheetModal
      showTitle={showTitle}
      backdropBlur
      visible={visible}
      onClose={onClose}
      title={title}
      maxHeight={0.92}
    >
      <div
        className="flex flex-col gap-5"
        style={{
          transform: `translateY(-${keyboardOffset}px)`,
          transition: 'transform 0.25s ease',
        }}
      >
        <p className="text-sm text-text-secondary pt-2 text-center">{subtitle}</p>

        <div className="flex flex-col items-center gap-3">
          <NativePinInput
            useDots
            resetKey={resetKey}
            value={pin}
            maxLength={pinLength}
            onChange={(v) => {
              setError(null)
              setPin(v)
            }}
            onDone={() => {
              if (!isComplete) return
              handleContinue()
            }}
          />

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
        </div>

        <div className="w-full flex flex-col items-center gap-2">
          <Button fullWidth disabled={!isComplete} onClick={handleContinue}>
            Continue
          </Button>

          <Link href={routes.forgetPin} className="text-sm text-text-secondary text-center">
            Forgot PIN?
          </Link>
        </div>
      </div>
    </BottomSheetModal>
  )
}