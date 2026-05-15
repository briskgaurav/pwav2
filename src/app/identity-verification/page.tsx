import { redirect } from 'next/navigation'
import { routes } from '@/lib/routes'
import { headers } from 'next/headers'

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
