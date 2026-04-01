import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type LivenessStep = 'splash' | 'bvnNinEntry' | 'facescan' | 'review'

type LivenessState = {
  currentStep: LivenessStep
  nameMatched: boolean
  hasBvnNin: boolean
}

const initialState: LivenessState = {
  currentStep: 'splash',
  nameMatched: true,
  hasBvnNin: true,
}

const livenessSlice = createSlice({
  name: 'liveness',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<LivenessStep>) => {
      state.currentStep = action.payload
    },
    setNameMatched: (state, action: PayloadAction<boolean>) => {
      state.nameMatched = action.payload
    },
    setHasBvnNin: (state, action: PayloadAction<boolean>) => {
      state.hasBvnNin = action.payload
    },
    nextStep: (state) => {
      switch (state.currentStep) {
        case 'splash':
          state.currentStep = state.hasBvnNin ? 'facescan' : 'bvnNinEntry'
          break
        case 'bvnNinEntry':
          state.currentStep = 'facescan'
          break
        case 'facescan':
          state.currentStep = 'review'
          break
        default:
          break
      }
    },
    resetFlow: (state) => {
      state.currentStep = 'splash'
      state.nameMatched = true
    },
  },
})

export const { setStep, setNameMatched, setHasBvnNin, nextStep, resetFlow } = livenessSlice.actions
export default livenessSlice.reducer
