'use client'

import React from 'react'


interface VerificationPageShellProps {
  loading: boolean
  error: string | null
  children: React.ReactNode
}

/**
 * Wraps every identity-verification page with a consistent
 * loading → error → content rendering pattern.
 */
export default function VerificationPageShell({
  loading,
  error,
  children,
}: VerificationPageShellProps) {
  if (loading) {
    return (
      <div className='w-full flex items-center justify-center h-full'>

        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-primary text-sm font-medium underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return <>{children}</>
}
