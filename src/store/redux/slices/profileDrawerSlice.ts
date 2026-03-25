import { createSlice } from '@reduxjs/toolkit'

type ProfileDrawerState = {
  visible: boolean
}

const initialState: ProfileDrawerState = {
  visible: false,
}

const profileDrawerSlice = createSlice({
  name: 'profileDrawer',
  initialState,
  reducers: {
    openProfileDrawer: (state) => {
      state.visible = true
    },
    closeProfileDrawer: (state) => {
      state.visible = false
    },
  },
  selectors: {
    selectProfileDrawerVisible: (state) => state.visible,
  },
})

export const { openProfileDrawer, closeProfileDrawer } = profileDrawerSlice.actions
export const { selectProfileDrawerVisible } = profileDrawerSlice.selectors
export default profileDrawerSlice.reducer
