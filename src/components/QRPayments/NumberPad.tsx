'use client'

import { Delete } from 'lucide-react'

interface NumberPadProps {
  onNumberPress: (num: string) => void
  onBackspace: () => void
}

function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(8)
  }
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'backspace'],
]

export function NumberPad({ onNumberPress, onBackspace }: NumberPadProps) {
  const handlePress = (key: string) => {
    haptic()
    if (key === 'backspace') {
      onBackspace()
    } else {
      onNumberPress(key)
    }
  }

  return (
    <div className="px-4 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]">
      <div className="grid grid-cols-3 gap-1">
        {KEYS.flat().map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handlePress(key)}
            className="h-14 flex items-center justify-center rounded-xl active:bg-light-gray transition-colors select-none"
          >
            {key === 'backspace' ? (
              <Delete className="w-6 h-6 text-text-primary" />
            ) : (
              <span className="text-2xl font-medium text-text-primary">{key}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
