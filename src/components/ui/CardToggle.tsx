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
  // Divider refs for GSAP
  const dividerRef0Right = useRef<HTMLDivElement>(null)
  const dividerRef2Left = useRef<HTMLDivElement>(null)

  const tabs: PayMode[] = ['instacard', 'other', 'balance']

  // 🔥 Slider animation (GSAP) & dividers
  useEffect(() => {
    const index = tabs.indexOf(current)
    // Slider GSAP
    if (sliderRef.current) {
      gsap.to(sliderRef.current, {
        x: `${index * 100}%`,
        duration: 0.4,
        ease: 'power3.out',
      })
    }
    // Divider at right of index 0
    if (dividerRef0Right.current) {
      if (index === 2) {
        gsap.to(dividerRef0Right.current, {
          opacity: 1,
          duration: 0.3,
          pointerEvents: "auto",
        })
      } else {
        gsap.to(dividerRef0Right.current, {
          opacity: 0,
          duration: 0.3,
          pointerEvents: "none",
        })
      }
    }
    // Divider at left of index 2
    if (dividerRef2Left.current) {
      if (index === 0) {
        gsap.to(dividerRef2Left.current, {
          opacity: 1,
          duration: 0.3,
          pointerEvents: "auto",
        })
      } else {
        gsap.to(dividerRef2Left.current, {
          opacity: 0,
          duration: 0.3,
          pointerEvents: "none",
        })
      }
    }
  }, [current, tabs])

  const handleClick = (mode: PayMode) => {
    setCurrent(mode)
    onChange?.(mode)
  }

  return (
    <div className='bg-[#ECEEFF] mb-4  px-1 h-fit'>
      <div className=' text-sm h-fit py-0 overflow-hidden rounded-t-2xl relative text-text-primary flex w-full '>
        <div className="relative w-full flex">
          {tabs.map((tab, idx) => {
            const isActive = current === tab
            return (
              <div key={tab} className="relative flex-1">
                {/* Divider right of index 0 (shows when current=2) */}
                {idx === 0 && (
                  <div
                    ref={dividerRef0Right}
                    className="absolute top-1/2 -translate-y-1/2 right-0 z-0 w-px h-1/2 bg-primary"
                    style={{ opacity: (tabs.indexOf(current) === 2 ? 1 : 0), transition: 'opacity 0.3s' }}
                  />
                )}
                {/* Divider left of index 2 (shows when current=0) */}
                {idx === 2 && (
                  <div
                    ref={dividerRef2Left}
                    className="absolute top-1/2 -translate-y-1/2 left-0 z-0 w-px h-1/2 bg-primary"
                    style={{ opacity: (tabs.indexOf(current) === 0 ? 1 : 0), transition: 'opacity 0.3s' }}
                  />
                )}
                {/* No divider for idx 1 */}
                <button
                  onClick={() => handleClick(tab)}
                  className="relative z-20 flex-1 py-4 w-full text-center overflow-hidden"
                >
                  <div className="relative h-10 flex items-center justify-center">
                    {/* 🔹 Default Text */}
                    <span
                      className={`absolute transition-all duration-300 ${isActive
                        ? 'opacity-0 -translate-y-2'
                        : 'opacity-100 translate-y-0'
                        }`}
                    >
                      {tabLabels[tab]}
                    </span>

                    {/* 🔹 Active Content */}
                    <div
                      className={`absolute flex flex-col items-center justify-center transition-all duration-300 ${isActive
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
              </div>
            )
          })}

          {/* ✅ Slider: sits above dividers, below text. z-10, text/buttons are z-20 */}
          <div
            ref={sliderRef}
            className="absolute top-[4%] z-10 left-0 h-[92%] w-1/3 bg-white rounded-2xl pointer-events-none"
          />
        </div>
      </div>
    </div>
  )
}