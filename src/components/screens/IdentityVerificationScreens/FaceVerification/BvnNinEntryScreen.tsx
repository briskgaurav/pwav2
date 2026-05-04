import React, { useState } from 'react'

import { PhoneIcon } from '@/constants/icons'

import ButtonComponent from '../../../ui/ButtonComponent'

type BvnNinEntryProps = {
  needsDob?: boolean
  onSubmit: (payload: { type: 'bvn' | 'nin'; value: string; dob?: string }) => void
}

export default function BvnNinEntryScreen({ onSubmit, needsDob = false }: BvnNinEntryProps) {
  const [selectedType, setSelectedType] = useState<'bvn' | 'nin'>('bvn')
  const [inputValue, setInputValue] = useState('')
  const [dob, setDob] = useState('')

  const maxLength = 11
  const isValidId = inputValue.length === maxLength && /^\d+$/.test(inputValue)
  const isValidDob = !needsDob || /^\d{4}-\d{2}-\d{2}$/.test(dob)
  const isValid = isValidId && isValidDob
  const showIdError = inputValue.length > 0 && !isValidId
  const showDobError = needsDob && dob.length > 0 && !isValidDob

  const formatDobInput = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as YYYY-MM-DD
    if (digits.length <= 4) {
      return digits
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`
    } else {
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
    }
  }

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDobInput(e.target.value)
    setDob(formatted)
  }

  return (
    <div className="h-full w-full flex flex-col px-4 pt-4 pb-[120px] items-center">
      <div className="flex flex-col items-center w-full space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <PhoneIcon />
          </div>
          <h2 className="text-xl font-semibold text-text-primary">Enter BVN or NIN</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            We couldn&apos;t find your BVN/NIN on file. Please enter it manually to continue verification.
          </p>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={() => { setSelectedType('bvn'); setInputValue('') }}
            className={`flex-1 h-12 rounded-full text-sm font-medium transition-all ${
              selectedType === 'bvn'
                ? 'bg-primary text-white'
                : 'bg-transparent border border-gray-300 text-text-secondary'
            }`}
          >
            BVN
          </button>
          <button
            onClick={() => { setSelectedType('nin'); setInputValue('') }}
            className={`flex-1 h-12 rounded-full text-sm font-medium transition-all ${
              selectedType === 'nin'
                ? 'bg-primary text-white'
                : 'bg-transparent border border-gray-300 text-text-secondary'
            }`}
          >
            NIN
          </button>
        </div>

        <div className="flex flex-col w-full space-y-2">
          <label className="text-sm font-medium text-text-primary">
            {selectedType === 'bvn' ? 'Bank Verification Number (BVN)' : 'National Identification Number (NIN)'}
          </label>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={maxLength}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
            placeholder={`Enter 11 Digit ${selectedType.toUpperCase()}`}
            className={`w-full h-12 border rounded-xl text-sm focus:outline-none focus:border-none p-4 ${
              showIdError ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {showIdError && (
            <p className="text-xs text-red-500">Enter a valid 11-digit number</p>
          )}
        </div>

        {needsDob && (
          <div className="flex flex-col w-full space-y-2">
            <label className="text-sm font-medium text-text-primary">Date of Birth</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={dob}
              onChange={handleDobChange}
              placeholder="YYYY-MM-DD"
              className={`w-full h-12 border rounded-xl text-sm focus:outline-none focus:border-none p-4 ${
                showDobError ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {showDobError && (
              <p className="text-xs text-red-500">Enter date in YYYY-MM-DD format</p>
            )}
          </div>
        )}

        <div className="w-full">
          <p className="text-xs text-text-secondary leading-relaxed">
            {selectedType === 'bvn'
              ? '(Your BVN is an 11 digit number linked to your bank account.)'
              : '(Your NIN is an 11 digit number on your National ID card or NIN slip.)'}
          </p>
        </div>
      </div>

      <div className="w-full fixed bottom-0 left-0 right-0 px-4 pb-[calc(env(safe-area-inset-bottom,24px)+16px)] pt-3 bg-white border-t border-border">
        <ButtonComponent
          title={`Verify ${selectedType.toUpperCase()}`}
          onClick={() => onSubmit({ type: selectedType, value: inputValue, dob: needsDob ? dob : undefined })}
          disabled={!isValid}
        />
      </div>
    </div>
  )
}
