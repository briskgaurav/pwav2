




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

import { CardType } from '@/constants/cardData';
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
export async function requestCardStatus(input: RequestCardInput): Promise<RequestCardResponse> {
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

//////////////////// Gift card------------------
/** Input for `POST /api/v1/card/email-otp/verify`. */
export interface GiftVerifyEmailOtpInput {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  registeredEmail: string;
  otp: string;
}

/** Response from `POST /api/v1/card/email-otp/verify`. */
export interface GiftVerifyEmailOtpResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;

  /** Card details */
  cardType: string;
  amount: number;

  /** Gift card flow state */
  currentState: string;
  nextAction: string;

  /** API status */
  status: string;
  message: string;
}

/**
 * Verify the OTP sent to the user's registered email.
 * Throws on `400` (invalid OTP) — caller can show "Invalid code" to the user.
 */
export async function GiftverifyEmailOtp(
  input: GiftVerifyEmailOtpInput
): Promise<GiftVerifyEmailOtpResponse> {
  return fetchWithAuth<GiftVerifyEmailOtpResponse>(
    '/api/v1/card/email-otp/verify',
    {
      method: 'POST',
      json: {
        ...MOCK_HOST_CONTEXT,
        ...input,
      },
    }
  );
}

/** Input for `POST /api/v1/card/bank-otp/send`. */
export interface GiftSendBankOtpInput {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
}

/** Response from `POST /api/v1/card/bank-otp/send`. */
export interface GiftSendBankOtpResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;

  /** Card details */
  cardType: string;
  amount: number;

  /** Flow state */
  currentState: string;
  nextAction: string;

  /** API status */
  status: string;
  message: string;
}

/**
 * Trigger the bank to send an OTP to the customer.
 * Called automatically after email OTP verification.
 */

export async function GiftsendBankOtp(
  input: GiftSendBankOtpInput
): Promise<GiftSendBankOtpResponse> {
  return fetchWithAuth<GiftSendBankOtpResponse>(
    '/api/v1/cards/bank-otp/send',
    {
      method: 'POST',
      json: {
        ...MOCK_HOST_CONTEXT,
        ...input,
      },
    }
  );
}
// ─── /card/bank-otp/send ───────────────────────────────────────────────────

/** Input for `POST /api/v1/card-issuance/virtual-card/pin`. */
export interface CardActivationInput {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  registeredEmail: string;
  cardType: string;
  vcPan: string;
  pinRequested: string;
}

export interface CardActivationResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  registeredEmail: string;
  cardType: string;
  vcPan: string;
  pinSetupConfirmation: string;
  status: string;
  message: string;
}

//card activation
export async function cardActivation(input: CardActivationInput): Promise<CardActivationResponse> {
  return fetchWithAuth<CardActivationResponse>('/api/v1/card-issuance/virtual-card/pin', {
    method: 'POST',
    json: { ...MOCK_HOST_CONTEXT, ...input },
  });
}


/**
 * Response from `POST /api/v1/card/bank-otp/send`.
 * Same `bankOtpDestination` + `bankOtpChannel` shape as the email-OTP-verify
 * response — see {@link VerifyEmailOtpResponse} for the rationale.
 */
/** Input for `POST /api/v1/card/bank-otp/send`. */
export interface SendBankOtpInput {
  requestId: string;
}

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

/** Decision returned by the credit-underwriting endpoint. */
export type UnderwritingDecision = 'APPROVED' | 'REJECTED';

/** Input for `POST /api/v1/card-issuance/credit/underwriting`. */
export interface CreditUnderwritingInput {
  requestId: string;
  cardTypeRequest: CardType;
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
  cardTypeRequest: CardType;
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
  cardTypeRequest: CardType;
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
  cardTypeRequest: CardType;
  currentStage: string;
  feeStatus: string;
  mirrorAccountNumber: string;
  creditCardProductGl: string;
  maskedPan: string;
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

// -------------------------- GIFT CARD FLOW --------------------------
//--------------------------Gift card //-----------------

export interface RequestGiftCardInput {
  cardType: string;
  issuerBankCode?: string;
  country?: string;
  mobileAppUserId?: string;
  customerId?: string;
  customerName?: string;
  bvn?: string;
  nin?: string;
}

export interface RequestGiftCardResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  cardType: string;
  currentState: string;
  nextAction: string;
  status: string;
  message: string;
}

