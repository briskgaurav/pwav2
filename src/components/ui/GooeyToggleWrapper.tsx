'use client'

import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

// Inlined GooeyFilter from GoeyFilter.jsx (Do NOT import)
const GooeySvgFilter = ({ id = "gooey-filter", strength = 12 }) => {
  return (
    <svg className="absolute w-0 h-0">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 20 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}

export type GooeyTab = {
  title: string
  id: string
}

type GooeyToggleWrapperProps = {
  tabs: GooeyTab[]
  activeIndex: number
  onChange: (nextIndex: number) => void
  /** Optional: enable/disable gooey effect (double click toggles by default) */
  defaultGooeyEnabled?: boolean
  /** Unique layoutId if multiple wrappers appear on same page */
  layoutId?: string
  /** Gooey filter strength */
  strength?: number
  /** Extra class for outer container */
  className?: string
  /** Rendered below the animated content area */
  children: React.ReactNode
  /** Optional: render animated content panel (if you want wrapper to animate) */
  animateKey?: React.Key
  renderAnimatedContent?: () => React.ReactNode
}

export default function GooeyToggleWrapper({
  tabs,
  activeIndex,
  onChange,
  defaultGooeyEnabled = true,
  layoutId = 'gooey-active-tab',
  strength = 10,
  className,
  children,
  animateKey,
  renderAnimatedContent,
}: GooeyToggleWrapperProps) {
  const [isGooeyEnabled, setIsGooeyEnabled] = useState(defaultGooeyEnabled)

  const safeTabs = useMemo(() => tabs.filter(Boolean), [tabs])

  return (
    <div
      className={className ?? 'relative w-full h-full min-h-0 flex justify-center text-base bg-white cursor-pointer'}
      onDoubleClick={() => setIsGooeyEnabled((prev) => !prev)}
    >
      <GooeySvgFilter id="gooey-filter" strength={strength} />

      <div className="w-full bg-[#ECEEFF] relative">
        {/* Filtered layer */}
        <div
          className="absolute inset-0"
          style={{ filter: isGooeyEnabled ? 'url(#gooey-filter)' : 'none' }}
        >
          {/* Tab indicator bars */}
          <div className="flex w-full">
            {safeTabs.map((tab, index) => (
              <div key={tab.id ?? index} className="relative flex-1 h-12">
                {activeIndex === index && (
                  <motion.div
                    layoutId={layoutId}
                    className="absolute inset-0 bg-white"
                    transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Content panel */}
          <div className="w-full h-full bg-white overflow-y-auto pb-[10vh] text-muted-foreground">
            {renderAnimatedContent ? (
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={animateKey ?? activeIndex}
                  initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="p-0"
                >
                  {renderAnimatedContent()}
                </motion.div>
              </AnimatePresence>
            ) : (
              children
            )}
          </div>
        </div>

        {/* Interactive text overlay (no filter) */}
        <div className="relative flex w-full">
          {safeTabs.map((tab, index) => (
            <div
              key={tab.id ?? index}
              onClick={() => onChange(index)}
              className={`
                flex-1 text-sm flex items-center justify-center cursor-pointer select-none h-12
                ${activeIndex === index ? 'text-black font-semibold' : 'text-muted-foreground font-normal'}
              `}
              tabIndex={0}
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={tab.title}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onChange(index)
              }}
            >
              <span className="w-full h-full px-2 leading-none flex text-center items-center justify-center">
                {tab.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}