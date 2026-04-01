import type { UserData } from '@/types/userdata'

/** Minimal user identifiers needed to call verification APIs. */
export type UserInfo = {
  id: number
  email: string
  phone_number: string
}

/** The method chosen by the user for OTP delivery. */
export type IdVerificationMethod = 'email' | 'phone'

/** Shorthand for the full data block inside a UserData response. */
export type UserDetails = UserData['data']
