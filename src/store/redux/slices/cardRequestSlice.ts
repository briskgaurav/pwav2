import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CardRequestStateResponse } from '@/types/cardIssuance'

export interface GiftRecipientDetailsDraft {
  recipientName: string;
  recipientEmail: string;
  giftAmount: string;
  giftAmountMinor: number;
  giftCurrency: string;
  giftMessage: string;
}

export interface CardRequestState {
  response: CardRequestStateResponse | null;
  giftRecipientDetails: GiftRecipientDetailsDraft | null;
}

const initialState: CardRequestState = {
  response: null,
  giftRecipientDetails: null,
}

const cardRequestSlice = createSlice({
  name: "cardRequest",
  initialState,
  reducers: {
    setCardRequestState: (
      state,
      action: PayloadAction<CardRequestStateResponse>
    ) => {
      state.response = action.payload;
    },
    clearCardRequestState: (state) => {
      state.response = null;
      state.giftRecipientDetails = null;
    },
    setGiftRecipientDetails: (
      state,
      action: PayloadAction<GiftRecipientDetailsDraft>
    ) => {
      state.giftRecipientDetails = action.payload;
    },
  },
  selectors: {
    selectCardRequestResponse: (state) => state.response,
    selectNextActionCode: (state) => state.response?.nextAction?.code,
    selectGiftRecipientDetails: (state) => state.giftRecipientDetails,
  },
});

export const { setCardRequestState, clearCardRequestState, setGiftRecipientDetails } = cardRequestSlice.actions
export const { selectCardRequestResponse, selectNextActionCode, selectGiftRecipientDetails } = cardRequestSlice.selectors
export default cardRequestSlice.reducer

// ─── Backward-compatibility re-exports ─────────────────────────────────────
// These selectors read from the new `response` envelope so legacy screens
// (CardConsent, DebitCardConsent, VCActivation, HowToUseInstacards, etc.)
// keep compiling during migration. Delete once those screens are ported.

/** @deprecated Use `selectCardRequestResponse` and read `.requestId` */
export const selectCardRequestId = (root: { cardRequest: CardRequestState }) =>
  root.cardRequest.response?.requestId ?? null;

/** @deprecated Use `selectCardRequestResponse` and read `.nextAction.destinationMasked` */
export const selectCardRequestEmail = (root: { cardRequest: CardRequestState }) =>
  root.cardRequest.response?.nextAction?.destinationMasked ?? null;

/** @deprecated Use `selectCardRequestResponse` and read `.cardType` */
export const selectSelectedCardType = (root: { cardRequest: CardRequestState }) =>
  root.cardRequest.response?.cardType ?? null;

/** @deprecated Use `selectCardRequestResponse` and read `.cardDetails.vcPanMasked` */
export const selectMaskedCardPAN = (root: { cardRequest: CardRequestState }) =>
  root.cardRequest.response?.cardDetails?.vcPanMasked ?? null;

/** @deprecated Stub — PIN tracking moved to PinSetupForm local state */
export const selectPinRequested = (_root: { cardRequest: CardRequestState }) =>
  null as number | null;

/** @deprecated Stub — customer name from response not tracked separately */
export const selectCustomerName = (_root: { cardRequest: CardRequestState }) =>
  null as string | null;

/** @deprecated No-op action — slice no longer tracks these separately */
export const setMaskedCardPAN = (_pan: string) => ({ type: 'cardRequest/noop' as const });
export const setPinRequested = (_pin: number) => ({ type: 'cardRequest/noop' as const });
export const setCustomerName = (_name: string) => ({ type: 'cardRequest/noop' as const });
export const setCardRequest = (_payload: unknown) => ({ type: 'cardRequest/noop' as const });
export const setEmailOtpVerified = (_payload: unknown) => ({ type: 'cardRequest/noop' as const });
export const setBankOtpSent = (_payload: unknown) => ({ type: 'cardRequest/noop' as const });
export const setBankOtpVerified = (_payload: unknown) => ({ type: 'cardRequest/noop' as const });
export const selectCardRequestBankOtpDestination = (_root: { cardRequest: CardRequestState }) =>
  null as string | null;
export const selectCardRequestBankOtpChannel = (_root: { cardRequest: CardRequestState }) =>
  null as string | null;
