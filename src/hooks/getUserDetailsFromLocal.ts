'use client'

import type { UserData } from '@/types/userdata'

type UserDetailsFromLocal = {
  userId: string
  user: UserData | null
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  nationality: string
  stateOfOrigin: string
  lga: string
  residentialAddress: string
  registrationDate: string
  enrollmentBank: string
  photo: string
  livenessVerified: boolean
  kycCompleted: boolean
  watchListed: boolean
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

function safeParseUser(raw: string | null): UserData | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as UserData
    if (parsed && typeof parsed === 'object' && (parsed as any).data) return parsed
    return null
  } catch {
    return null
  }
}

export function getUserDetailsFromLocal(): UserDetailsFromLocal {
  if (typeof window === 'undefined') {
    return {
      userId: '1',
      user: null,
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      stateOfOrigin: '',
      lga: '',
      residentialAddress: '',
      registrationDate: '',
      enrollmentBank: '',
      photo: '',
      livenessVerified: false,
      kycCompleted: false,
      watchListed: false,
      bankDetails: null,
      bvnDetails: null,
      ninDetails: null,
    }
  }

  let userId = '1'
  let user: UserData | null = null

  try {
    userId = localStorage.getItem('active_user_id') ?? '1'

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
    userId = '1'
    user = null
  }

  const data = user?.data
  const name = data?.name ?? ''
  const email = data?.email ?? ''
  const phone = data?.phone_number ?? ''
  const dateOfBirth = data?.date_of_birth ?? ''
  const gender = data?.gender ?? ''
  const nationality = data?.nationality ?? ''
  const stateOfOrigin = data?.state_of_origin ?? ''
  const lga = data?.lga ?? ''
  const residentialAddress = data?.residential_address ?? ''
  const registrationDate = data?.registration_date ?? ''
  const enrollmentBank = data?.enrollment_bank ?? ''
  const photo = data?.photo ?? ''
  const livenessVerified = data?.LivenessVerified ?? false
  const kycCompleted = data?.kyc_completed ?? false
  const watchListed = data?.watch_listed ?? false

  const bankDetails = data?.bank_details
    ? {
        bankName: data.bank_details.bank_name ?? '',
        userName: data.bank_details.user_name ?? '',
        accountNumber: data.bank_details.account_number ?? '',
      }
    : null

  const bvnDetails = data?.bvn_details
    ? {
        number: data.bvn_details.number ?? '',
        name: data.bvn_details.name ?? '',
        address: data.bvn_details.address ?? '',
      }
    : null

  const ninDetails = data?.nin_details
    ? {
        number: data.nin_details.number ?? '',
        name: data.nin_details.name ?? '',
        address: data.nin_details.address ?? '',
      }
    : null

  return {
    userId,
    user,
    name,
    email,
    phone,
    dateOfBirth,
    gender,
    nationality,
    stateOfOrigin,
    lga,
    residentialAddress,
    registrationDate,
    enrollmentBank,
    photo,
    livenessVerified,
    kycCompleted,
    watchListed,
    bankDetails,
    bvnDetails,
    ninDetails,
  }
}
