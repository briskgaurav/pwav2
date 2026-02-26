'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useOnlinePaymentStore } from '../store/useOnlinePaymentStore'
import { useCvvTimer } from '../hooks/useCvvTimer'
import CopyButton from '@/components/ui/CopyButton'
import { EyeIcon, EyeOffIcon, RefreshCw } from 'lucide-react'
import { haptic } from '@/lib/useHaptics'
import gsap from 'gsap'

export default function VirtualCardDetails() {
  const cardRef = useRef<HTMLDivElement>(null)
  const frontContentRef = useRef<HTMLDivElement>(null)
  const backContentRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<SVGCircleElement>(null)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const cardDetails = useOnlinePaymentStore((s) => s.cardDetails)
  const isRefreshing = useOnlinePaymentStore((s) => s.isRefreshing)
  const refreshData = useOnlinePaymentStore((s) => s.refreshData)
  const { cvvTimeRemaining } = useCvvTimer()

  const [isFlipped, setIsFlipped] = useState(false)
  const [isBalanceVisible, setIsBalanceVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState(180)

  const TIMER_DURATION = 180
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 16

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  const startTimer = useCallback(() => {
    setTimeLeft(TIMER_DURATION)

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }

    if (progressRef.current) {
      gsap.fromTo(
        progressRef.current,
        { strokeDashoffset: 0 },
        {
          strokeDashoffset: CIRCLE_CIRCUMFERENCE,
          duration: TIMER_DURATION,
          ease: 'linear',
        }
      )
    }

    if (timerRef.current) {
      gsap.fromTo(
        timerRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      )
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [CIRCLE_CIRCUMFERENCE])

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
    if (progressRef.current) {
      gsap.killTweensOf(progressRef.current)
    }
  }, [])

  const flipCard = useCallback((toFlipped: boolean) => {
    if (!cardRef.current) return

    if (toFlipped) {
      if (frontContentRef.current) {
        gsap.to(frontContentRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            if (frontContentRef.current) {
              frontContentRef.current.style.visibility = 'hidden'
            }
          },
        })
      }
      if (backContentRef.current) {
        backContentRef.current.style.visibility = 'visible'
        gsap.fromTo(
          backContentRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, delay: 0.3, ease: 'power2.inOut' }
        )
      }
    } else {
      if (backContentRef.current) {
        gsap.to(backContentRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          onComplete: () => {
            if (backContentRef.current) {
              backContentRef.current.style.visibility = 'hidden'
            }
          },
        })
      }
      if (frontContentRef.current) {
        frontContentRef.current.style.visibility = 'visible'
        gsap.fromTo(
          frontContentRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, delay: 0.3, ease: 'power2.inOut' }
        )
      }
    }

    gsap.to(cardRef.current, {
      rotateY: toFlipped ? 180 : 0,
      duration: 0.6,
      ease: 'power2.inOut',
    })

    setIsFlipped(toFlipped)

    if (toFlipped) {
      startTimer()
    } else {
      stopTimer()
    }
  }, [startTimer, stopTimer])

  const handleFlip = useCallback(() => {
    haptic('medium')
    flipCard(!isFlipped)
  }, [flipCard, isFlipped])

  const handleEyeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    haptic('light')
    setIsBalanceVisible(!isBalanceVisible)
  }

  const handleRefresh = () => {
    haptic('medium')
    refreshData()
  }

  useEffect(() => {
    if (backContentRef.current) {
      backContentRef.current.style.visibility = 'hidden'
      backContentRef.current.style.opacity = '0'
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      flipCard(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [flipCard])


  return (
    <div className="flex flex-col gap-3">
      {/* Card flip container */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: '1000px' }}
        // onClick={handleFlip}
      >
        <div
          ref={cardRef}
          className="relative w-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side — relative so it establishes height */}
          <div
            className="relative w-full"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div ref={frontContentRef}>
              <div className="absolute bottom-[32px] right-[34px] z-10 text-white">
                <p className="text-sm">{cardDetails.cardholderName}</p>
              </div>
              <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 text-white">
                <p className="text-2xl font-semibold">
                  {isBalanceVisible ? cardDetails.pan : '**** **** **** ****'}
                </p>
                <button
                  onClick={handleEyeClick}
                  className="p-1.5 transition-transform duration-200 hover:scale-110 active:scale-95"
                >
                  {isBalanceVisible ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <Image
              src="/img/frontside.png"
              alt="Virtual Card Front"
              width={340}
              height={215}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Back Side — absolute, overlaid on top of front */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div ref={backContentRef} className="absolute inset-0 z-10">
              <div className="flex flex-col h-full w-full p-[27px]">
                {/* Card Number */}
                <div className="flex-1 -mt-23 flex items-center justify-center">
                  <p className="text-xl text-[#ffffff] text-center tracking-[3px]">
                    {cardDetails.pan}
                  </p>
                  <CopyButton  value={cardDetails.pan.replace(/\s/g, '')} className="text-[#ffffff] invert ml-2" />
                </div>

                {/* Bottom — Valid Till & Timer */}
                <div className="flex items-end justify-between">
                  <div className="text-[#ffffff] flex items-center gap-1">
                    <div>
                      <p className="text-xs font-semibold mb-1">VALID TILL</p>
                      <p className="text-sm font-semibold">{cardDetails.expiry}</p>
                    </div>
                    <CopyButton value={cardDetails.expiry} className="text-[#ffffff]" size="sm" />
                  </div>

                  {/* Timer ring */}
                  <div
                    ref={timerRef}
                    className="w-10 h-10 flex items-center justify-center relative"
                  >
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill="transparent" strokeWidth="3" />
                      <circle
                        ref={progressRef}
                        cx="20"
                        cy="20"
                        r="16"
                        fill="transparent"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={CIRCLE_CIRCUMFERENCE}
                        strokeDashoffset={0}
                      />
                    </svg>
                    <span className="absolute text-[#ffffff] text-[8px] font-semibold">
                      {formatTime(timeLeft)}
                    </span>
                  </div>

                  {/* CVV */}
                  <div className="absolute bottom-[35px] right-[85px] z-10 text-text-primary flex items-center gap-1">
                    <p className="text-sm text-black font-semibold">{cardDetails.cvv}</p>
                    <CopyButton value={cardDetails.cvv} className="text-white" size="sm" />
                  </div>
                </div>
              </div>
            </div>
            <Image
              src="/img/backside.png"
              alt="Virtual Card Back"
              width={340}
              height={215}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-sm text-center text-text-primary">
        {!isFlipped ? 'Tap to view card details' : 'This Dynamic CVV is valid for maximum 3 minutes.'}
      </p>

      {/* Refresh button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleRefresh()
            // handleFlip()
          }}
          disabled={isRefreshing}
          className="bg-background2 rounded-xl px-4 py-2.5 flex items-center gap-2 btn-press disabled:opacity-50"
          aria-label="Refresh card data"
        >
          <RefreshCw className={`w-4 h-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-text-primary text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </span>
        </button>
      </div>
    </div>
  )
}
