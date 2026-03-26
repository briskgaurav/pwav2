import { NextResponse } from 'next/server'
import userdataJson from '@/constants/userdata.json'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('id')
  if (!userId) {
    return NextResponse.json(userdataJson)
  }
  const user = userdataJson.users.find((u) => u.id === userId)

  if (!user) {
    return NextResponse.json(
      { status: false, message: 'User not found', code: 404 },
      { status: 404 }
    )
  }
  return NextResponse.json(user)
}
