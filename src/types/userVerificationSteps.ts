export type UserInstaCardSteps = 
  | 'select_card' 
  | 'prepare_gift_card'
  | 'registered_email_verification'
  | 'bank_verification'
  | 'user_consent'
  | 'success'
  | 'gift_card_amount'
  | 'card_activation';             // ← add this so onNext('complete') works

export type BankVerifictionMethod = 'soft_token' | 'otp';  // ← underscore, not dash
export type UIBankStep = 'select' | BankVerifictionMethod;  // 'select' | 'soft_token' | 'otp'