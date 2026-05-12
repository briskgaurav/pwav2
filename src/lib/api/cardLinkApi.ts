import { CardLinkStateResponse, InitiateLinkRequest } from '@/types/cardLinking';
import { MOCK_HOST_CONTEXT } from './__mocks__/hostContext';
import { fetchWithAuth } from './fetchWithAuth';
// import type { CardLinkStateResponse, InitiateLinkRequest } from '@/types/cardLinking';

// ─── POST /api/v1/card-link/initiate ────────────────────────────────────────

/**
 * Start a new link request.
 * Generates an Idempotency-Key automatically.
 *
 * @param vcCardId - Present for journeys A/B; absent for journey C (standalone UC).
 */
export async function initiateCardLink(
  vcCardId?: string,
): Promise<CardLinkStateResponse> {
  const payload: InitiateLinkRequest = {
    issuerBankCode: MOCK_HOST_CONTEXT.issuerBankCode,
    country: MOCK_HOST_CONTEXT.country,
    mobileAppUserId: MOCK_HOST_CONTEXT.mobileAppUserId,
    customerId: MOCK_HOST_CONTEXT.customerId,
    customerName: MOCK_HOST_CONTEXT.customerName,
    bvn: MOCK_HOST_CONTEXT.bvn,
    nin: MOCK_HOST_CONTEXT.nin,
    ...(vcCardId ? { vcCardId } : {}),
  };

  return fetchWithAuth<CardLinkStateResponse>('/api/v1/card-link/initiate', {
    method: 'POST',
    headers: { 'Idempotency-Key': crypto.randomUUID() },
    json: payload,
  });
}

// ─── Verify VC PIN ─────────────────────────────────────────────────────────

export async function verifyVcPin(
  requestId: string,
  pin: string,
  vcCardId?: string,
): Promise<CardLinkStateResponse> {
  return fetchWithAuth<CardLinkStateResponse>(
    `/api/v1/card-link/${requestId}/verify-vc-pin`,
    {
      method: 'POST',
      json: {
        pin,
        ...(vcCardId ? { vcCardId } : {}),
      },
    },
  );
}

// ─── Select an existing UC (journey A) ─────────────────────────────────────

export async function selectUc(
  requestId: string,
  ucCardId: string,
): Promise<CardLinkStateResponse> {
  return fetchWithAuth<CardLinkStateResponse>(
    `/api/v1/card-link/${requestId}/select-uc`,
    {
      method: 'POST',
      json: { ucCardId },
    },
  );
}

// ─── Verify UC PIN ─────────────────────────────────────────────────────────

export async function verifyUcPin(
  requestId: string,
  pin: string,
): Promise<CardLinkStateResponse> {
  return fetchWithAuth<CardLinkStateResponse>(
    `/api/v1/card-link/${requestId}/verify-uc-pin`,
    {
      method: 'POST',
      json: { pin },
    },
  );
}

// ─── Provide UC PAN (journeys B + C) ──────────────────────────────────────

/**
 * Submit the full UC PAN. The server discards it immediately after processing.
 * **Clear the input and any in-memory copies after this call returns.**
 */
export async function provideUcPan(
  requestId: string,
  ucPanFull: string,
): Promise<CardLinkStateResponse> {
  return fetchWithAuth<CardLinkStateResponse>(
    `/api/v1/card-link/${requestId}/provide-uc-pan`,
    {
      method: 'POST',
      json: { ucPanFull },
    },
  );
}

// ─── Set up new UC PIN ─────────────────────────────────────────────────────

export async function setupUcPin(
  requestId: string,
  pin: string,
): Promise<CardLinkStateResponse> {
  return fetchWithAuth<CardLinkStateResponse>(
    `/api/v1/card-link/${requestId}/setup-uc-pin`,
    {
      method: 'POST',
      json: { pin },
    },
  );
}

// ─── Select a VC (journey C only) ──────────────────────────────────────────

export async function selectVc(
  requestId: string,
  vcCardId: string,
): Promise<CardLinkStateResponse> {
  return fetchWithAuth<CardLinkStateResponse>(
    `/api/v1/card-link/${requestId}/select-vc`,
    {
      method: 'POST',
      json: { vcCardId },
    },
  );
}

// ─── Resume / poll ─────────────────────────────────────────────────────────

/**
 * Returns the current state envelope. Use when:
 * - Re-opening the app on a non-terminal request
 * - The rare `SHOW_LINK_PROCESSING` state appears
 */
export async function resumeCardLink(
  requestId: string,
): Promise<CardLinkStateResponse> {
  return fetchWithAuth<CardLinkStateResponse>(
    `/api/v1/card-link/${requestId}/resume`,
    {
      method: 'POST',
    },
  );
}