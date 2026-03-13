import type { CardType } from './types'

export const routes = {
  home: '/',
  instacard: '/instacard',

  // Add card flows
  addCard: (type: CardType) => `/${type}`,
  addInstacard: '/add-instacard',
  otp: (type: CardType) => `/otp?type=${type}`,
  success: (type: CardType) => `/success?type=${type}`,

  // Card detail & management
  cardDetail: (type: CardType) => `/card-detail/${type}`,
  manageCard: (type: CardType, cardMode?: 'virtual' | 'universal') =>
    `/manage-card/${type}${cardMode ? `?mode=${cardMode}` : ''}`,
  cardStatus: '/card-status',

  // PIN flows
  pinSetup: (type: CardType) => `/pin-setup?type=${type}`,
  pinChange: '/pin-change',
  pinChangeSetup: '/pin-change/pin-setup',
  chooseOptions: '/forget-pin/choose-options',
  forgetPinPhoneVerification: '/forget-pin/phone-verification',
  forgetPinEmailVerification: '/forget-pin/email-verification',
  emailVerifyGift: '/add-a-gift-card/email-verify-gift',

  // Post-setup
  howToUseCard: (type: CardType) => `/how-to-use-card?type=${type}`,

  // Add money
  addMoney: '/add-money',
  addMoneyVerifyEmail: '/add-money/verify-email',
  addMoneySuccess: '/add-money/success',

  // Gift card
  addGiftCard: '/add-a-gift-card',
  giftCardActivation: '/add-a-gift-card/one-time-activation',
  giftACard: '/gift-a-card',
  readyToUse: '/ready-to-use',
  shareGiftCard: '/share-gift-card',
  oneTimeActivation: '/one-time-activation',

  // Statements
  emailStatements: (type: CardType) => `/email-statements/${type}`,
  makeRepayments: '/make-repayments',
  makeRepaymentsVerifyOtp: '/make-repayments/verify-otp',
  makeRepaymentsVerifyOtpSuccess: '/make-repayments/verify-otp/success',

  // Limit setting
  limitSetting: '/limit-setting',
  limitSettingVerifyEmail: '/limit-setting/verify-email',

  // Make online payments
  makeOnlinePayments: '/make-online-payments',
  transactionReceipt: (txnId: string) => `/make-online-payments/transaction/${txnId}`,

  // Add universal card flow
  addUniversalCard: '/add-universal-card',
  addUniversalFaceVerification: '/add-universal-card/face-verification',
  addUniversalVerifyMobile: '/add-universal-card/verify-mobile',
  addUniversalVerifyEmail: '/add-universal-card/verify-email',
  addUniversalPinSetup: '/add-universal-card/pin-setup',
  addUniversalSuccess: '/add-universal-card/success',

  // Scan & Pay
  scan: '/scan',
  paymentAmount: '/payment-amount',
  paymentSuccess: '/payment-success',

  // Registration / KYC flow
  registrationVerificationMethod: '/registration/verification-method',
  registrationVerificationOtp: '/registration/verification-otp',
  registrationAcceptTerms: '/registration/accept-terms',
  registrationKycSuccess: '/registration/kyc-success',
  registrationContinueOrRegister: '/registration/continue-or-register',
  registrationNewEmail: '/registration/new-email',
  registrationVerifyExistingEmail: '/registration/verify-existing-email',
  registrationWithExistingEmailSuccess: '/registration/with-existing-email-success',

  // Physical card linking
  linkPhysicalCard: '/link-physical-card',
  linkVirtualCard: '/link-virtual-card',
  sigmaCardsOptions: '/link-physical-card/sigma-cards-options',
  faceVerification: '/link-physical-card/face-verification',
  bvnVerification: '/link-physical-card/bvn-verification',
  linkVerifyEmail: '/link-physical-card/verify-email',
  linkVerifyOtp: '/link-physical-card/verify-otp',
  linkedSuccess: '/link-physical-card/linked-success',
} as const
