import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type IdVerificationStep = 'chooseMethod' | 'verificationConfirm' | 'otpVerify' | 'confirmBankDetails'

export type VerificationMethod = 'email' | 'phone' | null

type IdVerificationState = {
  currentStep: IdVerificationStep
  verificationMethod: VerificationMethod
}

const initialState: IdVerificationState = {
  currentStep: 'chooseMethod',
  verificationMethod: null,
}

const idVerificationSlice = createSlice({
  name: 'idVerification',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<IdVerificationStep>) => {
      state.currentStep = action.payload
    },
    setVerificationMethod: (state, action: PayloadAction<VerificationMethod>) => {
      state.verificationMethod = action.payload
    },
    nextStep: (state) => {
      switch (state.currentStep) {
        case 'chooseMethod':
          state.currentStep = 'verificationConfirm'
          break
        case 'verificationConfirm':
          state.currentStep = 'otpVerify'
          break
        case 'otpVerify':
          state.currentStep = 'confirmBankDetails'
          break
        default:
          break
      }
    },
    resetFlow: (state) => {
      state.currentStep = 'chooseMethod'
      state.verificationMethod = null
    },
  },
})

export const { setStep, setVerificationMethod, nextStep, resetFlow } = idVerificationSlice.actions
export default idVerificationSlice.reducer
