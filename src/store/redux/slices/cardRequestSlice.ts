import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

/**
 * Non-persisted state for the in-flight card request flow.
 *
 * Two distinct OTPs flow through this slice; they are kept in separate
 * fields so neither overwrites the other:
 *
 *   ┌──────────────────────────┬─────────────────────┬──────────────────────────┐
 *   │ OTP                      │ Sent endpoint       │ Verify endpoint          │
 *   ├──────────────────────────┼─────────────────────┼──────────────────────────┤
 *   │ Registered-email OTP     │ /card/request       │ /card/email-otp/verify   │
 *   │ Bank OTP                 │ /card/bank-otp/send │ /card/bank-otp/verify    │
 *   └──────────────────────────┴─────────────────────┴──────────────────────────┘
 *
 * Cleared when the flow completes or restarts.
 *
 * @remarks
 * This slice is intentionally **not** added to `persistConfig.whitelist` —
 * the request lifecycle is per-session and must not survive a reload.
 */

/** Channel the bank used to deliver the bank OTP. */
export type BankOtpChannel = 'EMAIL' | 'PHONE'

interface CardRequestState {
  requestId: string | null
  registeredEmail: string | null
  /** Status of the email OTP send (set by /card/request). */
  emailOtpStatus: string | null
  /** Match result of the email OTP verify (set by /card/email-otp/verify). */
  emailOtpMatchStatus: string | null
  /** Pre-masked bank OTP destination from the backend (never raw PII). */
  bankOtpDestination: string | null
  /** Which channel the bank OTP was sent on — drives screen copy. */
  bankOtpChannel: BankOtpChannel | null
  /** Status of the bank OTP send (set by /email-otp/verify or /bank-otp/send). */
  bankOtpStatus: string | null
  /** Match result of the bank OTP verify (set by /card/bank-otp/verify). */
  bankOtpMatchStatus: string | null
}

const initialState: CardRequestState = {
  requestId: null,
  registeredEmail: null,
  emailOtpStatus: null,
  emailOtpMatchStatus: null,
  bankOtpDestination: null,
  bankOtpChannel: null,
  bankOtpStatus: null,
  bankOtpMatchStatus: null,
}

const cardRequestSlice = createSlice({
  name: 'cardRequest',
  initialState,
  reducers: {
    /** Capture the response from `POST /api/v1/card/request`. */
    setCardRequest: (
      state,
      action: PayloadAction<{
        requestId: string
        registeredEmail: string
        emailOtpStatus: string
      }>,
    ) => {
      state.requestId = action.payload.requestId
      state.registeredEmail = action.payload.registeredEmail
      state.emailOtpStatus = action.payload.emailOtpStatus
    },
    /**
     * Capture the email-OTP-verify result. Bank-side fields from the same
     * response are dispatched separately via {@link setBankOtpSent}.
     */
    setEmailOtpVerified: (
      state,
      action: PayloadAction<{ emailOtpMatchStatus: string }>,
    ) => {
      state.emailOtpMatchStatus = action.payload.emailOtpMatchStatus
    },
    /**
     * Capture the bank-OTP-send result. Dispatched both from the bank-side
     * fields of `/email-otp/verify` and from the explicit `/bank-otp/send`
     * (initial trigger and resend).
     */
    setBankOtpSent: (
      state,
      action: PayloadAction<{
        bankOtpDestination: string
        bankOtpChannel: BankOtpChannel
        bankOtpStatus: string
      }>,
    ) => {
      state.bankOtpDestination = action.payload.bankOtpDestination
      state.bankOtpChannel = action.payload.bankOtpChannel
      state.bankOtpStatus = action.payload.bankOtpStatus
    },
    /** Capture the response from `POST /api/v1/card/bank-otp/verify`. */
    setBankOtpVerified: (
      state,
      action: PayloadAction<{ bankOtpMatchStatus: string }>,
    ) => {
      state.bankOtpMatchStatus = action.payload.bankOtpMatchStatus
    },
    /** Reset back to the initial empty state when the flow ends or restarts. */
    clearCardRequest: () => initialState,
  },
  selectors: {
    selectCardRequestId: (state) => state.requestId,
    selectCardRequestEmail: (state) => state.registeredEmail,
    selectCardRequestBankOtpDestination: (state) => state.bankOtpDestination,
    selectCardRequestBankOtpChannel: (state) => state.bankOtpChannel,
  },
})

export const {
  setCardRequest,
  setEmailOtpVerified,
  setBankOtpSent,
  setBankOtpVerified,
  clearCardRequest,
} = cardRequestSlice.actions
export const {
  selectCardRequestId,
  selectCardRequestEmail,
  selectCardRequestBankOtpDestination,
  selectCardRequestBankOtpChannel,
} = cardRequestSlice.selectors
export default cardRequestSlice.reducer
