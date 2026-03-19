import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

interface UserStoreState extends UserProfile {
  /** "FirstName LastName" */
  fullName: string
  /** First-letter initials, e.g. "NM" */
  initials: string
  /** e.g. "nird***malik@gmail.com" */
  maskedEmail: string
  /** e.g. "+234 802 **** 0955" */
  maskedMobile: string
  /** e.g. "****5678901" */
  maskedBvn: string
  /** e.g. "**\/**\/1990" */
  maskedDob: string

  setUser: (profile: Partial<UserProfile>) => void
  clearUser: () => void
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

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      ...DEFAULT_PROFILE,
      ...deriveFields(DEFAULT_PROFILE),

      setUser: (partial) =>
        set((state) => {
          const updated: UserProfile = {
            firstName: partial.firstName ?? state.firstName,
            lastName: partial.lastName ?? state.lastName,
            middleName: partial.middleName ?? state.middleName,
            email: partial.email ?? state.email,
            mobile: partial.mobile ?? state.mobile,
            bvn: partial.bvn ?? state.bvn,
            address: partial.address ?? state.address,
            dateOfBirth: partial.dateOfBirth ?? state.dateOfBirth,
            accountNumber: partial.accountNumber ?? state.accountNumber,
            bankName: partial.bankName ?? state.bankName,
            gender: partial.gender ?? state.gender,
            state: partial.state ?? state.state,
            city: partial.city ?? state.city,
          }
          return { ...updated, ...deriveFields(updated) }
        }),

      clearUser: () =>
        set({ ...DEFAULT_PROFILE, ...deriveFields(DEFAULT_PROFILE) }),
    }),
    { name: 'user-profile' }
  )
)
