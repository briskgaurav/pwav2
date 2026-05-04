import { useEffect, useState } from 'react'

import { fetchUserData } from '@/lib/api/userdata'
import type { UserData } from '@/types/userdata'

export function useUserData(userId: string) {
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchUserData(userId)
        if (mounted) setData(res)
      } catch {
        if (mounted) setError('Failed to fetch user data')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [userId])

  return { data, loading, error }
}

