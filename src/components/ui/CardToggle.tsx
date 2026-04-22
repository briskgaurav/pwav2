'use client'

import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'

export type PayMode = 'instacard' | 'other' | 'balance'

interface CardToggleProps {
  active?: PayMode
  onChange?: (mode: PayMode) => void
}

const tabLabels: Record<PayMode, string> = {
  instacard: 'Instacard',
  other: 'Other Cards',
  balance: 'Account Balance',
}

export default function CardToggle({
  active = 'instacard',
  onChange,
}: CardToggleProps) {
  const [current, setCurrent] = useState<PayMode>(active)
  const sliderRef = useRef<HTMLDivElement>(null)

  const tabs: PayMode[] = ['instacard', 'other', 'balance']

  // 🔥 Slider animation (GSAP)
  useEffect(() => {
    const index = tabs.indexOf(current)

    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        x: `${index * 100}%`,
        duration: 0.4,
        ease: 'power3.out',
      })
    }
  }, [current])

  const handleClick = (mode: PayMode) => {
    setCurrent(mode)
    onChange?.(mode)
  }

  return (
    <div className='bg-[#ECEEFF] text-sm mb-4 overflow-hidden relative text-text-primary flex w-full rounded-t-2xl'>
      
      {/* ✅ Slider */}
      <div
        ref={sliderRef}
        className='absolute top-0 left-0 h-full w-1/3 bg-white rounded-t-2xl'
      />

      {/* ✅ Tabs */}
      {tabs.map((tab) => {
        const isActive = current === tab

        return (
          <button
            key={tab}
            onClick={() => handleClick(tab)}
            className='relative z-10 flex-1 py-4 text-center overflow-hidden'
          >
            <div className="relative h-10 flex items-center justify-center">

              {/* 🔹 Default Text */}
              <span
                className={`absolute transition-all duration-300 ${
                  isActive
                    ? 'opacity-0 -translate-y-2'
                    : 'opacity-100 translate-y-0'
                }`}
              >
                {tabLabels[tab]}
              </span>

              {/* 🔹 Active Content */}
              <div
                className={`absolute flex flex-col items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="text-xs font-medium text-text-primary mb-0.5">
                  Pay Using
                </span>
                <span className="font-medium text-primary">
                  {tabLabels[tab]}
                </span>
              </div>

            </div>
          </button>
        )
      })}
    </div>
  )
}