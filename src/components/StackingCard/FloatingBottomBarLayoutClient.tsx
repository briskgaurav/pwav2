'use client'

import FloatingBottomBar from './FloatingBottomBar'
import { useCardModeStore } from '@/store/useCardModeStore'

export function FloatingBottomBarLayoutClient() {
  const cardMode = useCardModeStore((s) => s.cardMode)

  return (
    <FloatingBottomBar
      mode={cardMode}
    />
  )
}

export default FloatingBottomBarLayoutClient

