'use client'
import React, { useEffect, useRef, useState } from 'react'

type OtpInputProps = {
  length: 4 | 8 | 6,
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  autoFocus?: boolean
  boxSize?: string
}

const OtpInput: React.FC<OtpInputProps> = ({
  length,
  onChange,
  onComplete,
  autoFocus = true,
  boxSize = '35px',
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus()
    }
  }, [autoFocus])

  const updateOtp = (newOtp: string[]) => {
    setOtp(newOtp)
    const value = newOtp.join('')
    onChange?.(value)
    if (newOtp.every((digit) => digit !== '')) {
      onComplete?.(value)
    }
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    updateOtp(newOtp)

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    updateOtp(newOtp)
    const nextIndex = Math.min(pastedData.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  const renderInputs = (start: number, end: number, showAutoFocus: boolean) => {
    return (
      <div className='flex items-center gap-2'>
        {Array.from({ length: end - start }, (_, i) => {
          const index = start + i
          return (
            <input
              autoComplete="one-time-code"
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type='text'
              inputMode='numeric'
              maxLength={1}
              value={otp[index] ?? ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              autoFocus={showAutoFocus && index === 0 && autoFocus}
              style={{ width: boxSize, height: boxSize }}
              className='rounded-lg border border-text-primary text-center text-md leading-none font-semibold text-text-primary bg-white focus:outline-none! focus:ring-0! focus:ring-primary'
            />
          )
        })}
      </div>
    )
  }

  const isEightDigit = length === 8

  return (
    <div className='flex flex-col items-center mt-8 space-y-0' onPaste={handlePaste}>
      <div className='flex items-center justify-center gap-4'>
        {isEightDigit ? (
          <>
            {renderInputs(0, 4, true)}
            {renderInputs(4, 8, false)}
          </>
        ) : (
          renderInputs(0, length, true)
        )}
      </div>
    </div>
  )
}

export default OtpInput

