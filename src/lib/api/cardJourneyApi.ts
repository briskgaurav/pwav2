/**
 * New-contract card API calls.
 *
 * Every function here returns `CardRequestStateResponse` — the universal
 * envelope the backend sends. Callers feed the result into `useCardJourney.call()`
 * which dispatches it into Redux. Screen routing happens automatically via
 * `response.nextAction.code`.
 *
 * Legacy card API functions are still in `./cards.ts` and can be removed
 * once all screens are migrated.
 */

import { MOCK_HOST_CONTEXT } from './__mocks__/hostContext';
import { fetchWithAuth } from './fetchWithAuth';
import type { CardRequestStateResponse, CreateCardRequest } from '@/types/cardIssuance';

// ─── POST /api/v1/card/request ─────────────────────────────────────────────

/**
 * Initiate a new card request.
 * Generates an Idempotency-Key automatically.
 */
export async function createCardRequest(
  input: Omit<CreateCardRequest, 'issuerBankCode' | 'country' | 'mobileAppUserId' | 'customerId' | 'customerName' | 'bvn' | 'nin'> & Partial<CreateCardRequest>,
): Promise<CardRequestStateResponse> {
  const payload: CreateCardRequest = {
    issuerBankCode: MOCK_HOST_CONTEXT.issuerBankCode,
    country: MOCK_HOST_CONTEXT.country,
    mobileAppUserId: MOCK_HOST_CONTEXT.mobileAppUserId,
    customerId: MOCK_HOST_CONTEXT.customerId,
    customerName: MOCK_HOST_CONTEXT.customerName,
    bvn: MOCK_HOST_CONTEXT.bvn,
    nin: MOCK_HOST_CONTEXT.nin,
    ...input,
  };

  return fetchWithAuth<CardRequestStateResponse>('/api/v1/card/request', {
    method: 'POST',
    headers: { 'Idempotency-Key': crypto.randomUUID() },
    json: payload,
  });
  
}

// ─── Email OTP ─────────────────────────────────────────────────────────────

export async function verifyEmailOtpV2(
  requestId: string,
  otp: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>('/api/v1/card/email-otp/verify', {
    method: 'POST',
    json: { requestId, otp },
  });
}

export async function retryEmailOtp(
  requestId: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>('/api/v1/card/email-otp/retry', {
    method: 'POST',
    json: { requestId },
  });
}

// ─── Bank OTP ──────────────────────────────────────────────────────────────

export async function sendBankOtpV2(
  requestId: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>('/api/v1/card/bank-otp/send', {
    method: 'POST',
    json: { requestId },
  });
}

export async function retryBankOtp(
  requestId: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>('/api/v1/card/bank-otp/retry', {
    method: 'POST',
    json: { requestId },
  });
}

export async function verifyBankOtpV2(
  requestId: string,
  otp: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>('/api/v1/card/bank-otp/verify', {
    method: 'POST',
    json: { requestId, otp },
  });
}

// ─── Soft Token ────────────────────────────────────────────────────────────

export async function verifySoftTokenV2(
  requestId: string,
  softToken: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>('/api/v1/card/soft-token/verify', {
    method: 'POST',
    json: { requestId, softToken },
  });
}

// ─── Consent ───────────────────────────────────────────────────────────────

export async function submitConsentV2(
  requestId: string,
  consentVersion: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>('/api/v1/card-issuance/consent', {
    method: 'POST',
    json: { requestId, consentVersion, accepted: true },
  });
}

// ─── PIN setup ─────────────────────────────────────────────────────────────

export async function setupPin(
  requestId: string,
  pin: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>('/api/v1/card-issuance/virtual-card/pin', {
    method: 'POST',
    json: { requestId, pin },
  });
}

// ─── Resume / poll ─────────────────────────────────────────────────────────

export async function resumeRequest(
  requestId: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>(`/api/v1/card/${requestId}/resume`, {
    method: 'POST',
  });
}

// ─── Gift card ─────────────────────────────────────────────────────────────

export interface GiftRecipientDetailsInput {
  recipientName: string;
  recipientEmail: string;
  giftMessage?: string;
  giftAmountMinor: number;
  giftCurrency: string;
}

export async function submitGiftRecipientDetails(
  requestId: string,
  input: GiftRecipientDetailsInput,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>(
    `/api/v1/card/${requestId}/gift/recipient-details`,
    { method: 'POST', json: input },
  );
}

export async function submitGiftRecipientCode(
  requestId: string,
  code: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>(
    `/api/v1/card/${requestId}/gift/recipient-code`,
    { method: 'POST', json: { code } },
  );
}

export async function submitGiftSenderCode(
  requestId: string,
  code: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>(
    `/api/v1/card/${requestId}/gift/sender-code`,
    { method: 'POST', json: { code } },
  );
}

export async function regenerateGiftSenderCode(
  requestId: string,
): Promise<CardRequestStateResponse> {
  return fetchWithAuth<CardRequestStateResponse>(
    `/api/v1/card/${requestId}/gift/sender-code/regenerate`,
    { method: 'POST' },
  );
}
