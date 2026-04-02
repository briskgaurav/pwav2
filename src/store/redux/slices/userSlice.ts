import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getUserDetailsFromLocal } from '@/hooks/getUserDetailsFromLocal'

export interface UserProfile {
  firstName: string
  lastName: string
  middleName: string
  email: string
  mobile: string
  bvn: string
  address: string
  dateOfBirth: string
  accountNumber: string
  bankName: string
  gender: string
  state: string
  city: string
}

type UserState = UserProfile & {
  fullName: string
  initials: string
  maskedEmail: string
  maskedMobile: string
  maskedBvn: string
  maskedDob: string
}

const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  const visibleChars = Math.min(4, Math.max(1, Math.floor(local.length * 0.4)))
  return `${local.slice(0, visibleChars)}***${local.slice(-1)}@${domain}`
}

const maskMobile = (mobile: string): string => {
  const digits = mobile.replace(/\D/g, '')
  if (digits.length < 8) return mobile
  return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} **** ${digits.slice(-4)}`
}

const maskBvn = (bvn: string): string => {
  const digits = bvn.replace(/\D/g, '')
  if (digits.length < 6) return bvn
  return `****${digits.slice(-7)}`
}

const maskDob = (dob: string): string => {
  const parts = dob.split(/[-/]/)
  if (parts.length < 3) return dob
  return `**/**/${parts[parts.length - 1]}`
}

const deriveFields = (profile: UserProfile): Omit<UserState, keyof UserProfile> => {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim()
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return {
    fullName,
    initials,
    maskedEmail: maskEmail(profile.email),
    maskedMobile: maskMobile(profile.mobile),
    maskedBvn: maskBvn(profile.bvn),
    maskedDob: maskDob(profile.dateOfBirth),
  }
}

function buildUserProfileFromVerifiedStorage(): UserProfile {
  const {
    name: firstName,
    email: userEmail,
    phone: userPhone,
    dateOfBirth,
    gender,
    stateOfOrigin,
    lga,
    residentialAddress,
    bankDetails,
    bvnDetails,
    ninDetails,
  } = getUserDetailsFromLocal()

  return {
    firstName,
    lastName: bvnDetails?.name?.split(' ').pop() ?? '',
    middleName: ninDetails?.name?.split(' ').slice(1, -1).join(' ') ?? '',
    email: userEmail,
    mobile: userPhone,
    bvn: bvnDetails?.number ?? '',
    address: residentialAddress,
    dateOfBirth,
    accountNumber: bankDetails?.accountNumber ?? '',
    bankName: bankDetails?.bankName ?? '',
    gender,
    state: stateOfOrigin,
    city: lga,
  }
}

function buildUserStateFromVerifiedStorage(): UserState {
  const profile = buildUserProfileFromVerifiedStorage()
  return {
    ...profile,
    ...deriveFields(profile),
  }
}

const initialState: UserState = buildUserStateFromVerifiedStorage()

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /** Re-read `active_user` / `user_{id}` and replace state (e.g. after KYC completion). */
    syncUserFromVerifiedStorage: () => buildUserStateFromVerifiedStorage(),
    setUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      const updated: UserProfile = {
        firstName: action.payload.firstName ?? state.firstName,
        lastName: action.payload.lastName ?? state.lastName,
        middleName: action.payload.middleName ?? state.middleName,
        email: action.payload.email ?? state.email,
        mobile: action.payload.mobile ?? state.mobile,
        bvn: action.payload.bvn ?? state.bvn,
        address: action.payload.address ?? state.address,
        dateOfBirth: action.payload.dateOfBirth ?? state.dateOfBirth,
        accountNumber: action.payload.accountNumber ?? state.accountNumber,
        bankName: action.payload.bankName ?? state.bankName,
        gender: action.payload.gender ?? state.gender,
        state: action.payload.state ?? state.state,
        city: action.payload.city ?? state.city,
      }
      return { ...updated, ...deriveFields(updated) }
    },
    clearUser: () => buildUserStateFromVerifiedStorage(),
  },
  selectors: {
    selectFirstName: (state) => state.firstName,
    selectFullName: (state) => state.fullName,
    selectInitials: (state) => state.initials,
    selectMaskedEmail: (state) => state.maskedEmail,
    selectMaskedMobile: (state) => state.maskedMobile,
    selectMaskedBvn: (state) => state.maskedBvn,
    selectMaskedDob: (state) => state.maskedDob,
    selectUserProfile: (state) => state,
  },
})

export const { setUser, clearUser, syncUserFromVerifiedStorage } = userSlice.actions
export const {
  selectFirstName,
  selectFullName,
  selectInitials,
  selectMaskedEmail,
  selectMaskedMobile,
  selectMaskedBvn,
  selectMaskedDob,
  selectUserProfile,
} = userSlice.selectors
export default userSlice.reducer
