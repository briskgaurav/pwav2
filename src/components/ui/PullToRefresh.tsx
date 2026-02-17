'use client'

import React, { useRef, useState, useCallback, useEffect, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'
import gsap from 'gsap'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void> | void
  threshold?: number
  maxPull?: number
  disabled?: boolean
}

export default function PullToRefresh({
  children,
  onRefresh,
  threshold = 150,
  maxPull = 200,
  disabled = false,
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number>(0)
  const pullDistanceRef = useRef<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isPullingRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  const updateVisuals = useCallback((distance: number) => {
    if (!contentRef.current || !indicatorRef.current || !iconRef.current) return

    const progress = Math.min(distance / threshold, 1)
    const rotation = progress * 360

    // Update content position
    gsap.set(contentRef.current, { y: distance })

    // Update indicator position and opacity
    gsap.set(indicatorRef.current, {
      y: Math.max(distance - 40, -40),
      opacity: distance > 10 ? 1 : 0,
    })

    // Update icon rotation
    if (!isRefreshing) {
      gsap.set(iconRef.current, { rotation })
    }
  }, [threshold, isRefreshing])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || isRefreshing) return

      const container = containerRef.current
      if (!container || container.scrollTop > 0) return

      startYRef.current = e.touches[0].clientY
      pullDistanceRef.current = 0
      isPullingRef.current = true
    },
    [disabled, isRefreshing]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPullingRef.current || disabled || isRefreshing) return

      const container = containerRef.current
      if (!container || container.scrollTop > 0) {
        isPullingRef.current = false
        pullDistanceRef.current = 0
        updateVisuals(0)
        return
      }

      const currentY = e.touches[0].clientY
      const diff = currentY - startYRef.current

      if (diff > 0) {
        // Apply easing resistance for more natural feel
        const resistance = 1 - Math.min(diff / (maxPull * 3), 0.7)
        const distance = Math.min(diff * resistance, maxPull)
        pullDistanceRef.current = distance

        // Cancel any pending animation frame
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current)
        }

        // Use requestAnimationFrame for smooth updates
        rafRef.current = requestAnimationFrame(() => {
          updateVisuals(distance)
        })
      }
    },
    [disabled, isRefreshing, maxPull, updateVisuals]
  )

  const handleTouchEnd = useCallback(async () => {
    if (!isPullingRef.current || disabled) return

    isPullingRef.current = false
    const distance = pullDistanceRef.current

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    if (distance >= threshold && !isRefreshing) {
      setIsRefreshing(true)

      // Animate to refresh position
      gsap.to(contentRef.current, {
        y: threshold * 0.5,
        duration: 0.3,
        ease: 'power2.out',
      })

      gsap.to(indicatorRef.current, {
        y: threshold * 0.5 - 40,
        duration: 0.3,
        ease: 'power2.out',
      })

      // Start spinning animation
      if (iconRef.current) {
        gsap.to(iconRef.current, {
          rotation: '+=360',
          duration: 0.8,
          ease: 'linear',
          repeat: -1,
        })
      }

      try {
        await onRefresh()
      } finally {
        // Stop spinning and animate back
        if (iconRef.current) {
          gsap.killTweensOf(iconRef.current)
        }

        gsap.to(contentRef.current, {
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
        })

        gsap.to(indicatorRef.current, {
          y: -40,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            setIsRefreshing(false)
            pullDistanceRef.current = 0
          },
        })
      }
    } else {
      // Animate back to start with spring effect
      gsap.to(contentRef.current, {
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      })

      gsap.to(indicatorRef.current, {
        y: -40,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      })

      pullDistanceRef.current = 0
    }
  }, [disabled, threshold, isRefreshing, onRefresh])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const progress = Math.min(pullDistanceRef.current / threshold, 1)

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-auto overscroll-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        ref={indicatorRef}
        className="absolute left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none"
        style={{ top: 0, opacity: 0 }}
      >
        <div className="w-10 h-10 rounded-full bg-background2  flex items-center justify-center">
          <div ref={iconRef}>
            <RefreshCw className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="will-change-transform">
        {children}
      </div>
    </div>
  )
}
