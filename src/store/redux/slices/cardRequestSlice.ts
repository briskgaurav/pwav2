import { CardType } from '@/constants/cardData'
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

  /** User selected card type */
  selectedCardType: CardType | null

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

  maskedPan: string | null

  // Gift Card fields
  currentState: string | null
  nextAction: string | null
  recipientName: string | null
  recipientEmail: string | null
}

const initialState: CardRequestState = {
  requestId: null,
  registeredEmail: null,
  selectedCardType: null,
  emailOtpStatus: null,
  emailOtpMatchStatus: null,
  bankOtpDestination: null,
  bankOtpChannel: null,
  bankOtpStatus: null,
  bankOtpMatchStatus: null,
  maskedPan: null,

  // Gift Card initial values
  currentState: null,
  nextAction: null,
  recipientName: null,
  recipientEmail: null,
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
        emailOtpStatus: string,
        selectedCardType: CardType
      }>,
    ) => {
      state.requestId = action.payload.requestId
      state.registeredEmail = action.payload.registeredEmail
      state.emailOtpStatus = action.payload.emailOtpStatus
      state.selectedCardType = action.payload.selectedCardType
    },

    /** Store the selected card type */
    setSelectedCardType: (
      state,
      action: PayloadAction<CardType>,
    ) => {
      state.selectedCardType = action.payload
    },

    /**
     * Capture the email-OTP-verify result. Bank-side fields from the same
     * response are dispatched separately via setBankOtpSent.
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
      action: PayloadAction<{ bankOtpMatchStatus: string, maskedPan?: string }>,
    ) => {
      state.bankOtpMatchStatus = action.payload.bankOtpMatchStatus

      if (action.payload.maskedPan) {
        state.maskedPan = action.payload.maskedPan
      }

    },

    /** Optional standalone setter if needed later */
    setMaskedPan: (
      state,
      action: PayloadAction<string>
    ) => {
      state.maskedPan = action.payload
    },

    /** Gift card */
    setGiftCardRequest: (
      state,
      action: PayloadAction<{
        requestId: string
        registeredEmail: string
        emailOtpStatus: string
        selectedCardType: CardType
        currentState: string
        nextAction: string
        recipientName: string
        recipientEmail: string
      }>
    ) => {
      state.requestId = action.payload.requestId
      state.registeredEmail = action.payload.registeredEmail
      state.emailOtpStatus = action.payload.emailOtpStatus
      state.selectedCardType = action.payload.selectedCardType
      state.currentState = action.payload.currentState
      state.nextAction = action.payload.nextAction
      state.recipientName = action.payload.recipientName
      state.recipientEmail = action.payload.recipientEmail
    },


    /** Reset back to the initial empty state when the flow ends or restarts. */
    clearCardRequest: () => initialState,
  },

  selectors: {
    selectCardRequestId: (state) => state.requestId,
    selectCardRequestEmail: (state) => state.registeredEmail,
    selectSelectedCardType: (state) => state.selectedCardType,
    selectCardRequestBankOtpDestination: (state) => state.bankOtpDestination,
    selectCardRequestBankOtpChannel: (state) => state.bankOtpChannel,
    selectMaskedPan: (state) => state.maskedPan,

    // Gift Card selectors
    selectCurrentState: (state) => state.currentState,
    selectNextAction: (state) => state.nextAction,
    selectRecipientName: (state) => state.recipientName,
    selectRecipientEmail: (state) => state.recipientEmail,
  },
})

export const {
  setCardRequest,
  setGiftCardRequest,
  setSelectedCardType,
  setEmailOtpVerified,
  setBankOtpSent,
  setBankOtpVerified,
  setMaskedPan,
  clearCardRequest,
} = cardRequestSlice.actions

export const {
  selectCardRequestId,
  selectCardRequestEmail,
  selectSelectedCardType,
  selectCardRequestBankOtpDestination,
  selectCardRequestBankOtpChannel,
  selectMaskedPan,

  // Gift Card selectors
  selectCurrentState,
  selectNextAction,
  selectRecipientName,
  selectRecipientEmail,
} = cardRequestSlice.selectors

export default cardRequestSlice.reducer