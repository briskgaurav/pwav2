import { CardType } from "./types";

export const routes = {
  // HOME
  FCMB: "/",
  home: "/",
  // IDENTITY VERIFICATION
  identityRegistrationProcess: "/identity-verification",
  livenessVerification: "/identity-verification/liveness-verification",
  IdVerification: "/identity-verification/id-verification",
  EmailRegistration: "/identity-verification/email-registration",
  instacard: "/instacard",
  // QR PAYMENTS
  scanpay: "/scan-and-pay",
  makePayment: "/scan-and-pay/make-payment",
  // ADD INSTACARD
  addInstacard: "/add-instacard",
  addCard: (type: CardType) => `/add-instacard/${type}`,
  otp: (type: CardType) => `/add-instacard/otp?type=${type}`,
  success: (type: CardType) => `/add-instacard/success?type=${type}`,
  pinSetup: (type: CardType) => `/add-instacard/pin-setup?type=${type}`,
  howToUseCard: (type: CardType) =>
    `/add-instacard/how-to-use-card?type=${type}`,
  // MANAGE INSTACARD
  pinChange: "/manage-card/pin-change",
  pinChangeSetup: "/manage-card/pin-change/pin-setup",
  limitSetting: "manage-card/limit-setting",
  limitSettingVerifyEmail: "/limit-setting/verify-email",





  cardDetail: (type: CardType) => `/card-detail/${type}`,
  manageCard: (type: CardType, cardMode?: "virtual" | "universal") =>
    `/manage-card/${type}${cardMode ? `?mode=${cardMode}` : ""}`,
  cardStatus: "/manage-card/card-status",

  // PIN flows
  chooseOptions: "/forget-pin/choose-options",
  forgetPinPhoneVerification: "/forget-pin/phone-verification",
  forgetPinEmailVerification: "/forget-pin/email-verification",
  emailVerifyGift: "/add-a-gift-card/email-verify-gift",

  // Post-setup

  // Add money
  addMoney: "/add-money",
  addMoneyVerifyEmail: "/add-money/verify-email",
  addMoneySuccess: "/add-money/success",

  // Gift card
  addGiftCard: "/add-a-gift-card",
  giftCardActivation: "/add-a-gift-card/one-time-activation",
  giftACard: "/gift-a-card",
  readyToUse: "/ready-to-use",
  shareGiftCard: "/share-gift-card",
  oneTimeActivation: "/one-time-activation",

  // Statements
  emailStatements: (type: CardType) => `/email-statements/${type}`,
  makeRepayments: "/make-repayments",
  makeRepaymentsVerifyOtp: "/make-repayments/verify-otp",
  makeRepaymentsVerifyOtpSuccess: "/make-repayments/verify-otp/success",

  // Make online payments
  makeOnlinePayments: "/make-online-payments",
  transactionReceipt: (txnId: string) =>
    `/make-online-payments/transaction/${txnId}`,

  // Add universal card flow
  addUniversalCard: "/add-universal-card",
  addUniversalFaceVerification: "/add-universal-card/face-verification",
  addUniversalVerifyMobile: "/add-universal-card/verify-mobile",
  addUniversalVerifyEmail: "/add-universal-card/verify-email",
  addUniversalPinSetup: "/add-universal-card/pin-setup",
  addUniversalSuccess: "/add-universal-card/success",

  // Scan & Pay
  scan: "/scan",
  paymentAmount: "/payment-amount",
  paymentSuccess: "/payment-success",

  // Registration / KYC flow
  registrationVerificationMethod: "/registration/verification-method",
  registrationVerificationConfirm: "/registration/verification-confirm",
  registrationVerificationOtp: "/registration/verification-otp",
  registrationAcceptTerms: "/registration/accept-terms",
  registrationKycSuccess: "/registration/kyc-success",
  registrationContinueOrRegister: "/registration/continue-or-register",
  registrationNewEmail: "/registration/new-email",
  registrationVerifyExistingEmail: "/registration/verify-existing-email",
  registrationWithExistingEmailSuccess:
    "/registration/with-existing-email-success",

  // Physical card linking
  linkPhysicalCard: "/link-physical-card",
  linkVirtualCard: "/link-virtual-card",
  sigmaCardsOptions: "/link-physical-card/sigma-cards-options",
  faceVerification: "/link-physical-card/face-verification",
  bvnVerification: "/link-physical-card/bvn-verification",
  linkVerifyEmail: "/link-physical-card/verify-email",
  linkVerifyOtp: "/link-physical-card/verify-otp",
  linkedSuccess: "/link-physical-card/linked-success",
} as const;
