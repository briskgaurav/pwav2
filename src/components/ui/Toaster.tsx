'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

export interface ToasterProps {
  message: string
  subtitle?: string
  visible: boolean
  onDismiss: () => void
  /** Auto-dismiss after ms. 0 = no auto-dismiss. Default 3000 */
  duration?: number
  /** Icon color. Default '#ef4444' */
  iconColor?: string
}

export default function Toaster({
  message,
  subtitle,
  visible,
  onDismiss,
  duration = 3000,
  iconColor = '#ef4444',
}: ToasterProps) {
  const backdropRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: onDismiss,
    })
    if (cardRef.current) {
      tl.to(cardRef.current, { y: '100%', opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
    }
    if (backdropRef.current) {
      tl.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, 0.05)
    }
  }, [onDismiss])

  // Entrance animation
  useEffect(() => {
    if (!visible) return

    if (backdropRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'power2.out' })
    }
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.35, ease: 'power3.out' }
      )
    }

    // Auto-dismiss
    if (duration > 0) {
      timerRef.current = setTimeout(dismiss, duration)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible, duration, dismiss])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/50"
        onClick={dismiss}
      />

      {/* Card */}
      <div
        ref={cardRef}
        className="relative w-full mx-4 mb-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+1.5rem))] max-w-[400px] rounded-2xl bg-white p-6"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${iconColor}10` }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v5" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16" r="1" fill={iconColor} />
              <circle cx="12" cy="12" r="10" stroke={iconColor} strokeWidth="1.5" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 text-[15px] font-medium">{message}</p>
            {subtitle && (
              <p className="text-gray-400 text-[13px] mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <button
            onClick={dismiss}
            className="text-[14px] font-semibold shrink-0 active:opacity-60 transition-opacity"
            style={{ color: iconColor }}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )
}
