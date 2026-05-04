import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { routes } from '@/lib/routes'

/**
 * ID 1 - BVN Only User (Gaurav)
 *   - Has BVN details, no NIN
 *   - Liveness verified: true
 *   - DOB: valid
 *   - Scenario: Standard BVN-verified user
 * 
 * ID 2 - NIN Only User (Saurav)
 *   - Has NIN details, no BVN
 *   - Liveness verified: true
 *   - DOB: valid
 *   - Scenario: Standard NIN-verified user
 * 
 * ID 3 - Both BVN & NIN User (Hemant)
 *   - Has both BVN and NIN details
 *   - Liveness verified: true
 *   - DOB: valid
 *   - Scenario: Fully verified user with both documents
 * 
 * ID 4 - No Verification Data User (Rahul)
 *   - No BVN, no NIN
 *   - Liveness verified: true
 *   - Status: false (404)
 *   - Scenario: User with no identity documents on file
 * 
 * ID 5 - Name Mismatch User (Chidera) [DEFAULT]
 *   - Has both BVN and NIN
 *   - Bank name differs from BVN/NIN name
 *   - Liveness verified: true
 *   - Scenario: User with name discrepancy between documents
 * 
 * ID 6 - Liveness Failed User (Amina)
 *   - Has BVN, no NIN
 *   - Liveness verified: FALSE
 *   - DOB: null
 *   - Scenario: User who failed liveness/face verification
 * 
 * ID 7 - Missing DOB User (Tomi)
 *   - No BVN, no NIN
 *   - Liveness verified: true
 *   - DOB: null
 *   - Scenario: User with incomplete profile (missing date of birth)
 */
export default async function IdentityVerificationPage({
  searchParams,
}: {
  searchParams?: { id?: string }
}) {

  const id = searchParams?.id ?? '1'

  // If KYC already completed, skip the entire flow.
  // Fetch from our own API (server-side) so this is stateful and consistent.
  const h = await headers()
  const host = h.get('host')
  const proto = process.env.NODE_ENV === 'development' ? 'http' : 'https'

  if (host) {
    try {
      const res = await fetch(`${proto}://${host}/api/userdata?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
      if (res.ok) {
        const json = (await res.json()) as { data?: { kyc_completed?: boolean } }
        if (json?.data?.kyc_completed === true) {
          redirect(routes.instacard)
        }
      }
    } catch {
      // fall back to starting flow
    }
  }

  redirect(`${routes.livenessVerification}?id=${encodeURIComponent(id)}`)
}
