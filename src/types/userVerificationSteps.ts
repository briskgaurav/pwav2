export type UserInstaCardSteps = 
  | 'select_card' 
  | 'registered_email_verification' 
  | 'bank_verification'
  | 'user_consent'
  | 'success';             // ← add this so onNext('complete') works

export type BankVerifictionMethod = 'soft_token' | 'otp';  // ← underscore, not dash
export type UIBankStep = 'select' | BankVerifictionMethod;  // 'select' | 'soft_token' | 'otp'