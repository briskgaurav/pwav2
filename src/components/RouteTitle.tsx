'use client'

import { usePathname } from 'next/navigation'

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/instacard': 'Instacard',
}

function getTitleFromPath(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  const segment = pathname.split('/').filter(Boolean).pop() || ''
  return segment.replace(/-/g, ' ')
}

export default function RouteTitle() {
  const pathname = usePathname()
  const title = getTitleFromPath(pathname)

  // if (pathname === '/') return null

  return (
    <div className="shrink-0 bg-text-primary h-[10%] rounded-t-3xl -mt-1 relative z-20 py-2.5 px-4">
      <p className="text-white text-sm text-center font-medium capitalize">{title}</p>
    </div>
  )
}
