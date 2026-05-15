export type LinkLinkVirtualCardSteps =
  | 'initiating'
  | 'verify_vc_pin'
  | 'verify_uc_pin'
  | "virtual_card_selection"
  | "universal_card_selection"
  | "linking_success"


// export type BankVerifictionMethod = "soft_token" | "otp"; // ← underscore, not dash
// export type UIBankStep = "select" | BankVerifictionMethod; // 'select' | 'soft_token' | 'otp'
