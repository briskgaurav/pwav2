'use client'

import { useAppSelector } from '@/store/redux/hooks'

import FloatingBottomBar from './FloatingBottomBar'

type FloatingBottomBarLayoutClientProps = {
  hidescan?: boolean
  isFixed?: boolean
}

export function FloatingBottomBarLayoutClient({
  hidescan = false,
  isFixed = true,
}: FloatingBottomBarLayoutClientProps) {
  const cardMode = useAppSelector((s) => s.cardMode.cardMode)
  return (
    <FloatingBottomBar
      isFixed={isFixed}
      hideScan={hidescan}
      mode={cardMode}
    />
  )
}

export default FloatingBottomBarLayoutClient
