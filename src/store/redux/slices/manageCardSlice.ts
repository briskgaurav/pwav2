import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { FAQData } from '@/components/ui/FAQModal'

type ManageCardState = {
  isFaqOpen: boolean
  faqData: FAQData | null
}

const initialState: ManageCardState = {
  isFaqOpen: false,
  faqData: null,
}

const manageCardSlice = createSlice({
  name: 'manageCard',
  initialState,
  reducers: {
    openFaq: (state, action: PayloadAction<FAQData>) => {
      state.isFaqOpen = true
      state.faqData = action.payload
    },
    closeFaq: (state) => {
      state.isFaqOpen = false
    },
  },
  selectors: {
    selectIsFaqOpen: (state) => state.isFaqOpen,
    selectFaqData: (state) => state.faqData,
  },
})

export const { openFaq, closeFaq } = manageCardSlice.actions
export const { selectIsFaqOpen, selectFaqData } = manageCardSlice.selectors
export default manageCardSlice.reducer
