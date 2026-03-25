import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_PIN } from '@/lib/types'

type CardState = {
  pin: string
}

const initialState: CardState = {
  pin: DEFAULT_PIN,
}

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    setPin: (state, action: PayloadAction<string>) => {
      state.pin = action.payload
    },
    resetPin: (state) => {
      state.pin = DEFAULT_PIN
    },
  },
  selectors: {
    selectPin: (state) => state.pin,
    selectVerifyPin: (state, input: string) => input === state.pin,
  },
})

export const { setPin, resetPin } = cardSlice.actions
export const { selectPin, selectVerifyPin } = cardSlice.selectors
export default cardSlice.reducer
