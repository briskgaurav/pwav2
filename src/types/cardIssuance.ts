export type CardRequestState =
  | 'INITIATED'
  | 'OTP_EMAIL_PENDING'
  | 'OTP_EMAIL_VERIFIED'
  | 'OTP_BANK_PENDING'
  | 'OTP_BANK_VERIFIED'
  | 'SOFT_TOKEN_PENDING'
  | 'SOFT_TOKEN_VERIFIED'
  | 'RECIPIENT_DETAILS_CAPTURED'
  | 'BANK_ACCOUNTS_FETCHED'
  | 'ELIGIBILITY_PENDING'
  | 'ELIGIBILITY_PASSED'
  | 'ELIGIBILITY_FAILED'
  | 'CONSENT_PENDING'
  | 'CONSENT_CAPTURED'
  | 'CBN_PENDING'
  | 'CBN_GENERATED'
  | 'CBN_FAILED'
  | 'FEE_PENDING'
  | 'FEE_COLLECTED'
  | 'FEE_FAILED_RETRYABLE'
  | 'FEE_FAILED_INSUFFICIENT_BALANCE'
  | 'MIRROR_ACCOUNT_PENDING'
  | 'MIRROR_ACCOUNT_CREATED'
  | 'MIRROR_ACCOUNT_FAILED'
  | 'CARD_ISSUANCE_PENDING'
  | 'CARD_ISSUED'
  | 'PIN_ACTIVATION_PENDING'
  | 'RECIPIENT_NOTIFIED'
  | 'RECIPIENT_CODE_PENDING'
  | 'SENDER_CODE_PENDING'
  | 'ACTIVATION_PENDING'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'CLOSED';

export type NextActionCode =
  | 'VERIFY_EMAIL_OTP'
  | 'VERIFY_BANK_OTP_OR_SOFT_TOKEN'
  | 'CAPTURE_RECIPIENT_DETAILS'
  | 'SHOW_ELIGIBILITY_RESULT'
  | 'CAPTURE_CONSENT'
  | 'SHOW_CBN_PENDING_MESSAGE'
  | 'RESUME_FROM_FEE_COLLECTION'
  | 'SHOW_FEE_RETRY_IN_PROGRESS'
  | 'SHOW_INSUFFICIENT_BALANCE'
  | 'SHOW_MIRROR_ACCOUNT_PROCESSING'
  | 'SHOW_CARD_DETAILS_AND_SET_PIN'
  | 'ENTER_RECIPIENT_CODE'
  | 'ENTER_SENDER_CODE'
  | 'GIFT_CARD_PAYMENT'
  | 'GIFT_CARD_READY_TO_USE'
  | 'GIFT_CARD_SHARE'
  | 'GIFT_CARD_ACTIVATION'
  | 'SHOW_CARD_ACTIVE'
  | 'VERIFY_BANK_OTP'
  | 'SHOW_REQUEST_CLOSED';

export type CardRequestStateResponse = {
  requestId: string;
  cardType: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PREPAID_CARD' | 'GIFT_CARD';
  currentState: CardRequestState;
  nextAction: {
    code: NextActionCode;
    message: string;
    destinationMasked?: string;
    expiresAt?: string;
  };
  expiresAt: string;
  failureCode?: string;
  failureReason?: string;
  cardDetails?: {
    cardId: string;
    vcPanMasked: string;
    cardScheme: string;
    cardVariant: string;
    cardExpiryMmYy: string;
    pinSet: boolean;
  };
  linkedAccounts?: Array<{
    accountNumberMasked: string;
    accountType: string;
    bankName: string;
    primary: boolean;
  }>;
  approvedCreditLimitMinor?: number;
  consentVersion?: string;
};

export type CardErrorCode =
  | 'VALIDATION_ERROR'
  | 'INVALID_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'REQUEST_NOT_FOUND'
  | 'DUPLICATE_ACTIVE_REQUEST'
  | 'IDEMPOTENCY_REPLAY_DIFFERENT_BODY'
  | 'INVALID_STATE_TRANSITION'
  | 'CONSENT_VERSION_MISMATCH'
  | 'OPTIMISTIC_LOCK_CONFLICT'
  | 'REQUEST_EXPIRED'
  | 'USER_NOT_VERIFIED'
  | 'CARD_TYPE_IMMUTABLE'
  | 'OTP_INVALID'
  | 'OTP_EXPIRED'
  | 'OTP_LOCKED'
  | 'IMW_BANK_OTP_FAILED'
  | 'IMW_SOFT_TOKEN_FAILED'
  | 'BANK_OTP_NOT_VERIFIED'
  | 'ELIGIBILITY_FAILED'
  | 'ELIGIBILITY_RATE_LIMITED'
  | 'ELIGIBILITY_UNAVAILABLE'
  | 'CONSENT_REQUIRED'
  | 'CBN_FAILED'
  | 'FEE_INSUFFICIENT_BALANCE'
  | 'ACCOUNT_BLOCKED'
  | 'MIRROR_ACCOUNT_FAILED'
  | 'VC_PRECONDITIONS_NOT_MET'
  | 'VC_ISSUANCE_FAILED'
  | 'PIN_SETUP_FAILED'
  | 'GIFT_RECIPIENT_CODE_INVALID'
  | 'GIFT_SENDER_CODE_INVALID'
  | 'GIFT_CODE_EXPIRED'
  | 'GIFT_CODE_LOCKED'
  | 'RATE_LIMITED'
  | 'EXTERNAL_SYSTEM_ERROR'
  | 'DATABASE_ERROR'
  | 'INTERNAL_SERVER_ERROR';

export type ErrorResponse = {
  errorCode: CardErrorCode;
  errorMessage: string;
  retryable: boolean;
  userAction:
  | 'NONE' | 'FIX_INPUT' | 'RE_AUTHENTICATE' | 'WAIT_AND_RETRY' | 'RETRY_LATER'
  | 'COMPLETE_KYC' | 'RESUME_EXISTING' | 'USE_DIFFERENT_KEY' | 'OPEN_NEW_REQUEST'
  | 'RETRY_OTP' | 'RESEND_OTP' | 'USE_BANK_OTP' | 'USE_SOFT_TOKEN' | 'VERIFY_FIRST'
  | 'RESUME' | 'RETRY_AFTER_DATE' | 'ACCEPT_T_AND_C' | 'RE_CAPTURE_CONSENT' | 'WAIT'
  | 'RECHARGE_AND_RETRY' | 'CONTACT_SUPPORT' | 'RETRY' | 'REQUEST_REGENERATION';
  supportRef: string;
  requestId?: string;
  details?: string[];
};

export type CreateCardRequest = {
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  cardType: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PREPAID_CARD' | 'GIFT_CARD';
  selectedBankAccountNumber?: string;
};
