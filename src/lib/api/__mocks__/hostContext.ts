/**
 * ╔════════════════════════════════════════════════════════════════════════╗
 * ║  TEMPORARY — DELETE WHEN BACKEND DERIVES THESE FROM AUTHENTICATED USER ║
 * ╚════════════════════════════════════════════════════════════════════════╝
 *
 * The current `/api/v1/card/request` contract requires the frontend to
 * supply customer identity fields (BVN, NIN, customerId, etc.). This is
 * the wrong trust boundary: backend should look these up from its own
 * user record using the authenticated `userId` in the session cookie.
 *
 * Until the backend ships that lookup, every host-context field is mocked
 * here so the rest of the app can be developed against a stable, typed
 * source. This file is the **single point of deletion**:
 *
 *   1. Backend stops asking for these fields.
 *   2. Delete this file.
 *   3. TypeScript will surface every consumer that still references it.
 *   4. Strip those fields from `requestCard` (and any other API call).
 *
 * Do NOT add real production logic here. Do NOT import this file outside
 * of API-layer modules. Do NOT persist these values to storage.
 */

export interface HostContext {
  issuerBankCode: string;
  country: string;
  mobileAppUserId: string;
  customerId: string;
  customerName: string;
  bvn: string;
  nin: string;
  accountNumber: string;
}

/** Mock host-supplied identity. Replace with real values via DevTools if testing edge cases. */
export const MOCK_HOST_CONTEXT: HostContext = {
  "issuerBankCode": "HDFC",
  "country": "IN",
  "mobileAppUserId": "USR_1001",
  "customerId": "CUST_001",
  "customerName": "Amit Sharma",
  "bvn": "12345678901",
  "nin": "98765432109",
  "accountNumber": "9987402179359"
};
