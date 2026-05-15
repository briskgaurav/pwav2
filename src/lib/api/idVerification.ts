import { parseApiError } from '@/lib/verification'
import { fetchWithAuth } from './fetchWithAuth'
import type { UserInfo, IdVerificationMethod } from '@/lib/verification'

export type { UserInfo, IdVerificationMethod }

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

// New onboarding API types and functions

export type StartSessionRequest = {
  customerId: string
}

export type StartSessionResponse = {
  sessionId: string
}

export type LivenessRequest = {
  // Define based on what liveness data is sent, e.g., face image or liveness score
  livenessData: any // Placeholder
}

export type LivenessResponse = {
  success: boolean
  // Other response fields
}

export type NameMatchRequest = {
  bvn?: string
  nin?: string
  name: string
}

export type NameMatchResponse = {
  matched: boolean
  // Other fields
}

export type FaceMatchRequest = {
  faceImage: string // Base64 or blob
}

export type FaceMatchResponse = {
  matched: boolean
  confidence: number
}

export type ContactDetailsResponse = {
  email?: string
  phone?: string
}

export type SendIdentityOtpRequest = {
  contactType: 'email' | 'phone'
  contactValue: string
}

export type SendIdentityOtpResponse = {
  success: boolean
}

export type VerifyIdentityOtpRequest = {
  contactValue: string
  otp: string
}

export type VerifyIdentityOtpResponse = {
  success: boolean
}

export type SendRegistrationEmailOtpRequest = {
  email: string
}

export type SendRegistrationEmailOtpResponse = {
  success: boolean
  maskedEmail: string
}

export type VerifyRegistrationEmailOtpRequest = {
  email: string
  otp: string
}

export type VerifyRegistrationEmailOtpResponse = {
  success: boolean
}

export type FlowStateResponse = {
  currentStep: string
  // Other flow state
}

export type StatusResponse = {
  status: string
  // Other status fields
}

export type UpdateStatusRequest = {
  status: string
  // Other update fields
}

export type UpdateStatusResponse = {
  success: boolean
}

// API functions

export async function startOnboardingSession(body: StartSessionRequest): Promise<StartSessionResponse> {
  return fetchWithAuth<StartSessionResponse>('/api/v1/onboarding/start', {
    method: 'POST',
    json: body,
  })
}

export async function submitLiveness(sessionId: string, body: LivenessRequest): Promise<LivenessResponse> {
  return fetchWithAuth<LivenessResponse>(`/${sessionId}/liveness`, {
    method: 'POST',
    json: body,
  })
}

export async function submitNameMatch(sessionId: string, body: NameMatchRequest): Promise<NameMatchResponse> {
  return fetchWithAuth<NameMatchResponse>(`/${sessionId}/identity/name-match`, {
    method: 'POST',
    json: body,
  })
}

export async function submitFaceMatch(sessionId: string, body: FaceMatchRequest): Promise<FaceMatchResponse> {
  return fetchWithAuth<FaceMatchResponse>(`/${sessionId}/identity/face-match`, {
    method: 'POST',
    json: body,
  })
}

export async function getContactDetails(sessionId: string): Promise<ContactDetailsResponse> {
  return fetchWithAuth<ContactDetailsResponse>(`/${sessionId}/identity/contact-details`, {
    method: 'GET',
  })
}

export async function sendIdentityOtp(sessionId: string, body: SendIdentityOtpRequest): Promise<SendIdentityOtpResponse> {
  return fetchWithAuth<SendIdentityOtpResponse>(`/${sessionId}/identity/otp`, {
    method: 'POST',
    json: body,
  })
}

export async function verifyIdentityOtp(sessionId: string, body: VerifyIdentityOtpRequest): Promise<VerifyIdentityOtpResponse> {
  return fetchWithAuth<VerifyIdentityOtpResponse>(`/${sessionId}/identity/otp/verify`, {
    method: 'POST',
    json: body,
  })
}

export async function sendRegistrationEmailOtp(sessionId: string, body: SendRegistrationEmailOtpRequest): Promise<SendRegistrationEmailOtpResponse> {
  return fetchWithAuth<SendRegistrationEmailOtpResponse>(`/${sessionId}/registered-email/otp`, {
    method: 'POST',
    json: body,
  })
}

export async function verifyRegistrationEmailOtp(sessionId: string, body: VerifyRegistrationEmailOtpRequest): Promise<VerifyRegistrationEmailOtpResponse> {
  return fetchWithAuth<VerifyRegistrationEmailOtpResponse>(`/${sessionId}/registered-email/otp/verify`, {
    method: 'POST',
    json: body,
  })
}

export async function getFlowState(sessionId: string): Promise<FlowStateResponse> {
  return fetchWithAuth<FlowStateResponse>(`/${sessionId}/flow`, {
    method: 'GET',
  })
}

export async function getStatus(sessionId?: string): Promise<StatusResponse> {
  const url = sessionId ? `/${sessionId}/status` : '/status'
  return fetchWithAuth<StatusResponse>(url, {
    method: 'GET',
  })
}

export async function updateStatus(body: UpdateStatusRequest): Promise<UpdateStatusResponse> {
  return fetchWithAuth<UpdateStatusResponse>('/status', {
    method: 'POST',
    json: body,
  })
}

// Existing functions

export async function sendIdVerificationOtp(body: SendOtpRequest): Promise<SendOtpResponse> {
  const res = await fetch('/api/id-verification/send-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await parseApiError(res))
  return (await res.json()) as SendOtpResponse
}

export async function verifyIdVerificationOtp(body: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  const res = await fetch('/api/id-verification/verify-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await parseApiError(res))
  return (await res.json()) as VerifyOtpResponse
}
