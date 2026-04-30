'use client'

import React from 'react'
import { haptic } from '@/lib/useHaptics'

export type ButtonVariant = 'primary' | 'secondary' | 'error'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  fullWidth?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  variant = 'primary',
  size = 'lg',
  className = '',
  type = 'button',
}: ButtonProps) {
  const variantClass =
    variant === 'primary'
      ? 'bg-primary text-white'
      : variant === 'error'
        ? 'bg-error text-white'
        : 'bg-white border border-border text-text-primary'

  const sizeClass =
    size === 'sm'
      ? 'px-4 py-4 text-sm'
      : size === 'lg'
        ? 'px-6 py-5 text-sm'
        : 'px-5 py-5 text-sm'

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={(e) => {
        if (disabled) return
        haptic('light')
        onClick?.(e)
      }}
      className={[
        'btn-press flex items-center justify-center rounded-full font-medium transition-opacity',
        sizeClass,
        variantClass,
        fullWidth ? 'w-full' : '',
        disabled ? 'bg-disable-button cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}

