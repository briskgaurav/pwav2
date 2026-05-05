/**
 * Card-related backend calls. Every function here goes through `fetchWithAuth`
 * — never call `fetch` directly from feature code.
 *
 * @remarks
 * Every endpoint in this file currently requires a chunk of host-supplied
 * identity (BVN, NIN, customerId, etc.) that the backend should be looking
 * up from the authenticated session. Until that change ships, the values
 * come from {@link MOCK_HOST_CONTEXT} — delete that file and trim the
 * spread in each call site once the backend stops asking.
 */

import { MOCK_HOST_CONTEXT } from './__mocks__/hostContext';
import { fetchWithAuth } from './fetchWithAuth';

// ─── /card/request ─────────────────────────────────────────────────────────

/** Request body accepted by `POST /api/v1/card/request`. */
export interface RequestCardInput {
  /** Selected card variant (debit, credit, prepaid, gift). */
  cardType: string;
  /** Funding account. May move to backend lookup later. */
  accountNumber?: string;
  // ── Fields below are mocked from host context — see __mocks__/hostContext.ts ──
  issuerBankCode?: string;
  country?: string;
  mobileAppUserId?: string;
  customerId?: string;
  customerName?: string;
  bvn?: string;
  nin?: string;
}

/** Response returned by `POST /api/v1/card/request`. */
export interface RequestCardResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  registeredEmail: string;
  otpStatus: string;
}

/**
 * Initiate a new card request. Returns a `requestId` plus the registered
 * email and OTP status to drive the next verification step.
 */
export async function requestCard(input: RequestCardInput): Promise<RequestCardResponse> {
  const payload: Required<RequestCardInput> = {
    ...MOCK_HOST_CONTEXT,
    ...input,
    accountNumber: input.accountNumber ?? MOCK_HOST_CONTEXT.accountNumber,
  };

  return fetchWithAuth<RequestCardResponse>('/api/v1/card/request', {
    method: 'POST',
    json: payload,
  });
}

// ─── /card/email-otp/verify ────────────────────────────────────────────────

/** Input for `POST /api/v1/card/email-otp/verify`. */
export interface VerifyEmailOtpInput {
  requestId: string;
  registeredEmail: string;
  otp: string;
}

/**
 * Response from `POST /api/v1/card/email-otp/verify`.
 *
 * @remarks
 * The bank-OTP destination is delivered as a single pre-masked string plus
 * a channel discriminator. Frontend never sees the raw email/phone — that
 * masking is the backend's responsibility (PII minimisation).
 */
export interface VerifyEmailOtpResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  registeredEmail: string;
  otpMatchStatus: string;
  /** Already-masked destination, e.g. `"+91 *** *** 0414"` or `"t***@example.com"`. */
  bankOtpDestination: string;
  /** Which channel the bank used to deliver the OTP. */
  bankOtpChannel: 'EMAIL' | 'PHONE';
  bankOtpStatus: string;
}

/**
 * Verify the OTP sent to the user's registered email.
 * Throws on `400` (invalid OTP) — caller can show "Invalid code" to the user.
 */
export async function verifyEmailOtp(input: VerifyEmailOtpInput): Promise<VerifyEmailOtpResponse> {
  return fetchWithAuth<VerifyEmailOtpResponse>('/api/v1/card/email-otp/verify', {
    method: 'POST',
    json: { ...MOCK_HOST_CONTEXT, ...input },
  });
}

// ─── /card/bank-otp/send ───────────────────────────────────────────────────

/** Input for `POST /api/v1/card/bank-otp/send`. */
export interface SendBankOtpInput {
  requestId: string;
}

/**
 * Response from `POST /api/v1/card/bank-otp/send`.
 * Same `bankOtpDestination` + `bankOtpChannel` shape as the email-OTP-verify
 * response — see {@link VerifyEmailOtpResponse} for the rationale.
 */
export interface SendBankOtpResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  bankOtpDestination: string;
  bankOtpChannel: 'EMAIL' | 'PHONE';
  otpStatus: string;
}

/**
 * Trigger the bank to send an OTP to the customer. Called automatically
 * after `verifyEmailOtp` succeeds, and again on the bank-OTP screen
 * "Resend" action.
 */
export async function sendBankOtp(input: SendBankOtpInput): Promise<SendBankOtpResponse> {
  return fetchWithAuth<SendBankOtpResponse>('/api/v1/card/bank-otp/send', {
    method: 'POST',
    json: { ...MOCK_HOST_CONTEXT, ...input },
  });
}

// ─── /card/bank-otp/verify ─────────────────────────────────────────────────

/** Input for `POST /api/v1/card/bank-otp/verify`. */
export interface VerifyBankOtpInput {
  requestId: string;
  otp: string;
}

