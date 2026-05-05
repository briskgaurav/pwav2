'use client'

import { useCallback, useEffect, useState } from 'react'

export type VisualViewportModel = {
  /** Bottom inset in px (usually keyboard height). */
  insetBottom: number
  /** Visual viewport height in px (shrinks when keyboard opens). */
  viewportHeight: number
  /** Whether VisualViewport API is supported. */
  supported: boolean
}

function getDocHeight() {
  if (typeof document === 'undefined') return 0
  return document.documentElement?.clientHeight ?? 0
}

function computeModel(): VisualViewportModel {
  if (typeof window === 'undefined') {
    return { insetBottom: 0, viewportHeight: 0, supported: false }
  }

  const vv = window.visualViewport
  const full = getDocHeight() || window.innerHeight

  if (!vv) {
    return { insetBottom: 0, viewportHeight: full, supported: false }
  }

  // In PWA/standalone mode, `window.innerHeight` can be stale.
  // `documentElement.clientHeight` tends to be more reliable.
  const insetBottom = Math.max(0, full - vv.height)
  return { insetBottom, viewportHeight: vv.height, supported: true }
}

export function useVisualViewport() {
  const [model, setModel] = useState<VisualViewportModel>(() => computeModel())

  const recompute = useCallback(() => {
    setModel(computeModel())
  }, [])

  useEffect(() => {
    recompute()

    const vv = window.visualViewport
    vv?.addEventListener('resize', recompute)
    vv?.addEventListener('scroll', recompute)
    window.addEventListener('resize', recompute)

    return () => {
      vv?.removeEventListener('resize', recompute)
      vv?.removeEventListener('scroll', recompute)
      window.removeEventListener('resize', recompute)
    }
  }, [recompute])

  return model
}

