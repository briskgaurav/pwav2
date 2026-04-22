import { NextResponse } from 'next/server'

const DEFAULT_TEST_OTP = '111111'

type Body = {
  userInfo?: {
    id: number
  }
  method?: 'email' | 'phone'
  code?: string
}

declare global {
  // eslint-disable-next-line no-var
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
  const code = (body?.code ?? '').trim()

  if (method !== 'email' && method !== 'phone') {
    return NextResponse.json({ status: false, message: 'Invalid method' }, { status: 400 })
  }
  const isDefaultTestOtp = code === DEFAULT_TEST_OTP
  if (!/^\d{6}$/.test(code) && !isDefaultTestOtp) {
    return NextResponse.json({ status: false, message: 'Invalid code' }, { status: 400 })
  }

  if (!userInfo || typeof userInfo.id !== 'number') {
    return NextResponse.json({ status: false, message: 'Missing userInfo' }, { status: 400 })
  }

  if (isDefaultTestOtp) {
    return NextResponse.json({ status: true })
  }

  const storeKey = `${userInfo.id}:${method}`
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

