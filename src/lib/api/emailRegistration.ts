export type SendEmailRegistrationOtpRequest = {
  userId: number
  newEmail: string
}

export type SendEmailRegistrationOtpResponse = {
  status: true
  maskedEmail: string
}

export type VerifyEmailRegistrationOtpRequest = {
  userId: number
  newEmail: string
  code: string
}

export type VerifyEmailRegistrationOtpResponse = {
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

export async function sendEmailRegistrationOtp(
  body: SendEmailRegistrationOtpRequest
): Promise<SendEmailRegistrationOtpResponse> {
  const res = await fetch('/api/email-registration/send-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return (await res.json()) as SendEmailRegistrationOtpResponse
}

export async function verifyEmailRegistrationOtp(
  body: VerifyEmailRegistrationOtpRequest
): Promise<VerifyEmailRegistrationOtpResponse> {
  const res = await fetch('/api/email-registration/verify-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return (await res.json()) as VerifyEmailRegistrationOtpResponse
}

