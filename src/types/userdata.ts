export type UserData = {
  id?: string
  status: boolean
  message: string
  code: number
  data: {
    bvn: string | null
    nin: string | null
    first_name: string
    middle_name: string
    last_name: string
    date_of_birth: string
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
