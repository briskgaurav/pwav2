import { NextResponse } from 'next/server'

const DEFAULT_TEST_OTP = '111111'

type Body = {
  userId?: number
  newEmail?: string
  code?: string
}

declare global {
  // eslint-disable-next-line no-var
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
  const code = (body?.code ?? '').trim()

  if (typeof userId !== 'number' || Number.isNaN(userId)) {
    return NextResponse.json({ status: false, message: 'Missing userId' }, { status: 400 })
  }
  if (!newEmail) {
    return NextResponse.json({ status: false, message: 'Missing email' }, { status: 400 })
  }
  const isDefaultTestOtp = process.env.NODE_ENV !== 'production' && code === DEFAULT_TEST_OTP
  if (!/^\d{6}$/.test(code) && !isDefaultTestOtp) {
    return NextResponse.json({ status: false, message: 'Invalid code' }, { status: 400 })
  }

  if (isDefaultTestOtp) {
    return NextResponse.json({ status: true })
  }

  const storeKey = `${userId}:${newEmail}`
  const expected = getStore().get(storeKey)
  if (!expected) {
    return NextResponse.json({ status: false, message: 'Code expired' }, { status: 400 })
  }
  if (code !== expected) {
    return NextResponse.json({ status: false, message: 'Wrong code' }, { status: 400 })
  }

  getStore().delete(storeKey)
  return NextResponse.json({ status: true })
}

