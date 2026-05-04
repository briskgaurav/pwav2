'use client'

import React, { useRef, useState } from 'react'

import Image from 'next/image'

import gsap from 'gsap'

import { ICONS } from '@/constants/icons'
import { useAuth } from '@/lib/auth-context'
import { haptic } from '@/lib/useHaptics'

type EyeButtonProps = {
  isVisible: boolean
  onToggle: (visible: boolean) => void
  size?: 'sm' | 'md'
  className?: string
}

export default function EyeButton({ isVisible, onToggle, size = 'md', className = '' }: EyeButtonProps) {
  const iconRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayVisible, setDisplayVisible] = useState(isVisible)

  const handleClick = () => {
    if (isAnimating) return
    
    haptic('medium')
    setIsAnimating(true)

    if (iconRef.current) {
      gsap
        .timeline({
          onComplete: () => setIsAnimating(false),
        })
        .to(iconRef.current, {
          scaleY: 0,
          duration: 0.15,
          ease: 'power2.in',
          onComplete: () => {
            setDisplayVisible(!isVisible)
            onToggle(!isVisible)
          },
        })
        .to(iconRef.current, {
          scaleY: 1,
          duration: 0.2,
          ease: 'back.out(2)',
        })
        .to(iconRef.current, {
          scale: 1.1,
          duration: 0.1,
          ease: 'power2.out',
        })
        .to(iconRef.current, {
          scale: 1,
          duration: 0.1,
          ease: 'power2.inOut',
        })
    } else {
      onToggle(!isVisible)
      setIsAnimating(false)
    }
  }

  // Sync displayVisible with isVisible prop when it changes externally
  React.useEffect(() => {
    if (!isAnimating) {
      setDisplayVisible(isVisible)
    }
  }, [isVisible, isAnimating])

  const {isDarkMode } = useAuth()

  const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const imageSize = size === 'sm' ? 16 : 20

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`cursor-pointer flex items-center justify-center ${className}`}
      aria-label={isVisible ? 'Hide' : 'Show'}
    >
      <div ref={iconRef} className={sizeClasses}>
        <Image
          className={`h-full w-full object-contain ${isDarkMode ? 'invert' : ''}`}
          src={displayVisible ? ICONS.eyeOpen : ICONS.eyeClose}
          alt={displayVisible ? 'Hide' : 'Show'}
          width={imageSize}
          height={imageSize}
        />
      </div>
    </button>
  )
}
