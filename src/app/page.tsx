'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { routes } from '@/lib/routes'

export default function HomePage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const hasSavedUser =
      localStorage.getItem('kyc_completed') === 'true' ||
      !!localStorage.getItem('user')
    if (hasSavedUser) {
      router.replace(routes.instacard)
    } else {
      setChecking(false)
    }
  }, [router])



  return (
    <div className="flex flex-col h-full bg-background">
      <div className="shrink-0 flex items-center justify-center h-full relative z-10">
        <Link
          href={checking ? routes.instacard : '/verify'}
          className="bg-primary text-white text-base font-medium px-8 py-4 rounded-full transition-transform active:scale-95"
        >
          Go to Instacard
        </Link>
      </div>
    </div>
  )
}
