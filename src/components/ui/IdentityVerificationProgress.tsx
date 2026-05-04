// Route-aware progress bar for Identity Verification flow.
'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

export default function IdentityVerificationProgress() {
  const pathname = usePathname()

  // Overall identity verification steps:
  // 1) Liveness Verification
  // 2) ID Verification
  // 3) Email Registration
  let activeIndex = 0
  if (pathname.includes('/identity-verification/id-verification')) activeIndex = 1
  else if (pathname.includes('/identity-verification/email-registration')) activeIndex = 2
  else if (pathname.includes('/identity-verification/liveness-verification')) activeIndex = 0
  else if (pathname.includes('/identity-verification/kyc-status')) activeIndex = 3

  // Calculate progress width based on active step
  const progressWidth = activeIndex === 0 ? 'w-1/3' : activeIndex === 1 ? 'w-2/3' : 'w-full'

  // Helper to get text color: green if completed, primary if current, secondary otherwise
  const getStepClass = (stepIndex: number) => {
    if (stepIndex < activeIndex) return 'text-green-500 font-medium' // completed
    if (stepIndex === activeIndex) return 'text-text-primary font-medium' // current
    return '' // upcoming
  }

  return (
    <div className="flex items-start flex-col justify-center gap-2 w-full py-4 px-4">

      <p className='text-xs text-text-secondary'>
        <span className={getStepClass(0)}>Liveness</span>
        <span className='mr-2'> &gt; </span>
        <span className={getStepClass(1)}>ID Verification</span>
        <span className='mr-2'> &gt; </span>
        <span className={getStepClass(2)}>Email Registration</span>
      </p>
      <div className='w-full h-2 relative overflow-hidden rounded-full bg-[#E6E6E6]'>
       <span className={`bg-primary absolute top-0 left-0 h-full ${progressWidth} rounded-full transition-all duration-300`} />
      </div>
    </div>
  )
}
