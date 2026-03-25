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
  scanpay: "/instacard/scan-and-pay",
  makePayment: "/instacard/scan-and-pay/make-payment",

  // ADD INSTACARD
  addInstacard: "/instacard/add-instacard",
  addCard: (type: CardType) => `/instacard/add-instacard/${type}`,
  otp: (type: CardType) => `/instacard/add-instacard/otp?type=${type}`,
  success: (type: CardType) => `/instacard/add-instacard/success?type=${type}`,
  pinSetup: (type: CardType) => `/instacard/add-instacard/pin-setup?type=${type}`,
  howToUseCard: (type: CardType) =>
    `/instacard/add-instacard/how-to-use-card?type=${type}`,

  // Add universal card flow
  addUniversalCard: "/instacard/add-universal-card",
  addUniversalVerifyMobile: "/instacard/add-universal-card/verify-mobile",
  addUniversalVerifyEmail: "/instacard/add-universal-card/verify-email",
  addUniversalPinSetup: "/instacard/add-universal-card/pin-setup",
  addUniversalSuccess: "/instacard/add-universal-card/success",

  //ADD GIFT CARD
  giftACard: "/add-instacard/gift-a-card",
  giftACardReadyToUse: "/add-instacard/gift-a-card/ready-to-use",
  shareGiftCard: "/add-instacard/gift-a-card/share-gift-card",
  giftCardActivationCode: "/add-instacard/gift-a-card/one-time-activation",

  // MANAGE INSTACARD
  pinChange: "/instacard/manage-card/pin-change",
  pinChangeSetup: "/instacard/manage-card/pin-change/pin-setup",
  limitSetting: "/instacard/manage-card/limit-setting",
  limitSettingVerifyEmail: "/instacard/manage-card/limit-setting/verify-email",
  manageCard: (type: CardType, cardMode?: "virtual" | "universal") =>
    `/instacard/manage-card/${type}${cardMode ? `?mode=${cardMode}` : ""}`,
  cardStatus: "/instacard/manage-card/card-status",
  emailStatements: (type: CardType) =>
    `/instacard/manage-card/email-statements/${type}`,
  makeRepayments: "/instacard/manage-card/make-repayments",
  makeRepaymentsVerifyOtp: "/instacard/manage-card/make-repayments/verify-otp",
  makeRepaymentsVerifyOtpSuccess:
    "/instacard/manage-card/make-repayments/verify-otp/success",

  // CLAIM A GIFT CARD
  claimGiftCard: "/instacard/claim-gift-card",
  claimGiftCardEmailVerify: "/instacard/claim-gift-card/email-verify-gift",
  claimGiftCardOneTimeActivation:
    "/instacard/claim-gift-card/one-time-activation",

  // CardDetail
  cardDetail: (type: CardType) => `/instacard/card-detail/${type}`,

  // Make online payments
  makeOnlinePayments: "/instacard/make-online-payments",
  transactionReceipt: (txnId: string) =>
    `/instacard/make-online-payments/transaction/${txnId}`,

  // Add money
  addMoney: "/instacard/manage-card/prepaid/add-money",
  addMoneyVerifyEmail: "/instacard/manage-card/prepaid/add-money/verify-email",
  addMoneySuccess: "/instacard/manage-card/prepaid/add-money/success",

  // PIN flows
  chooseOptions: "/forget-pin/choose-options",
  forgetPinPhoneVerification: "/forget-pin/phone-verification",
  forgetPinEmailVerification: "/forget-pin/email-verification",


  // Virtual card linking
  linkVirtualCard: "/instacard/link-virtual-card",

  // Physical card linking
  linkPhysicalCard: "/instacard/link-universal-card",
  sigmaCardsOptions: "/instacard/link-universal-card/sigma-cards-options",
  faceVerification: "/instacard/link-universal-card/face-verification",
  bvnVerification: "/instacard/link-universal-card/bvn-verification",
  linkVerifyEmail: "/instacard/link-universal-card/verify-email",
  linkVerifyOtp: "/instacard/link-universal-card/verify-otp",
  linkedSuccess: "/instacard/link-universal-card/linked-success",


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

} as const;
