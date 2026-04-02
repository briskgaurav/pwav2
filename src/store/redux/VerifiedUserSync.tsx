'use client'

import { useEffect } from 'react'
import { useAppDispatch } from '@/store/redux/hooks'
import { syncUserFromVerifiedStorage } from '@/store/redux/slices/userSlice'

/** Keeps the user slice aligned with verified data in localStorage (set after KYC). */
export function VerifiedUserSync() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(syncUserFromVerifiedStorage())
  }, [dispatch])
  return null
}
