/**
 * ╔════════════════════════════════════════════════════════════════════════╗
 * ║  TEMPORARY — DELETE WHEN BACKEND DERIVES THESE FROM AUTHENTICATED USER ║
 * ╚════════════════════════════════════════════════════════════════════════╝
 *
 * Several backend endpoints currently demand customer-identity fields
 * (BVN, NIN, customerId, account numbers, gender, dob, recipient details,
 * etc.) that the frontend should NOT be supplying — they belong to the
 * backend, derivable from the authenticated `userId` in the session cookie.
 *
 * Until the backend ships that lookup, every host-context field is mocked
 * here so the rest of the app can be developed against a stable, typed
 * source. This file is the **single point of deletion**:
 *
 *   1. Backend stops asking for these fields.
 *   2. Delete this file.
 *   3. TypeScript will surface every consumer that still references it.
 *   4. Strip those fields from the request payloads.
 *
 * Do NOT add real production logic here. Do NOT import this file outside
 * of API-layer modules. Do NOT persist these values to storage.
 */

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
  mobileAppUserId: 'USR_1001',
  customerId: 'CUST_001',
  customerName: 'Amit Sharma',
  bvn: '12345678901',
  nin: '98765432109',
  gender: 'MALE',
  dob: '1990-01-15',

  accountNumber: '9987402179359',
  primaryAccountNumber: '631633482924',
  selectedBankAccountNumber: '900625216944943',
  poolAccount: 'POOL_DEFAULT',

  recipientName: 'Amit Sharma',
  recipientPhoneNumber: '+919876543210',
  recipientEmail: 'amit.sharma@example.com',
};