/**
 * Initiate a new card request. Returns a `requestId` plus the registered
 * email and OTP status to drive the next verification step.
 */
export async function requestGiftCardStatus(input: RequestGiftCardInput): Promise<RequestCardResponse> {
  const payload: Required<RequestGiftCardInput> = {
    ...MOCK_HOST_CONTEXT,
    ...input,
  };

  return fetchWithAuth<RequestCardResponse>('/api/v1/cards/request', {
    method: 'POST',
    json: payload,
  });
}

// ----------------------------------------------------
// STEP 2 → Capture Recipient Details
// POST /api/v1/cards/{requestId}/gift/recipient-details
// ----------------------------------------------------

export interface GiftRecipientDetailsInput {
  requestId: string;
  recipientName: string;
  recipientEmail: string;
  amount: string;
}

export interface GiftRecipientDetailsResponse {
  requestId: string;
  currentState: string; // OTP_EMAIL_PENDING
  nextAction: string;
  registeredEmail: string;
  recipientName: string;
  recipientEmail: string;
  status: string;
  message: string;
}

export async function saveGiftRecipientDetails(
  input: GiftRecipientDetailsInput,
): Promise<GiftRecipientDetailsResponse> {
  return fetchWithAuth<GiftRecipientDetailsResponse>(
    `/api/v1/cards/${input.requestId}/gift/recipient-details`,
    {
      method: 'POST',
      json: { ...MOCK_HOST_CONTEXT, ...input },
    },
  );
}

// ----------------------------------------------------
// STEP 6 → Recipient Code Validation
// POST /api/v1/cards/{requestId}/gift/recipient-code
// ----------------------------------------------------

export interface VerifyRecipientCodeInput {
  requestId: string;
  recipientCode: string;
}

export interface VerifyRecipientCodeResponse {
  requestId: string;
  currentState: string; // SENDER_CODE_PENDING
  nextAction: string;
  status: string;
  message: string;
}

export async function verifyRecipientCode(
  input: VerifyRecipientCodeInput,
): Promise<VerifyRecipientCodeResponse> {
  return fetchWithAuth<VerifyRecipientCodeResponse>(
    `/api/v1/cards/${input.requestId}/gift/recipient-code`,
    {
      method: 'POST',
      json: {
        recipientCode: input.recipientCode,
      },
    },
  );
}

// ----------------------------------------------------
// STEP 7 → Sender Code Validation
// POST /api/v1/cards/{requestId}/gift/sender-code
// ----------------------------------------------------

export interface VerifySenderCodeInput {
  requestId: string;
  senderCode: string;
}

export interface VerifySenderCodeResponse {
  requestId: string;
  currentState: string; // ACTIVE
  nextAction: string;   // SHOW_CARD_ACTIVE
  status: string;
  message: string;
}

export async function verifySenderCode(
  input: VerifySenderCodeInput,
): Promise<VerifySenderCodeResponse> {
  return fetchWithAuth<VerifySenderCodeResponse>(
    `/api/v1/cards/${input.requestId}/gift/sender-code`,
    {
      method: 'POST',
      json: {
        senderCode: input.senderCode,
      },
    },
  );
}

// ----------------------------------------------------
// STEP 8 → Get Gift Card Status
// GET /api/v1/cards/{requestId}/status
// ----------------------------------------------------

export interface GiftCardStatusResponse {
  requestId: string;
  currentState: string; // ACTIVE
  nextAction: string;   // SHOW_CARD_ACTIVE
  status: string;
  message: string;
}

export async function getGiftCardStatus(
  requestId: string,
): Promise<GiftCardStatusResponse> {
  return fetchWithAuth<GiftCardStatusResponse>(
    `/api/v1/cards/${requestId}/status`,
    {
      method: 'GET',
    },
  );
}