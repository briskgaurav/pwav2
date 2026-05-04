import React from 'react'

import Image from 'next/image'

import { ICONS } from '@/constants/icons'
import { haptic } from '@/lib/useHaptics'

type FaqIconButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  ariaLabel?: string
  /** Visual size of the circular icon button */
  size?: 'sm' | 'md'
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export default function FaqIconButton({
  onClick,
  ariaLabel = 'Open FAQ',
  size = 'md',
  className = '',
  type = 'button',
}: FaqIconButtonProps) {
  const baseStyles =
    'flex items-center p-1.5 justify-center rounded-full bg-primary text-white cursor-pointer hover:opacity-80 transition-opacity'

  const sizeStyles =
    size === 'sm'
      ? 'w-5 h-5'
      : 'w-5 h-5'

  const iconSize = size === 'sm' ? 12 : 12

  return (
    <button
      type={type}
      onClick={(event) => {
        haptic('light')
        onClick?.(event)
      }}
      aria-label={ariaLabel}
      className={`${baseStyles} ${sizeStyles} ${className}`}
    >
      <Image
        src={ICONS.question}
        alt="FAQ"
        width={iconSize}
        height={iconSize}
      />
    </button>
  )
}
