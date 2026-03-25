import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type CardMode = 'virtual' | 'universal'

type CardModeState = {
  cardMode: CardMode
}

const initialState: CardModeState = {
  cardMode: 'virtual',
}

const cardModeSlice = createSlice({
  name: 'cardMode',
  initialState,
  reducers: {
    setCardMode: (state, action: PayloadAction<CardMode>) => {
      state.cardMode = action.payload
    },
  },
  selectors: {
    selectCardMode: (state) => state.cardMode,
  },
})

export const { setCardMode } = cardModeSlice.actions
export const { selectCardMode } = cardModeSlice.selectors
export default cardModeSlice.reducer
