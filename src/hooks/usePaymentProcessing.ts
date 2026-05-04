'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type PaymentProcessingState = 'loading' | 'error'

export type PaymentProcessingModel = {
  open: boolean
  state: PaymentProcessingState
  title: string
  subtitle: string
}

type StartOptions = {
  /** Minimum time (ms) to keep overlay visible before success. */
  minDurationMs?: number
  title?: string
  subtitle?: string
}

/**
 * Reusable helper for showing a "processing payment" overlay with optional error state.
 * Keeps timers cleaned up automatically on unmount.
 */
export function usePaymentProcessing() {
  const [model, setModel] = useState<PaymentProcessingModel>({
    open: false,
    state: 'loading',
    title: 'Processing payment…',
    subtitle: 'Please wait while we complete your payment.',
  })

  const timerRef = useRef<number | null>(null)
  const startTsRef = useRef<number>(0)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => clearTimer, [clearTimer])

  const close = useCallback(() => {
    clearTimer()
    setModel((m) => ({ ...m, open: false }))
  }, [clearTimer])

  const start = useCallback((opts?: StartOptions) => {
    clearTimer()
    startTsRef.current = Date.now()
    setModel({
      open: true,
      state: 'loading',
      title: opts?.title ?? 'Processing payment…',
      subtitle: opts?.subtitle ?? 'Please wait while we complete your payment.',
    })
  }, [clearTimer])

  const fail = useCallback((title: string, subtitle: string) => {
    clearTimer()
    setModel({
      open: true,
      state: 'error',
      title,
      subtitle,
    })
  }, [clearTimer])

  const succeedAfterMinDuration = useCallback((onSuccess: () => void, minDurationMs = 5000) => {
    const elapsed = Date.now() - startTsRef.current
    const remaining = Math.max(0, minDurationMs - elapsed)
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      setModel((m) => ({ ...m, open: false }))
      onSuccess()
    }, remaining)
  }, [clearTimer])

  return {
    model,
    start,
    fail,
    close,
    succeedAfterMinDuration,
  }
}

