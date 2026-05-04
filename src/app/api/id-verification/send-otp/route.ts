import { NextResponse } from 'next/server'

function maskEmail(email: string) {
  const [local, domain] = email.split('@')
  if (!domain) return '***'
  const first = local?.[0] ?? '*'
  return `${first}***@${domain}`
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 4) return '***'
  return `+${digits.slice(0, 3)} *** *** ${digits.slice(-4)}`
}

function generateOtp() {
  return `${Math.floor(100000 + Math.random() * 900000)}`
}

type Body = {
  userInfo?: {
    id: number
    email: string
    phone_number: string
  }
  method?: 'email' | 'phone'
  destination?: string
}

declare global {
   
  var __idVerificationOtpStore: Map<string, string> | undefined
}

function getStore() {
  if (!globalThis.__idVerificationOtpStore) {
    globalThis.__idVerificationOtpStore = new Map()
  }
  return globalThis.__idVerificationOtpStore
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null
  const userInfo = body?.userInfo
  const method = body?.method
  const destination = (body?.destination ?? '').trim().toLowerCase()

  if (method !== 'email' && method !== 'phone') {
    return NextResponse.json({ status: false, message: 'Invalid method' }, { status: 400 })
  }
  if (!destination) {
    return NextResponse.json({ status: false, message: 'Enter value' }, { status: 400 })
  }

  if (!userInfo || typeof userInfo.id !== 'number') {
    return NextResponse.json({ status: false, message: 'Missing userInfo' }, { status: 400 })
  }

  const expected =
    method === 'email'
      ? (userInfo.email ?? '').toLowerCase()
      : (userInfo.phone_number ?? '').replace(/\D/g, '')
  const provided = method === 'email' ? destination : destination.replace(/\D/g, '')

  if (provided !== expected) {
    return NextResponse.json(
      { status: false, message: method === 'email' ? 'Invalid email' : 'Invalid phone' },
      { status: 400 }
    )
  }

  const otp = generateOtp()
  const storeKey = `${userInfo.id}:${method}`
  getStore().set(storeKey, otp)

  // Intentionally log OTP for dev/testing.
  // eslint-disable-next-line no-console
  console.log(`[ID Verification OTP] userId=${userInfo.id} method=${method} otp=${otp}`)

  const maskedDestination =
    method === 'email' ? maskEmail(userInfo.email) : maskPhone(userInfo.phone_number)
  return NextResponse.json({ status: true, maskedDestination })
}

