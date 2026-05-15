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

import { MOCK_HOST_CONTEXT } from "./__mocks__/hostContext";
import { fetchWithAuth } from "./fetchWithAuth";

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
export async function requestCardStatus(
  input: RequestCardInput,
): Promise<RequestCardResponse> {
  const payload: Required<RequestCardInput> = {
    ...MOCK_HOST_CONTEXT,
    ...input,
    accountNumber: input.accountNumber ?? MOCK_HOST_CONTEXT.accountNumber,
  };

  return fetchWithAuth<RequestCardResponse>("/api/v1/card/request", {
    method: "POST",
    json: payload,
  });
}

export async function requestCard(
  input: RequestCardInput,
): Promise<RequestCardResponse> {
  const payload: Required<RequestCardInput> = {
    ...MOCK_HOST_CONTEXT,
    ...input,
    accountNumber: input.accountNumber ?? MOCK_HOST_CONTEXT.accountNumber,
  };

  return fetchWithAuth<RequestCardResponse>("/api/v1/card/request", {
    method: "POST",
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
  bankOtpChannel: "EMAIL" | "PHONE";
  bankOtpStatus: string;
}

export interface ResendEmailOtpResponse {
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

export interface ResendEmailOtpInput {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
}
/**
 * Verify the OTP sent to the user's registered email.
 * Throws on `400` (invalid OTP) — caller can show "Invalid code" to the user.
 */
export async function verifyEmailOtp(
  input: VerifyEmailOtpInput,
): Promise<VerifyEmailOtpResponse> {
  return fetchWithAuth<VerifyEmailOtpResponse>(
    "/api/v1/card/email-otp/verify",
    {
      method: "POST",
      json: { ...MOCK_HOST_CONTEXT, ...input },
    },
  );
}

export async function resendEmailOtp(
  input: ResendEmailOtpInput,
): Promise<ResendEmailOtpResponse> {
  return fetchWithAuth<ResendEmailOtpResponse>("/api/v1/card/email-otp/retry", {
    method: "POST",
    json: { ...input },
  });
}

// ─── /card/bank-otp/send ───────────────────────────────────────────────────

/** Input for `POST /api/v1/card/bank-otp/send`. */
export interface SendBankOtpInput {
  requestId: string;
}

/** Input for `POST /api/v1/card/bank-otp/send`. */
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
  bankOtpChannel: "EMAIL" | "PHONE";
  otpStatus: string;
}
/**
 * Input for `sendBankOtp` and `resendBankOtp`.
 */
export interface ResendBankOtpInput {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
}
export interface ResendBankOtpResponse {
  requestId: string;
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  bankEmail: string;
  bankPhoneNumber: string;
  bankOtpDestination: string;
  bankOtpChannel: "EMAIL";
  otpStatus: string;
}

/**
 * Trigger the bank to send an OTP to the customer. Called automatically
 * after `verifyEmailOtp` succeeds, and again on the bank-OTP screen
 * "Resend" action.
 */
export async function sendBankOtp(
  input: SendBankOtpInput,
): Promise<SendBankOtpResponse> {
  return fetchWithAuth<SendBankOtpResponse>("/api/v1/card/bank-otp/send", {
    method: "POST",
    json: { ...MOCK_HOST_CONTEXT, ...input },
  });
}
export async function resendBankOtp(
  input: ResendBankOtpInput,
): Promise<SendBankOtpResponse> {
  return fetchWithAuth<ResendBankOtpResponse>("/api/v1/card/bank-otp/send", {
    method: "POST",
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
export async function verifyBankOtp(
  input: VerifyBankOtpInput,
): Promise<VerifyBankOtpResponse> {
  return fetchWithAuth<VerifyBankOtpResponse>("/api/v1/card/bank-otp/verify", {
    method: "POST",
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
  return fetchWithAuth<VerifySoftTokenResponse>(
    "/api/v1/card/soft-token/verify",
    {
      method: "POST",
      json: { ...MOCK_HOST_CONTEXT, ...input },
    },
  );
}

// ─── /card-issuance/credit/underwriting ────────────────────────────────────

/** Card variant accepted by the credit-underwriting endpoint. */
export type CreditCardTypeRequest = "CREDIT_CARD";

/**
 * Card variants accepted by the consent orchestration endpoint.
 *
 * @remarks
 * Swagger examples show `CREDIT_CARD`, but the consent endpoint is described as
 * the generic "resume card issuance after customer consent". We model it as a
 * union so debit integrations can call the same endpoint when supported.
 */
export type CardIssuanceTypeRequest =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "PREPAID_CARD"
  | "GIFT_CARD";

/** Decision returned by the credit-underwriting endpoint. */
export type UnderwritingDecision = "APPROVED" | "REJECTED";

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
    "/api/v1/card-issuance/credit/underwriting",
    {
      method: "POST",
      json: { ...MOCK_HOST_CONTEXT, ...input },
      signal: options.signal,
    },
  );
}

// ─── /card-issuance/consent ────────────────────────────────────────────────

/** Input for `POST /api/v1/card-issuance/consent`. */
export interface SubmitConsentInput {
  requestId: string;
  cardTypeRequest: CardIssuanceTypeRequest;
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
  cardTypeRequest: CardIssuanceTypeRequest;
  currentStage: string;
  feeStatus: string;
  mirrorAccountNumber: string;
  creditCardProductGl: string;
  status: string;
  message: string;
  /** Masked card PAN */
  maskedPan: string;
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
  return fetchWithAuth<SubmitConsentResponse>("/api/v1/card-issuance/consent", {
    method: "POST",
    json: { ...MOCK_HOST_CONTEXT, ...input },
  });
}

//card activation
export async function cardActivation(
  input: CardActivationInput,
): Promise<CardActivationResponse> {
  return fetchWithAuth<CardActivationResponse>(
    "/api/v1/card-issuance/virtual-card/pin",
    {
      method: "POST",
      json: { ...MOCK_HOST_CONTEXT, ...input },
    },
  );
}

// ─── /cards/virtual-cards ──────────────────────────────────────────────────

/** Response for `GET /api/v1/card-link/virtual-cards`. */
export interface VirtualCardsResponse {
  mobileAppUserId: string;
  totalCards: number;
  cards: VirtualCard[];
}

/** Virtual card row from GET /api/v1/card-link/virtual-cards */
export interface VirtualCard {
  requestId: string;
  cardId: string;
  cardType: string;
  /** Wallet API masked PAN (primary) */
  maskedPan?: string;
  cardScheme?: string;
  cardVariant?: string;
  cardExpiryMmYy?: string;
  pinSet?: boolean;
  activatedAt?: string | null;
  createdAt?: string;
  /** Legacy / mock */
  maskedCardNumber?: string;
  balance?: number;
  status?: string;
  currency?: string;
  defaultPin?: string;
}

export function virtualCardMaskedDisplay(card: VirtualCard): string {
  return card.maskedPan ?? card.maskedCardNumber ?? "**** **** **** ****";
}

/** Universal card row from GET /api/v1/card-link/universal-cards */
export interface UniversalCard {
  requestId: string;
  ucCardId: string;
  ucPanMasked: string;
  /**
   * Full primary account number when the list API supplies it (e.g. dev / host).
   * Used for `provide-uc-pan` in wallet link flows — do not log or persist.
   */
  ucPan?: string;
  pinSet?: boolean;
  linkedVirtualCardCount?: number;
  linkedVirtualCards?: unknown[];
  activatedAt?: string;
  createdAt?: string;
  /** Legacy / transitional mock rows only */
  cardId?: string;
  cardType?: string;
  maskedCardNumber?: string;
  balance?: number;
  status?: string;
  currency?: string;
  defaultPin?: string;
}

/** Stable id for selection + Redux managingCardId (prefers `ucCardId`). */
export function universalCardStableId(card: UniversalCard): string {
  return card.ucCardId || card.cardId || "";
}

/** Input for `GET /api/cards/virtual-cards`. */
export interface GetVirtualCardsInput {
  email: string;
  bvn: string;
  nin: string;
}

/**
 * Fetch all virtual cards associated with the user's identity.
 */
export async function getVirtualCards(
  _input?: GetVirtualCardsInput,
): Promise<VirtualCardsResponse> {
  return fetchWithAuth<VirtualCardsResponse>("/api/v1/card-link/virtual-cards", {
    method: "GET",
  });
}

/** Response for `GET /api/v1/card-link/universal-cards`. */
export interface UniversalCardsResponse {
  mobileAppUserId: string;
  totalCards: number;
  cards: UniversalCard[];
}

/** Input for `GET /api/v1/card-link/universal-cards`. */
export interface GetUniversalCardsInput {
  email: string;
  bvn: string;
  nin: string;
}

/**
 * Fetch all universal cards associated with the user's identity.
 */
export async function getUniversalCards(
  _input?: GetUniversalCardsInput,
): Promise<UniversalCardsResponse> {
  return fetchWithAuth<UniversalCardsResponse>("/api/v1/card-link/universal-cards", {
    method: "GET",
  });
}

/**
 * Unified fetch for all cards (Virtual and Universal).
 * Includes default PIN injection for the prototype.
 */
export async function fetchAllCardsData(): Promise<{ virtualCards: VirtualCard[], universalCards: UniversalCard[] }> {
  const email = MOCK_HOST_CONTEXT.recipientEmail;
  const bvn = MOCK_HOST_CONTEXT.bvn;
  const nin = MOCK_HOST_CONTEXT.nin;

  const [virtualCardsResponse, universalCardsResponse] = await Promise.all([
    getVirtualCards({ email, bvn, nin }),
    getUniversalCards({ email, bvn, nin }),
  ]);

  const virtualCardsWithPin = virtualCardsResponse.cards.map(card => ({ ...card, defaultPin: '1234' }));
  const universalCardsWithPin = universalCardsResponse.cards.map((card) => {
    const row = card as UniversalCard & { ucpan?: string }
    return {
      ...row,
      defaultPin: '1234',
      ucPan: row.ucPan ?? row.ucpan,
    }
  });

  return { virtualCards: virtualCardsWithPin, universalCards: universalCardsWithPin };
}
