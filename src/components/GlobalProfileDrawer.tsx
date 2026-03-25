'use client'

import { ProfileDrawer } from '@/components/ProfileDrawer'
import { ProfileContent } from '@/components/screens/Drawers/ProfileContent'
import { useAppSelector, useAppDispatch } from '@/store/redux/hooks'
import { selectProfileDrawerVisible, closeProfileDrawer } from '@/store/redux/slices/profileDrawerSlice'
import { selectFullName } from '@/store/redux/slices/userSlice'

export default function GlobalProfileDrawer() {
  const dispatch = useAppDispatch()
  const visible = useAppSelector(selectProfileDrawerVisible)
  const fullName = useAppSelector(selectFullName)

  return (
    <ProfileDrawer visible={visible} onClose={() => dispatch(closeProfileDrawer())}>
      {(closeDrawer) => (
        <ProfileContent
          userName={fullName}
          onClose={closeDrawer}
        />
      )}
    </ProfileDrawer>
  )
}
