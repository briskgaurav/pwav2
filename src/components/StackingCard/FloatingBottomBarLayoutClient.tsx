'use client'

import { usePathname } from 'next/navigation'
import FloatingBottomBar from './FloatingBottomBar'
import { useCardModeStore } from '@/store/useCardModeStore'

export function FloatingBottomBarLayoutClient({hidescan = false}: {hidescan: boolean}) {
  const cardMode = useCardModeStore((s) => s.cardMode)
  return (
    <FloatingBottomBar
    hideScan={hidescan}
      mode={cardMode}
    />
  )
}

export default FloatingBottomBarLayoutClient

