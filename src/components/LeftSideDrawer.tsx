'use client'

import { ReactNode } from 'react'
import { ProfileDrawer } from '@/components/ProfileDrawer'

type LeftSideDrawerProps = {
  visible: boolean
  onClose: () => void
  children?: ReactNode
}

export default function LeftSideDrawer({ visible, onClose, children }: LeftSideDrawerProps) {
  return (
    <ProfileDrawer visible={visible} onClose={onClose} side="left">
      {children ?? <div className="h-full" />}
    </ProfileDrawer>
  )
}

