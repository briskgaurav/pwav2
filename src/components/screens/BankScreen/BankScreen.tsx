
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'

export default function BankScreen() {
  const router = useRouter()
  const [checking, setChecking] = useState(false)

  const handleClick = () => {
    let activeId = '1'
    try {
      activeId = localStorage.getItem('active_user_id') ?? '1'
      localStorage.setItem('active_user_id', activeId)
    } catch {
      // ignore
    }

    const isCompleted = (() => {
      try {
        return (
          localStorage.getItem(`kyc_completed_${activeId}`) === 'true' ||
          localStorage.getItem('kyc_completed') === 'true'
        )
      } catch {
        return false
      }
    })()

    if (isCompleted) {
      router.push(routes.instacard)
      return
    }

    router.push(`${routes.identityRegistrationProcess}?id=${encodeURIComponent(activeId)}`)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="shrink-0 flex items-center justify-center h-full relative z-10">
        <button
          onClick={handleClick}
          className="bg-primary text-[#fff] text-base font-medium px-8 py-4 rounded-full transition-transform active:scale-95"
        >
          Go to Instacard
        </button>
      </div>
    </div>
  )
}