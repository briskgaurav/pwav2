import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CardLinkStateResponse } from '@/types/cardLinking'

export type CardLinkingState = {
  issuerBankCode: string
  country: string
  mobileAppUserId: string
  customerId: string
  customerName: string
  bvn: string
  nin: string
  vcCardId: string
  response: CardLinkStateResponse | null
}

const initialState: CardLinkingState = {
  issuerBankCode: '',
  country: 'ZI',
  mobileAppUserId: '',
  customerId: '',
  customerName: '',
  bvn: '',
  nin: '',
  vcCardId: '',
  response: null,
}

const cardLinkingSlice = createSlice({
  name: 'cardLinking',
  initialState,
  reducers: {
    setCardLinkingData: (state, action: PayloadAction<Partial<CardLinkingState>>) => {
      return { ...state, ...action.payload }
    },
    resetCardLinkingData: () => initialState,
  },
  selectors: {
    selectCardLinkingData: (state) => state,
  },
})

export const { setCardLinkingData, resetCardLinkingData } = cardLinkingSlice.actions
export const { selectCardLinkingData } = cardLinkingSlice.selectors
export default cardLinkingSlice.reducer
