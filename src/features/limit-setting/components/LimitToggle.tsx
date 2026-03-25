import React from 'react'

import type { LimitTab } from '@/store/redux/slices/limitSettingSlice'

type LimitToggleOption = {
  label: string
  value: LimitTab
}

const OPTIONS: LimitToggleOption[] = [
  { label: 'Domestic', value: 'domestic' },
  { label: 'International', value: 'international' },
]

export default function LimitToggle({
  value,
  onChange,
}: {
  value: LimitTab
  onChange: (next: LimitTab) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 w-full">
      {OPTIONS.map((option) => {
        const isActive = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={[
              'py-2 px-4 w-full border rounded-full text-center transition-colors',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
              isActive ? 'border-primary' : 'border-text-primary/20',
            ].join(' ')}
          >
            <span className="text-sm">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

