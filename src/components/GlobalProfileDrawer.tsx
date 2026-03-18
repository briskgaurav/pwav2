'use client'

import { ProfileDrawer } from '@/components/ProfileDrawer'
import { ProfileContent } from '@/components/ProfileDrawer/ProfileContent'
import { useProfileDrawerStore } from '@/store/useProfileDrawerStore'
import { useUserStore } from '@/store/useUserStore'

export default function GlobalProfileDrawer() {
  const visible = useProfileDrawerStore((s) => s.visible)
  const close = useProfileDrawerStore((s) => s.close)
  const fullName = useUserStore((s) => s.fullName)

  return (
    <ProfileDrawer visible={visible} onClose={close}>
      {(closeDrawer) => (
        <ProfileContent
          userName={fullName}
          onClose={closeDrawer}
        />
      )}
    </ProfileDrawer>
  )
}
