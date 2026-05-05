'use client'

import React from 'react'
import { Check } from 'lucide-react'

type CustomRadioBTNProps = {
  /** Native radio group name */
  name?: string
  /** Value for native form submissions (optional) */
  value?: string
  /** Controlled checked state */
  checked: boolean
  /** Called when user selects this radio */
  onChange?: () => void
  /** Accessibility label (recommended when used without visible label) */
  ariaLabel?: string
  /** Optional extra classes for outer wrapper */
  className?: string
  /** Visual size in px (default 22) */
  sizePx?: number
  /** Visual style */
  variant?: 'dot' | 'check'
}

export default function CustomRadioBTN({
  name,
  value,
  checked,
  onChange,
  ariaLabel,
  className,
  sizePx = 22,
  variant = 'dot',
}: CustomRadioBTNProps) {
  return (
    <span className={['inline-flex items-center justify-center', className].filter(Boolean).join(' ')}>
      {name ? (
        <input
          type="radio"
          name={name}
          value={value}
          aria-label={ariaLabel}
          checked={checked}
          onChange={onChange}
          tabIndex={0}
          className="appearance-none"
          style={{ width: 0, height: 0, position: 'absolute', opacity: 0 }}
        />
      ) : null}
      <span
        className={[
          'flex aspect-square items-center justify-center rounded-full',
          variant === 'check' && checked
            ? 'bg-orange'
            : 'border border-text-primary',
        ].join(' ')}
        aria-hidden="true"
        style={{ width: sizePx, height: sizePx }}
      >
 
        {variant === 'check' && checked ? (
          <Check strokeWidth={3} color="white" size={Math.max(12, Math.round(sizePx * 0.7))} /> 
        ) : checked ? (
          <span
            className="rounded-full bg-orange"
            style={{ width: Math.max(10, Math.round(sizePx * 0.55)), height: Math.max(10, Math.round(sizePx * 0.55)) }}
          />
        ) : null}
      </span>
    </span>
  )
}

