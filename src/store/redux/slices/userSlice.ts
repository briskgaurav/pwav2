import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

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

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!local || !domain) return email
  const visible = Math.min(4, Math.max(1, Math.floor(local.length * 0.4)))
  return `${local.slice(0, visible)}***${local.slice(-1)}@${domain}`
}

function maskMobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, '')
  if (digits.length < 8) return mobile
  return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} **** ${digits.slice(-4)}`
}

function maskBvn(bvn: string): string {
  const digits = bvn.replace(/\D/g, '')
  if (digits.length < 6) return bvn
  return `****${digits.slice(-7)}`
}

function maskDob(dob: string): string {
  const parts = dob.split(/[-/]/)
  if (parts.length < 3) return dob
  return `**/**/` + parts[parts.length - 1]
}

function deriveFields(profile: UserProfile) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim()
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
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

const DEFAULT_PROFILE: UserProfile = {
  firstName: 'Nirdesh',
  lastName: 'Malik',
  middleName: 'Nirdesh',
  email: 'nirdeshmalik@gmail.com',
  mobile: '+2340000000000',
  bvn: '12345678901',
  address: 'Lagos, Nigeria',
  dateOfBirth: '1990-06-15',
  accountNumber: '0123456789',
  bankName: 'FCMB',
  gender: 'Male',
  state: 'Lagos',
  city: 'Ikeja',
}

type UserState = UserProfile & {
  fullName: string
  initials: string
  maskedEmail: string
  maskedMobile: string
  maskedBvn: string
  maskedDob: string
}

const initialState: UserState = {
  ...DEFAULT_PROFILE,
  ...deriveFields(DEFAULT_PROFILE),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
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
      const derived = deriveFields(updated)
      return { ...updated, ...derived }
    },
    clearUser: () => initialState,
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

export const { setUser, clearUser } = userSlice.actions
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
