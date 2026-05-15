import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type LivenessStep = 
  | 'splash' 
  | 'bvnNinEntry' 
  | 'facescan' 
  | 'review' 
  | 'contactDetails' 
  | 'identityOtpMethod' 
  | 'identityOtpVerify' 
  | 'registrationEmailOtpVerify'
  | 'success'

type ContactDetails = {
  email?: string
  phone?: string
}

type LivenessState = {
  currentStep: LivenessStep
  nameMatched: boolean
  hasBvnNin: boolean
  sessionId: string | null
  livenessVerified: boolean
  contactDetails: ContactDetails | null
  selectedVerificationMethod: 'email' | 'phone' | null
  identityOtpSent: boolean
  identityOtpVerified: boolean
  registrationEmailOtpSent: boolean
  registrationEmailOtpVerified: boolean
}

const initialState: LivenessState = {
  currentStep: 'splash',
  nameMatched: true,
  hasBvnNin: true,
  sessionId: null,
  livenessVerified: false,
  contactDetails: null,
  selectedVerificationMethod: null,
  identityOtpSent: false,
  identityOtpVerified: false,
  registrationEmailOtpSent: false,
  registrationEmailOtpVerified: false,
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
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload
    },
    setLivenessVerified: (state, action: PayloadAction<boolean>) => {
      state.livenessVerified = action.payload
    },
    setContactDetails: (state, action: PayloadAction<ContactDetails>) => {
      state.contactDetails = action.payload
    },
    setSelectedVerificationMethod: (state, action: PayloadAction<'email' | 'phone'>) => {
      state.selectedVerificationMethod = action.payload
    },
    setIdentityOtpSent: (state, action: PayloadAction<boolean>) => {
      state.identityOtpSent = action.payload
    },
    setIdentityOtpVerified: (state, action: PayloadAction<boolean>) => {
      state.identityOtpVerified = action.payload
    },
    setRegistrationEmailOtpSent: (state, action: PayloadAction<boolean>) => {
      state.registrationEmailOtpSent = action.payload
    },
    setRegistrationEmailOtpVerified: (state, action: PayloadAction<boolean>) => {
      state.registrationEmailOtpVerified = action.payload
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
        case 'review':
          state.currentStep = 'contactDetails'
          break
        case 'contactDetails':
          state.currentStep = 'identityOtpMethod'
          break
        case 'identityOtpMethod':
          state.currentStep = 'identityOtpVerify'
          break
        case 'identityOtpVerify':
          state.currentStep = 'registrationEmailOtpVerify'
          break
        case 'registrationEmailOtpVerify':
          state.currentStep = 'success'
          break
        default:
          break
      }
    },
    resetFlow: (state) => {
      state.currentStep = 'splash'
      state.nameMatched = true
      state.hasBvnNin = true
      state.sessionId = null
      state.livenessVerified = false
      state.contactDetails = null
      state.selectedVerificationMethod = null
      state.identityOtpSent = false
      state.identityOtpVerified = false
      state.registrationEmailOtpSent = false
      state.registrationEmailOtpVerified = false
    },
  },
})

export const {
  setStep,
  setNameMatched,
  setHasBvnNin,
  setSessionId,
  setLivenessVerified,
  setContactDetails,
  setSelectedVerificationMethod,
  setIdentityOtpSent,
  setIdentityOtpVerified,
  setRegistrationEmailOtpSent,
  setRegistrationEmailOtpVerified,
  nextStep,
  resetFlow,
} = livenessSlice.actions
export default livenessSlice.reducer
