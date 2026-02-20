'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface LimitSetComponentProps {
  title: string
  description: string
  icon: string
  dailyLimit: number
  maxLimit: number
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
  onLimitChange?: (limit: number) => void
  borderBottom?: boolean
}

export default function LimitSetComponent({
  title,
  description,
  icon,
  dailyLimit: initialDailyLimit,
  maxLimit,
  isEnabled: initialEnabled,
  onToggle,
  onLimitChange,
  borderBottom = true,
}: LimitSetComponentProps) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled)
  const [dailyLimit, setDailyLimit] = useState(initialDailyLimit)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCurrency = (value: number): string => {
    return value.toLocaleString()
  }

  const handleToggle = () => {
    const newValue = !isEnabled
    setIsEnabled(newValue)
    onToggle(newValue)
  }

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '')
    const numValue = parseInt(value, 10)
    
    if (value === '') {
      setDailyLimit(0)
      setError(null)
      onLimitChange?.(0)
    } else if (!isNaN(numValue) && numValue >= 0) {
      setDailyLimit(numValue)
      if (numValue > maxLimit) {
        setError(`Limit cannot exceed ${formatCurrency(maxLimit)}`)
      } else {
        setError(null)
        onLimitChange?.(numValue)
      }
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    // Reset to max limit if value exceeds it
    if (dailyLimit > maxLimit) {
      setDailyLimit(maxLimit)
      setError(null)
      onLimitChange?.(maxLimit)
    }
  }

  const handleFocus = () => {
    setIsEditing(true)
  }

  return (
    <div className={`w-full p-4 ${borderBottom ? 'border-b border-text-primary/20 pb-6' : 'border-none'}`}>
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="w-10 h-10 aspect-square border p-2.5 border-text-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Image className='h-full w-full object-contain' src={icon} alt={title} width={20} height={20} />
          </div>
          {/* Text */}
          <div className="flex flex-col min-w-0">
            <h3 className="font-medium text-sm text-text-primary">{title}</h3>
            <p className="text-xs text-text-primary leading-tight">
              {description}
            </p>
          </div>
        </div>
        {/* Toggle */}
        <button
          type="button"
          onClick={handleToggle}
          className={`w-[50px] min-w-[50px] h-6 rounded-full border border-text-primary/10 transition-colors duration-200 flex items-center flex-shrink-0 ${isEnabled ? 'bg-[#e0e4ff]' : 'bg-gray-100'
            }`}
        >
          <div
            className={`w-4 h-4 bg-black rounded-full shadow-md transform transition-transform duration-200 ${isEnabled ? 'translate-x-6.5' : 'translate-x-1'
              }`}
          />
        </button>
      </div>

      {/* Daily Limit Section */}
      <div className={`mt-4 border rounded-2xl p-4 ${error ? 'border-red-500' : 'border-text-primary/20'}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-primary/60">Daily Limit</span>
          <div className="flex items-center gap-1">
            <span className={`text-md font-medium line-through ${error ? 'text-red-500' : 'text-text-primary'}`}>N</span>
            <input
              autoComplete="one-time-code"
              type="text"
              value={isEditing ? dailyLimit.toString() : formatCurrency(dailyLimit)}
              onChange={handleLimitChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`text-md focus:outline-none! focus:ring-none! focus:border-none! font-medium bg-transparent border-none outline-none text-right w-24 focus:ring-1 focus:ring-primary/30 rounded px-1 ${error ? 'text-red-500' : 'text-text-primary'}`}
            />
          </div>
        </div>
      </div>

      {/* Maximum Limit / Error */}
      <div className="mt-2 text-right h-4">
        {error ? (
          <span className="text-xs text-red-500">{error}</span>
        ) : (
          <span className="text-xs text-text-primary/60">
            Maximum Limit: <span className="line-through">N</span> {formatCurrency(maxLimit)}
          </span>
        )}
      </div>
    </div>
  )
}
