'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

type UseBackRedirectOptions = {
  /** Enable/disable interception */
  enabled?: boolean
  /** If true, adds a history entry so the first back press triggers on this page */
  pushDummyState?: boolean
  /** Use router.replace (default) or router.push */
  navigation?: 'replace' | 'push'
}

/**
 * Intercepts the browser back action (popstate) and redirects the user to `to`.
 * Useful for "success" screens where going back should not re-enter a flow.
 */
export function useBackRedirect(to: string, options: UseBackRedirectOptions = {}) {
  const router = useRouter()
  const {
    enabled = true,
    pushDummyState = true,
    navigation = 'replace',
  } = options

  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    if (pushDummyState) {
      // Add a history entry so the first "back" triggers popstate here.
      window.history.pushState({ __backRedirect: true }, '', window.location.href)
    }

    const onPopState = () => {
      if (navigation === 'push') router.push(to)
      else router.replace(to)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [enabled, navigation, pushDummyState, router, to])
}

