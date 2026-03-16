'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'

export default function HomePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(false)

  const handleClick = () => {
    const hasSavedUser =
      localStorage.getItem('kyc_completed') === 'true' ||
      !!localStorage.getItem('user')

    if (hasSavedUser) {
      router.push(routes.instacard)
    } else {
      router.push('/verify')
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
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