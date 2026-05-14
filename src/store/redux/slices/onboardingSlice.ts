import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface BankUserProfile {
  customerId: string
  customerName: string
  bvn: string
  nin: string
  email: string
  mobile: string
}

export interface OnboardingSession {
  sessionId: string | null
  currentStep: number
  status: string | null
  expiresInSeconds: number | null
  flowEndpoint: string | null
}

export interface LivenessVerification {
  islivenessVerified: boolean
  confidence: number
  threshold: number
  actionsList: string[]
  mock?: boolean
}

export interface NameMatch {
  status: string
  proceed: boolean
  nameFromBank: string
  nameFromNationalIds: string
  percentageMatch: number
  mock?: boolean
}

export interface FaceMatch {
  isFaceVerified: boolean
  faceMatchScore: number
  mock?: boolean
}

export interface ContactDetails {
  mobile: string[]
  email: string[]
  actualMobile?: string
  actualEmail?: string
  mock?: boolean
}

export interface SelectedVerificationMethod {
  selectedVerificationMethod: 'EMAIL' | 'MOBILE'
  selectedMaskedValue: string
  selectedActualValue: string
}

export interface IdentityOtp {
  otpSent: boolean
  contactType: string
  value: string
  expiresInSeconds: number
  mockOtp?: string
  mock?: boolean
}

export interface IdentityOtpVerification {
  verified: boolean
  verifiedValue: string
  isEmailVerified: boolean
  isPhoneNumberVerified: boolean
  mock?: boolean
}

export interface RegisteredEmailOtp {
  otpSent: boolean
  email: string
  expiresInSeconds: number
  mockOtp?: string
  mock?: boolean
}

export interface RegisteredEmailVerification {
  userProfileStatus: string
  registeredEmail: string
  sessionStatus: string
  currentStep: number
  mock?: boolean
}

export interface OnboardingState {
  bankUserProfile: BankUserProfile | null
  onboardingSession: OnboardingSession
  livenessVerification: LivenessVerification | null
  nameMatch: NameMatch | null
  faceMatch: FaceMatch | null
  contactDetails: ContactDetails | null
  selectedVerificationMethod: SelectedVerificationMethod | null
  identityOtp: IdentityOtp | null
  identityOtpVerification: IdentityOtpVerification | null
  registeredEmailOtp: RegisteredEmailOtp | null
  registeredEmailVerification: RegisteredEmailVerification | null
  userProfileStatus: string | null
  isMockMode: boolean
  apiErrors: string[]
}

const initialState: OnboardingState = {
  bankUserProfile: null,
  onboardingSession: {
    sessionId: null,
    currentStep: 0,
    status: null,
    expiresInSeconds: null,
    flowEndpoint: null,
  },
  livenessVerification: null,
  nameMatch: null,
  faceMatch: null,
  contactDetails: null,
  selectedVerificationMethod: null,
  identityOtp: null,
  identityOtpVerification: null,
  registeredEmailOtp: null,
  registeredEmailVerification: null,
  userProfileStatus: null,
  isMockMode: false,
  apiErrors: [],
}

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setBankUserProfile: (state, action: PayloadAction<BankUserProfile>) => {
      state.bankUserProfile = action.payload
    },
    setOnboardingSession: (state, action: PayloadAction<OnboardingSession>) => {
      state.onboardingSession = action.payload
    },
    updateCurrentStep: (state, action: PayloadAction<number>) => {
      state.onboardingSession.currentStep = action.payload
    },
    setLivenessVerification: (state, action: PayloadAction<LivenessVerification>) => {
      state.livenessVerification = action.payload
    },
    setNameMatch: (state, action: PayloadAction<NameMatch>) => {
      state.nameMatch = action.payload
    },
    setFaceMatch: (state, action: PayloadAction<FaceMatch>) => {
      state.faceMatch = action.payload
    },
    setContactDetails: (state, action: PayloadAction<ContactDetails>) => {
      state.contactDetails = action.payload
    },
    setSelectedVerificationMethod: (state, action: PayloadAction<SelectedVerificationMethod>) => {
      state.selectedVerificationMethod = action.payload
    },
    setIdentityOtp: (state, action: PayloadAction<IdentityOtp>) => {
      state.identityOtp = action.payload
    },
    setIdentityOtpVerification: (state, action: PayloadAction<IdentityOtpVerification>) => {
      state.identityOtpVerification = action.payload
    },
    setRegisteredEmailOtp: (state, action: PayloadAction<RegisteredEmailOtp>) => {
      state.registeredEmailOtp = action.payload
    },
    setRegisteredEmailVerification: (state, action: PayloadAction<RegisteredEmailVerification>) => {
      state.registeredEmailVerification = action.payload
    },
    setUserProfileStatus: (state, action: PayloadAction<string>) => {
      state.userProfileStatus = action.payload
    },
    setMockMode: (state, action: PayloadAction<boolean>) => {
      state.isMockMode = action.payload
    },
    addApiError: (state, action: PayloadAction<string>) => {
      state.apiErrors.push(action.payload)
    },
    resetOnboarding: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const {
  setBankUserProfile,
  setOnboardingSession,
  updateCurrentStep,
  setLivenessVerification,
  setNameMatch,
  setFaceMatch,
  setContactDetails,
  setSelectedVerificationMethod,
  setIdentityOtp,
  setIdentityOtpVerification,
  setRegisteredEmailOtp,
  setRegisteredEmailVerification,
  setUserProfileStatus,
  setMockMode,
  addApiError,
  resetOnboarding,
} = onboardingSlice.actions

export default onboardingSlice.reducer
