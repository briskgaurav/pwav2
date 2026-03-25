'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import gsap from 'gsap'
import { Plus, X } from 'lucide-react'

interface MessageInputProps {
  value: string
  onChangeText: (text: string) => void
}

const COLLAPSED_HEIGHT = 40
const EXPANDED_HEIGHT = 160

const SUGGESTIONS = [
  '🍽️ Dinner', '🏠 Rent', '🙏 Thanks!', '🎁 Gift', '☕ Coffee', '🛒 Groceries', '💡 Utilities', '🎂 Birthday',
]

function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(8)
}

export function MessageInput({ value, onChangeText }: MessageInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const expand = useCallback(() => {
    setIsExpanded(true)
    haptic()
    if (containerRef.current) {
      gsap.to(containerRef.current, { height: EXPANDED_HEIGHT, duration: 0.25, ease: 'power2.out' })
    }
    setTimeout(() => inputRef.current?.focus(), 200)
  }, [])

  const collapse = useCallback(() => {
    setIsExpanded(false)
    haptic()
    inputRef.current?.blur()
    if (containerRef.current) {
      gsap.to(containerRef.current, { height: COLLAPSED_HEIGHT, duration: 0.25, ease: 'power2.out' })
    }
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      gsap.set(containerRef.current, { height: COLLAPSED_HEIGHT })
    }
  }, [])

  const hasMessage = value.trim().length > 0

  return (
    <div className="flex items-center justify-center py-4 px-6">
      <div ref={containerRef} className="w-full ">
        {!isExpanded ? (
          <button
            type="button"
            onClick={expand}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 z-100 rounded-[10px] border border-border mx-auto max-w-[80%]"
          >
            {!hasMessage && <Plus className="w-3.5 h-3.5 text-text-secondary" />}
            <span className={`text-sm ${hasMessage ? 'text-text-primary' : 'text-text-secondary'} truncate`}>
              {hasMessage ? value : 'Add a message'}
            </span>
          </button>
        ) : (
          <div className="h-full rounded-2xl border border-border bg-white p-3 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-text-primary uppercase tracking-wider">Message</span>
              <button type="button" onClick={collapse} className="p-1">
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            <textarea
              ref={inputRef}
              value={value}
              onChange={(e) => onChangeText(e.target.value)}
              placeholder="Type a message..."
              maxLength={100}
              className="flex-1 text-sm text-text-primary resize-none outline-none! focus:outline-none! border-none! bg-transparent placeholder:text-text-secondary"
            />

            <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => { haptic(); onChangeText(s) }}
                  className={`shrink-0 px-3 py-1.5 rounded-2xl text-[13px] border transition-colors ${
                    value === s
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-border text-text-secondary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
