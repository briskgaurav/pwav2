import { parseApiError } from '@/lib/verification'

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

export async function sendEmailRegistrationOtp(
  body: SendEmailRegistrationOtpRequest
): Promise<SendEmailRegistrationOtpResponse> {
  const res = await fetch('/api/email-registration/send-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await parseApiError(res))
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
  if (!res.ok) throw new Error(await parseApiError(res))
  return (await res.json()) as VerifyEmailRegistrationOtpResponse
}
