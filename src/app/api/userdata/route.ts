import { NextResponse } from 'next/server'

import userdataJson from '@/constants/userdata.json'

declare global {
   
  var __userdataOverrides: Map<
    number,
    { bvn?: string | null; nin?: string | null; date_of_birth?: string | null; kyc_completed?: boolean }
  > | undefined
}

function getOverrideStore() {
  if (!globalThis.__userdataOverrides) {
    globalThis.__userdataOverrides = new Map()
  }
  return globalThis.__userdataOverrides
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('id')
  if (!userId) {
    return NextResponse.json(userdataJson)
  }
  const parsedId = Number(userId)
  const user = userdataJson.users.find((u) => u.id === parsedId)

  if (!user) {
    return NextResponse.json(
      { status: false, message: 'User not found', code: 404 },
      { status: 404 }
    )
  }

  const overrides = getOverrideStore().get(parsedId)
  if (!overrides) return NextResponse.json(user)

  return NextResponse.json({
    ...user,
    data: {
      ...user.data,
      ...(overrides.date_of_birth !== undefined ? { date_of_birth: overrides.date_of_birth } : {}),
      ...(overrides.kyc_completed !== undefined ? { kyc_completed: overrides.kyc_completed } : {}),
      ...(overrides.bvn !== undefined
        ? {
            bvn_details:
              overrides.bvn === null
                ? null
                : {
                    number: overrides.bvn,
                    name: user.data.name,
                    address: user.data.residential_address,
                  },
          }
        : {}),
      ...(overrides.nin !== undefined
        ? {
            nin_details:
              overrides.nin === null
                ? null
                : {
                    number: overrides.nin,
                    name: user.data.name,
                    address: user.data.residential_address,
                  },
          }
        : {}),
    },
  })
}
