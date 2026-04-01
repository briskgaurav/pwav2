import type { UserData } from '@/types/userdata'

export async function fetchUserData(userId: string): Promise<UserData> {
  const res = await fetch(`/api/userdata?id=${encodeURIComponent(userId)}`)

  if (!res.ok) {
    throw new Error(`Failed to fetch user data: ${res.status}`)
  }

  return res.json() as Promise<UserData>
}

export async function setUserBvnNinOverride(body: {
  id: number
  bvn?: string | null
  nin?: string | null
  date_of_birth?: string | null
  kyc_completed?: boolean
}): Promise<{ status: true }> {
  const res = await fetch('/api/userdata/override', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Failed to update user: ${res.status}`)
  }

  return res.json() as Promise<{ status: true }>
}
