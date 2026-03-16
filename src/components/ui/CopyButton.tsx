'use client'

import React, { useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import gsap from 'gsap'
import { haptic } from '@/lib/useHaptics'
import { useAuth } from '@/lib/auth-context'

type CopyButtonProps = {
  value: string
  size?: 'sm' | 'md'
  className?: string
}

export default function CopyButton({ value, size = 'md', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const iconRef = useRef<HTMLDivElement>(null)

  const {isDarkMode } = useAuth()

  const handleClick = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        // Fallback for older browsers/mobile
        const textArea = document.createElement('textarea')
        textArea.value = value
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      
      haptic('medium')

      if (iconRef.current) {
        gsap
          .timeline()
          .to(iconRef.current, {
            scale: 0,
            rotation: -180,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => setCopied(true),
          })
          .to(iconRef.current, {
            scale: 1.2,
            rotation: 0,
            duration: 0.3,
            ease: 'back.out(1.7)',
          })
          .to(iconRef.current, {
            scale: 1,
            duration: 0.15,
            ease: 'power2.out',
          })

        setTimeout(() => {
          if (!iconRef.current) return

          gsap
            .timeline()
            .to(iconRef.current, {
              scale: 0,
              rotation: 180,
              duration: 0.2,
              ease: 'power2.in',
              onComplete: () => setCopied(false),
            })
            .to(iconRef.current, {
              scale: 1,
              rotation: 0,
              duration: 0.3,
              ease: 'back.out(1.7)',
            })
        }, 2000)
      }
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <button
      type="button"
      onClick={handleClick}
      // onTouchEnd={handleClick}
      
      className={`cursor-pointer flex items-center justify-center touch-manipulation ${className}`}
      aria-label="Copy to clipboard"
    >
      <div ref={iconRef} className={sizeClasses}>
        {copied ? (
          <Check className={`w-full h-full text-text-primary ${isDarkMode ? 'text-[#fff]' : ''}`} />
        ) : (
          <Copy className={`w-full h-full text-text-primary ${isDarkMode ? 'text-[#fff]' : ''}`} />
        )}
      </div>
    </button>
  )
}
