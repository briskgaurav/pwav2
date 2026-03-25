'use client'

import { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { decrementCvvTimer } from '@/store/redux/slices/onlinePaymentSlice'

export function useCvvTimer() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dispatch = useAppDispatch()
  const cvvTimeRemaining = useAppSelector((s) => s.onlinePayment.cvvTimeRemaining)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      dispatch(decrementCvvTimer())
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [dispatch])

  const minutes = Math.floor(cvvTimeRemaining / 60)
  const seconds = cvvTimeRemaining % 60
  const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return { cvvTimeRemaining, formatted, minutes, seconds }
}
