'use client'

import React from 'react'

export type PayMode = 'instacard' | 'balance'

interface CardToggleProps {
  active?: PayMode
  onChange?: (mode: PayMode) => void
}

export default function CardToggle({ active = 'instacard', onChange }: CardToggleProps) {
  return (
    <div className="w-full flex items-center px-4 p-4 gap-[2vw] justify-between h-fit">
      <button
        type="button"
        onClick={() => onChange?.('instacard')}
        className={`w-full text-xs rounded-full p-2 py-3 font-medium text-center transition-colors ${
          active === 'instacard'
            ? 'bg-primary text-[#fff]'
            : 'border border-border text-black'
        }`}
      >
        <p>Pay Using <br />INSTACARD</p>
      </button>
      <button
        type="button"
        onClick={() => onChange?.('balance')}
        className={`w-full text-xs rounded-full p-2 py-3 font-medium text-center transition-colors ${
          active === 'balance'
            ? 'bg-primary text-[#fff]'
            : 'border border-border text-black'
        }`}
      >
        <p>Pay using <br />BALANCE Accounts</p>
      </button>
    </div>
  )
}
