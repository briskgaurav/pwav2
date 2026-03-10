'use client'

import Link from 'next/link'
import { routes } from '@/lib/routes'

export default function HomePage() {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="shrink-0 flex items-center justify-center h-full relative z-10">

        <Link
          href={routes.instacard}
          className="bg-primary text-white text-base font-medium px-8 py-4 rounded-full transition-transform active:scale-95"
        >
          Go to Instacard
        </Link>
      </div>
    </div>
  )
}
