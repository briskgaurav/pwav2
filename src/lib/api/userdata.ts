import axios from 'axios'
import type { UserData } from '@/types/userdata'

export async function fetchUserData(userId: string): Promise<UserData> {
  const res = await axios.get<UserData>('/api/userdata', {
    params: { id: userId },
  })

  return res.data
}

