'use client'

import FloatingBottomBar from './FloatingBottomBar'
import { useAppSelector } from '@/store/redux/hooks'

export function FloatingBottomBarLayoutClient({hidescan = false}: {hidescan: boolean}) {
  const cardMode = useAppSelector((s) => s.cardMode.cardMode)
  return (
    <FloatingBottomBar
    hideScan={hidescan}
      mode={cardMode}
    />
  )
}

export default FloatingBottomBarLayoutClient