/** Response from `POST /api/v1/card/bank-otp/verify`. */
export interface VerifyBankOtpResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  otpMatchStatus: string;
}

/**
 * Verify the OTP sent by the bank.
 * Throws on `400` (invalid OTP) — caller can show "Invalid code" to the user.
 */
export async function verifyBankOtp(input: VerifyBankOtpInput): Promise<VerifyBankOtpResponse> {
  return fetchWithAuth<VerifyBankOtpResponse>('/api/v1/card/bank-otp/verify', {
    method: 'POST',
    json: { ...MOCK_HOST_CONTEXT, ...input },
  });
}

// ─── /card/soft-token/verify ───────────────────────────────────────────────

/** Input for `POST /api/v1/card/soft-token/verify`. */
export interface VerifySoftTokenInput {
  requestId: string;
  /** 6-digit code generated by the bank's authenticator app on the user's device. */
  softToken: string;
}

/** Response from `POST /api/v1/card/soft-token/verify`. */
export interface VerifySoftTokenResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  softTokenVerificationStatus: string;
}

/**
 * Verify a soft token generated locally on the user's device by the bank's
 * authenticator app. Distinct from {@link verifyBankOtp}: there is no
 * server-side send (the token is generated on-device), so no `/send` call,
 * no destination, no resend.
 *
 * Throws on `400` (invalid token) — caller can show "Invalid code" to the user.
 */
export async function verifyBankSoftToken(
  input: VerifySoftTokenInput,
): Promise<VerifySoftTokenResponse> {
  return fetchWithAuth<VerifySoftTokenResponse>('/api/v1/card/soft-token/verify', {
    method: 'POST',
    json: { ...MOCK_HOST_CONTEXT, ...input },
  });
}

// ─── /card-issuance/credit/underwriting ────────────────────────────────────

/** Card variant accepted by the credit-underwriting endpoint. */
export type CreditCardTypeRequest = 'CREDIT_CARD';

/** Decision returned by the credit-underwriting endpoint. */
export type UnderwritingDecision = 'APPROVED' | 'REJECTED';

/** Input for `POST /api/v1/card-issuance/credit/underwriting`. */
export interface CreditUnderwritingInput {
  requestId: string;
  cardTypeRequest: CreditCardTypeRequest;
}

/** Response from `POST /api/v1/card-issuance/credit/underwriting`. */
export interface CreditUnderwritingResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  cardTypeRequest: CreditCardTypeRequest;
  underwritingDecision: UnderwritingDecision;
  approvedCreditLimit: number;
  cardIssuanceFee: number;
  cardMaintenanceFee: number;
  cardMaintenanceFrequency: string;
  revolvingBalanceMonthlyCharge: number;
}

/**
 * Run credit underwriting for the in-flight card request.
 * Returns either `APPROVED` (with limit + fees) or `REJECTED`.
 *
 * @param input    - Underwriting payload (requestId + card type).
 * @param options  - Optional `signal` to cancel an in-flight call (e.g.
 *                   from a `useEffect` cleanup or React Strict-Mode remount).
 */
export async function creditUnderwriting(
  input: CreditUnderwritingInput,
  options: { signal?: AbortSignal } = {},
): Promise<CreditUnderwritingResponse> {
  return fetchWithAuth<CreditUnderwritingResponse>(
    '/api/v1/card-issuance/credit/underwriting',
    {
      method: 'POST',
      json: { ...MOCK_HOST_CONTEXT, ...input },
      signal: options.signal,
    },
  );
}

// ─── /card-issuance/consent ────────────────────────────────────────────────

/** Input for `POST /api/v1/card-issuance/consent`. */
export interface SubmitConsentInput {
  requestId: string;
  cardTypeRequest: CreditCardTypeRequest;
  consentOnTermsAndConditions: boolean;
}

/** Response from `POST /api/v1/card-issuance/consent`. */
export interface SubmitConsentResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  cardTypeRequest: CreditCardTypeRequest;
  currentStage: string;
  feeStatus: string;
  mirrorAccountNumber: string;
  creditCardProductGl: string;
  status: string;
  message: string;
}

/**
 * Submit the user's signed consent for the card terms. Called when the user
 * ticks the T&C checkbox and taps "Apply Now". Triggers card issuance
 * server-side; the response carries the next-stage status the success
 * screen will eventually display.
 */
export async function submitConsent(
  input: SubmitConsentInput,
): Promise<SubmitConsentResponse> {
  return fetchWithAuth<SubmitConsentResponse>('/api/v1/card-issuance/consent', {
    method: 'POST',
    json: { ...MOCK_HOST_CONTEXT, ...input },
  });
}
