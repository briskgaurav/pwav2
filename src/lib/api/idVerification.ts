export type IdVerificationMethod = 'email' | 'phone'

export type UserInfo = {
  id: number
  email: string
  phone_number: string
}

export type SendOtpRequest = {
  userInfo: UserInfo
  method: IdVerificationMethod
  destination: string
}

export type SendOtpResponse = {
  status: true
  maskedDestination: string
}

export type VerifyOtpRequest = {
  userInfo: Pick<UserInfo, 'id'>
  method: IdVerificationMethod
  code: string
}

export type VerifyOtpResponse = {
  status: true
}

async function parseError(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as { message?: string }
    if (json?.message) return json.message
  } catch {
    // ignore
  }
  return 'Something went wrong'
}

export async function sendIdVerificationOtp(body: SendOtpRequest): Promise<SendOtpResponse> {
  const res = await fetch('/api/id-verification/send-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(await parseError(res))
  }

  return (await res.json()) as SendOtpResponse
}

export async function verifyIdVerificationOtp(body: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  const res = await fetch('/api/id-verification/verify-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(await parseError(res))
  }

  return (await res.json()) as VerifyOtpResponse
}

