'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'

type UseSlideUpKeypadOptions = {
  insideRefs?: Array<React.RefObject<HTMLElement | null>>
}

export function useSlideUpKeypad(options: UseSlideUpKeypadOptions = {}) {
  const { insideRefs = [] } = options

  const keypadRef = useRef<HTMLDivElement | null>(null)
  const keypadTweenRef = useRef<gsap.core.Tween | null>(null)

  const [isKeypadOpen, setIsKeypadOpen] = useState(false)
  const [keypadHeight, setKeypadHeight] = useState(0)

  const allInsideRefs = useMemo(
    () => [keypadRef as React.RefObject<HTMLElement | null>, ...insideRefs],
    [insideRefs]
  )

  const openKeypad = useCallback(() => {
    if (!keypadRef.current) return
    keypadTweenRef.current?.kill()
    setIsKeypadOpen(true)
    keypadTweenRef.current = gsap.to(keypadRef.current, {
      y: 0,
      duration: 0.35,
      ease: 'power3.out',
    })
  }, [])

  const closeKeypad = useCallback(() => {
    if (!keypadRef.current) return
    keypadTweenRef.current?.kill()
    setIsKeypadOpen(false)
    keypadTweenRef.current = gsap.to(keypadRef.current, {
      y: '100%',
      duration: 0.3,
      ease: 'power3.in',
    })
  }, [])

  useEffect(() => {
    if (!keypadRef.current) return
    gsap.set(keypadRef.current, { y: '100%' })
    return () => {
      keypadTweenRef.current?.kill()
      keypadTweenRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!keypadRef.current) return
    setKeypadHeight(keypadRef.current.offsetHeight || 0)
  }, [isKeypadOpen])

  useEffect(() => {
    if (!isKeypadOpen) return

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null
      if (!target) return

      for (const ref of allInsideRefs) {
        if (ref.current?.contains(target)) return
      }

      closeKeypad()
    }

    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('touchstart', handleOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('touchstart', handleOutside)
    }
  }, [allInsideRefs, closeKeypad, isKeypadOpen])

  return {
    keypadRef,
    isKeypadOpen,
    keypadHeight,
    openKeypad,
    closeKeypad,
  }
}
