export type UserData = {
  id?: number
  status: boolean
  message: string
  code: number
  data: {
    name: string
    LivenessVerified: boolean
    kyc_completed?: boolean
    bvn_details: { number: string; name: string; address: string } | null
    nin_details: { number: string; name: string; address: string } | null
    bank_details: { bank_name: 'FCMB'; user_name: string; account_number: string; address: string }
    date_of_birth: string | null
    gender: string
    phone_number: string
    email: string
    nationality: string
    state_of_origin: string
    lga: string
    residential_address: string
    photo: string | null
    enrollment_bank: string | null
    registration_date: string | null
    watch_listed: boolean
  }
}
