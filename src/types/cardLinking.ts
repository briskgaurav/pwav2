
// ─── State values (for debugging / status display) ─────────────────────────

export type CardLinkRequestState =
  | 'INITIATED'
  | 'VC_PIN_REQUIRED'
  | 'VC_PIN_VERIFIED'
  | 'VC_SELECTION_PENDING'
  | 'UC_SELECTION_PENDING'
  | 'UC_PIN_REQUIRED'
  | 'UC_PIN_VERIFIED'
  | 'UC_PAN_REQUIRED'
  | 'UC_PIN_SETUP_REQUIRED'
  | 'UC_ACTIVATED'
  | 'UC_NOT_AVAILABLE'
  | 'LINK_PENDING'
  | 'LINK_ACTIVE'
  | 'LINK_FAILED'
  | 'EXPIRED'
  | 'CLOSED';

// ─── NextActionCode — drives the screen router ─────────────────────────────

export type LinkNextActionCode =
  | 'VERIFY_VC_PIN'
  | 'SELECT_UC_FROM_LIST'
  | 'VERIFY_UC_PIN'
  | 'PROVIDE_UC_PAN'
  | 'SETUP_UC_PIN'
  | 'SELECT_VC_TO_LINK'
  | 'SHOW_LINK_PROCESSING'
  | 'SHOW_LINK_SUCCESS'
  | 'SHOW_LINK_FAILED';

// ─── UC list item ──────────────────────────────────────────────────────────

export type UcListItem = {
  ucCardId: string;
  ucPanMasked: string;
  lastFour: string;
  scheme: string;
  status: string;
};

// ─── Response envelope ─────────────────────────────────────────────────────

export type CardLinkStateResponse = {
  requestId: string;
  currentState: CardLinkRequestState;
  nextAction: {
    code: LinkNextActionCode;
    message: string;
    destinationMasked?: string;
    expiresAt?: string;
  };
  expiresAt: string;

  vcSummary?: {
    vcCardId: string;
    vcPanMasked: string;
  };
  ucSummary?: {
    ucCardId: string;
    ucPanMasked: string;
    lastFour?: string;
    scheme?: string;
    status?: string;
  };
  ucList?: UcListItem[];

  linkId?: string;
  failureCode?: string;
  failureReason?: string;
};

// ─── Request bodies ────────────────────────────────────────────────────────

export type InitiateLinkRequest = {
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  vcCardId?: string;
};

// ─── Linking-specific error codes ──────────────────────────────────────────

export type CardLinkErrorCode =
  | 'VC_PIN_VERIFICATION_FAILED'
  | 'UC_PIN_VERIFICATION_FAILED'
  | 'UC_NOT_AVAILABLE'
  | 'UC_NOT_FOUND'
  | 'LINK_OWNER_MISMATCH'
  | 'LINK_ALREADY_EXISTS'
  | 'MWS_LINK_FAILED'
  | 'UCCMS_UNAVAILABLE'
  | 'MWS_UNAVAILABLE'
  // Cross-cutting codes from VC flow:
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'RATE_LIMITED'
  | 'REQUEST_NOT_FOUND'
  | 'REQUEST_EXPIRED'
  | 'INVALID_STATE_TRANSITION'
  | 'IDEMPOTENCY_REPLAY_DIFFERENT_BODY'
  | 'OPTIMISTIC_LOCK_CONFLICT'
  | 'DATABASE_ERROR'
  | 'EXTERNAL_SYSTEM_ERROR'
  | 'INTERNAL_SERVER_ERROR';