import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CardLinkStateResponse } from '@/types/cardLinking'

export interface CardLinkState {
  response: CardLinkStateResponse | null;
}

const initialState: CardLinkState = {
  response: null,
}

const cardLinkSlice = createSlice({
  name: 'cardLink',
  initialState,
  reducers: {
    setCardLinkState: (
      state,
      action: PayloadAction<CardLinkStateResponse>
    ) => {
      state.response = action.payload;
    },
    clearCardLinkState: (state) => {
      state.response = null;
    },
  },
  selectors: {
    selectCardLinkResponse: (state) => state.response,
    selectLinkNextActionCode: (state) => state.response?.nextAction?.code,
  },
});

export const { setCardLinkState, clearCardLinkState } = cardLinkSlice.actions
export const { selectCardLinkResponse, selectLinkNextActionCode } = cardLinkSlice.selectors
export default cardLinkSlice.reducer
