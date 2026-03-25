import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type LivenessStep = 'splash' | 'facescan' | 'review' | 'verifydone'

type LivenessState = {
  currentStep: LivenessStep
}

const initialState: LivenessState = {
  currentStep: 'splash',
}

const livenessSlice = createSlice({
  name: 'liveness',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<LivenessStep>) => {
      state.currentStep = action.payload
    },
    nextStep: (state) => {
      switch (state.currentStep) {
        case 'splash':
          state.currentStep = 'facescan'
          break
        case 'facescan':
          state.currentStep = 'review'
          break
        case 'review':
          state.currentStep = 'verifydone'
          break
        default:
          break
      }
    },
    resetFlow: (state) => {
      state.currentStep = 'splash'
    },
  },
})

export const { setStep, nextStep, resetFlow } = livenessSlice.actions
export default livenessSlice.reducer

