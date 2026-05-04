import { NextResponse } from 'next/server'

type Body = {
  id?: number
  bvn?: string | null
  nin?: string | null
  date_of_birth?: string | null
  kyc_completed?: boolean
}

declare global {
   
  var __userdataOverrides: Map<
    number,
    { bvn?: string | null; nin?: string | null; date_of_birth?: string | null; kyc_completed?: boolean }
  > | undefined
}

function getStore() {
  if (!globalThis.__userdataOverrides) {
    globalThis.__userdataOverrides = new Map()
  }
  return globalThis.__userdataOverrides
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null
  const id = body?.id
  const bvn = body?.bvn
  const nin = body?.nin
  const date_of_birth = body?.date_of_birth
  const kyc_completed = body?.kyc_completed

  if (typeof id !== 'number' || Number.isNaN(id)) {
    return NextResponse.json({ status: false, message: 'Missing id' }, { status: 400 })
  }

  if (bvn != null && !/^\d{11}$/.test(bvn)) {
    return NextResponse.json({ status: false, message: 'Invalid BVN' }, { status: 400 })
  }
  if (nin != null && !/^\d{11}$/.test(nin)) {
    return NextResponse.json({ status: false, message: 'Invalid NIN' }, { status: 400 })
  }

  if (date_of_birth != null && !/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth)) {
    return NextResponse.json({ status: false, message: 'Invalid DOB' }, { status: 400 })
  }

  if (kyc_completed != null && typeof kyc_completed !== 'boolean') {
    return NextResponse.json({ status: false, message: 'Invalid KYC' }, { status: 400 })
  }

  const existing = getStore().get(id) ?? {}
  getStore().set(id, {
    ...existing,
    ...(bvn !== undefined ? { bvn } : {}),
    ...(nin !== undefined ? { nin } : {}),
    ...(date_of_birth !== undefined ? { date_of_birth } : {}),
    ...(kyc_completed !== undefined ? { kyc_completed } : {}),
  })

  return NextResponse.json({ status: true })
}

