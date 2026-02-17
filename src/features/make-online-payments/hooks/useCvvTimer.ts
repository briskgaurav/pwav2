'use client'

import { useEffect, useRef } from 'react'
import { useOnlinePaymentStore } from '../store/useOnlinePaymentStore'

export function useCvvTimer() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const decrementCvvTimer = useOnlinePaymentStore((s) => s.decrementCvvTimer)
  const cvvTimeRemaining = useOnlinePaymentStore((s) => s.cvvTimeRemaining)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      decrementCvvTimer()
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [decrementCvvTimer])

  const minutes = Math.floor(cvvTimeRemaining / 60)
  const seconds = cvvTimeRemaining % 60
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return { cvvTimeRemaining, formatted, minutes, seconds }
}
