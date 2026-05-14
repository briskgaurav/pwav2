export interface HostContext {
  // Identity
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  gender: string;
  /** ISO-8601 date (YYYY-MM-DD). */
  dob: string;

  // Bank accounts
  accountNumber: string;
  primaryAccountNumber: string;
  selectedBankAccountNumber: string;
  /**
   * Backend-internal pooling/settlement account. The frontend has no
   * legitimate reason to know about this — when backend stops requiring
   * it on the request, drop it from here AND from {@link cards.submitConsent}.
   */
  poolAccount: string;

  // Recipient (cardholder contact)
  recipientName: string;
  recipientPhoneNumber: string;
  recipientEmail: string;
}

/** Mock host-supplied identity. Replace with real values via DevTools if testing edge cases. */
export const MOCK_HOST_CONTEXT: HostContext = {
  issuerBankCode: 'HDFC',
  country: 'IN',
  mobileAppUserId: 'USR_0222',
  customerId: 'CUST_2277',
  customerName: 'Amit Sharma',
  bvn: '12345672277',
  nin: '98765432277',
  gender: 'MALE',
  dob: '1990-01-16',

  accountNumber: '9987402172377',
  primaryAccountNumber: '631633482377',
  selectedBankAccountNumber: '900625216942377',
  poolAccount: 'POOL_DEFAULT',

  recipientName: 'Amit Sharma',
  recipientPhoneNumber: '+919876542377',
  recipientEmail: 'sunil.codewrap237@gmail.com',
};
