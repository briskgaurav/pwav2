import { NextResponse } from 'next/server'

function generateOtp() {
  return `${Math.floor(100000 + Math.random() * 900000)}`
}

function maskEmail(email: string) {
  const value = (email ?? '').trim().toLowerCase()
  const [local, domain] = value.split('@')
  if (!local || !domain) return ''
  return `${local[0]}***@${domain}`
}

type Body = {
  userId?: number
  newEmail?: string
}

declare global {
   
  var __emailRegistrationOtpStore: Map<string, string> | undefined
}

function getStore() {
  if (!globalThis.__emailRegistrationOtpStore) {
    globalThis.__emailRegistrationOtpStore = new Map()
  }
  return globalThis.__emailRegistrationOtpStore
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null
  const userId = body?.userId
  const newEmail = (body?.newEmail ?? '').trim().toLowerCase()

  if (typeof userId !== 'number' || Number.isNaN(userId)) {
    return NextResponse.json({ status: false, message: 'Missing userId' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    return NextResponse.json({ status: false, message: 'Invalid email' }, { status: 400 })
  }

  const otp = generateOtp()
  const storeKey = `${userId}:${newEmail}`
  getStore().set(storeKey, otp)

  // eslint-disable-next-line no-console
  console.log(`[Email Registration OTP] userId=${userId} email=${newEmail} otp=${otp}`)

  return NextResponse.json({ status: true, maskedEmail: maskEmail(newEmail) })
}

