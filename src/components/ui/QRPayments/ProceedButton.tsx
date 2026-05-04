'use client'

import { useRef, useEffect } from 'react'

import gsap from 'gsap'

interface ProceedButtonProps {
  amount: string
  onPress: () => void
}

function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(15)
  }
}

export function ProceedButton({ amount, onPress }: ProceedButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const isDisabled = amount === '0' || amount === '0.'

  useEffect(() => {
    if (!btnRef.current) return
    gsap.to(btnRef.current, {
      opacity: isDisabled ? 0.2 : 1,
      duration: 0.25,
      ease: 'power2.out',
    })
  }, [isDisabled])

  const handlePress = () => {
    if (isDisabled) return
    haptic()
    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { scale: 0.95 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' })
    }
    onPress()
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handlePress}
      disabled={isDisabled}
      className="w-full py-3.5 bg-primary rounded-[25px] text-text-on-primary font-medium text-base disabled:cursor-not-allowed active:scale-[0.97] transition-transform"
    >
      Proceed
    </button>
  )
}
