import React, { useState } from 'react'
import ButtonComponent from '../../../ui/ButtonComponent'
import { PhoneIcon } from '@/constants/icons'

type BvnNinEntryProps = {
  onSubmit: (type: 'bvn' | 'nin', value: string) => void
}

export default function BvnNinEntryScreen({ onSubmit }: BvnNinEntryProps) {
  const [selectedType, setSelectedType] = useState<'bvn' | 'nin'>('bvn')
  const [inputValue, setInputValue] = useState('')

  const maxLength = 11
  const isValid = inputValue.length === maxLength && /^\d+$/.test(inputValue)

  return (
    <div className="h-full w-full flex flex-col p-4 items-center">
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
            className="w-full h-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-none! p-4"
          />
        </div>

        <div className="w-full">
          <p className="text-xs text-text-secondary leading-relaxed">
            {selectedType === 'bvn'
              ? '(Your BVN is an 11 digit number linked to your bank account.)'
              : '(Your NIN is an 11 digit number on your National ID card or NIN slip.)'}
          </p>
        </div>
      </div>

      <div className="w-full fixed bottom-0 left-0 right-0">
        <ButtonComponent
          title={`Verify ${selectedType.toUpperCase()}`}
          onClick={() => onSubmit(selectedType, inputValue)}
          disabled={!isValid}
        />
      </div>
    </div>
  )
}
