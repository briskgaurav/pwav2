'use client'

import type { ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useIsWebView } from '@/hooks/use-is-webview'

export function PageSlideTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const key = `${pathname}?${searchParams?.toString() ?? ''}`

  const isWebView = useIsWebView()

  return (
    <div key={key} className={`${isWebView ? '' : 'page-slide-in'} flex-1 min-h-0 rounded-t-3xl flex flex-col overflow-auto`}>

      {children}
    </div>
  )
}

