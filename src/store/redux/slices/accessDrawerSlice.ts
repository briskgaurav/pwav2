import { createSlice } from '@reduxjs/toolkit'

type AccessDrawerState = {
  visible: boolean
}

const initialState: AccessDrawerState = {
  visible: false,
}

const accessDrawerSlice = createSlice({
  name: 'accessDrawer',
  initialState,
  reducers: {
    openAccessDrawer: (state) => {
      state.visible = true
    },
    closeAccessDrawer: (state) => {
      state.visible = false
    },
  },
  selectors: {
    selectAccessDrawerVisible: (state) => state.visible,
  },
})

export const { openAccessDrawer, closeAccessDrawer } = accessDrawerSlice.actions
export const { selectAccessDrawerVisible } = accessDrawerSlice.selectors
export default accessDrawerSlice.reducer
