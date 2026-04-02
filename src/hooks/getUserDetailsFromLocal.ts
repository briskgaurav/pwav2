'use client'

import type { UserData } from '@/types/userdata'

/** Shape used app-wide — sourced from localStorage after identity verification (`active_user`). */
export type VerifiedUserSnapshot = {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  stateOfOrigin: string
  lga: string
  residentialAddress: string
  bankDetails: {
    bankName: string
    userName: string
    accountNumber: string
  } | null
  bvnDetails: {
    number: string
    name: string
    address: string
  } | null
  ninDetails: {
    number: string
    name: string
    address: string
  } | null
}

function emptySnapshot(): VerifiedUserSnapshot {
  return {
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    stateOfOrigin: '',
    lga: '',
    residentialAddress: '',
    bankDetails: null,
    bvnDetails: null,
    ninDetails: null,
  }
}

function safeParseUser(raw: string | null): UserData | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as UserData
    if (parsed && typeof parsed === 'object' && (parsed as unknown as { data?: unknown }).data) return parsed
    return null
  } catch {
    return null
  }
}

function snapshotFromUserData(user: UserData | null): VerifiedUserSnapshot {
  if (!user?.data) return emptySnapshot()

  const data = user.data
  const bankDetails = data.bank_details
    ? {
        bankName: data.bank_details.bank_name ?? '',
        userName: data.bank_details.user_name ?? '',
        accountNumber: data.bank_details.account_number ?? '',
      }
    : null

  const bvnDetails = data.bvn_details
    ? {
        number: data.bvn_details.number ?? '',
        name: data.bvn_details.name ?? '',
        address: data.bvn_details.address ?? '',
      }
    : null

  const ninDetails = data.nin_details
    ? {
        number: data.nin_details.number ?? '',
        name: data.nin_details.name ?? '',
        address: data.nin_details.address ?? '',
      }
    : null

  return {
    name: data.name ?? '',
    email: data.email ?? '',
    phone: data.phone_number ?? '',
    dateOfBirth: data.date_of_birth ?? '',
    gender: data.gender ?? '',
    stateOfOrigin: data.state_of_origin ?? '',
    lga: data.lga ?? '',
    residentialAddress: data.residential_address ?? '',
    bankDetails,
    bvnDetails,
    ninDetails,
  }
}

/**
 * Reads verified user profile saved after the identity-verification / KYC flow
 * (`active_user`, `user_{id}` in localStorage).
 */
export function getUserDetailsFromLocal(): VerifiedUserSnapshot {
  if (typeof window === 'undefined') {
    return emptySnapshot()
  }

  let user: UserData | null = null

  try {
    const userId = localStorage.getItem('active_user_id') ?? '1'
    const fromActive = safeParseUser(localStorage.getItem('active_user'))
    if (fromActive) {
      user = fromActive
    } else {
      const fromById = safeParseUser(localStorage.getItem(`user_${userId}`))
      if (fromById) {
        user = fromById
      }
    }
  } catch {
    user = null
  }

  return snapshotFromUserData(user)
}
