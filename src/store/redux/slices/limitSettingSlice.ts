import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type LimitTab = 'domestic' | 'international'

type LimitSettingState = {
  activeTab: LimitTab
}

const initialState: LimitSettingState = {
  activeTab: 'domestic',
}

const limitSettingSlice = createSlice({
  name: 'limitSetting',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<LimitTab>) => {
      state.activeTab = action.payload
    },
  },
  selectors: {
    selectActiveTab: (state) => state.activeTab,
  },
})

export const { setActiveTab } = limitSettingSlice.actions
export const { selectActiveTab } = limitSettingSlice.selectors
export default limitSettingSlice.reducer
