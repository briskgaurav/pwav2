'use client'

import React, { useRef } from 'react'

interface InputFieldProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

function formatWithCommas(value: string): string {
  // Remove all non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '')
  
  // Split by decimal point
  const parts = cleanValue.split('.')
  
  // Format the integer part with commas
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  // Join back with decimal if exists
  return parts.join('.')
}

function removeCommas(value: string): string {
  return value.replace(/,/g, '')
}

export default function InputField({ value, onChange, placeholder = 'Enter Amount' }: InputFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    // Remove commas to get the raw numeric value
    const numericValue = removeCommas(rawValue)
    
    // Only allow digits and decimal point
    if (!/^[\d.]*$/.test(numericValue)) {
      return
    }
    
    // Create a synthetic event with the formatted value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formatWithCommas(numericValue)
      }
    } as React.ChangeEvent<HTMLInputElement>
    
    onChange?.(syntheticEvent)
  }

  return (
    <div
      className='mt-4 border border-border rounded-xl px-4 py-3 cursor-text min-h-[48px] flex items-center'
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
     autoComplete="one-time-code"
        type='text'
        inputMode='decimal'
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        className='w-full text-sm focus:outline-none! focus:ring-none! focus:border-none! bg-transparent outline-none focus:outline-none focus:ring-0 border-0 p-0 min-w-0'
        aria-label={placeholder}
      />
    </div>
  )
} 
