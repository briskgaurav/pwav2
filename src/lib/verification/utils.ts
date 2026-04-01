/** Mask an email: `john***e@gmail.com` */
export function maskEmail(email: string): string {
  const value = (email ?? '').trim().toLowerCase()
  const [local, domain] = value.split('@')
  if (!local || !domain) return value
  return `${local[0]}***${local.slice(-1)}@${domain}`
}

/** Mask last-4 of a numeric string: `****1234` */
export function maskNumber(value: string): string {
  const digits = (value ?? '').replace(/\D/g, '')
  if (digits.length <= 4) return '****'
  return `****${digits.slice(-4)}`
}

/**
 * Returns `true` when a DOB value is missing or clearly invalid
 * (null / empty / sentinel dates like 00/00/0000).
 */
export function isDobMissing(dob: string | null | undefined): boolean {
  if (dob == null || dob.trim() === '') return true
  const norm = dob.trim()
  return norm === '00/00/0000' || norm === '0000-00-00'
}

/**
 * Extracts the human-readable error message from a failed `fetch` response.
 * Falls back to a generic string if the body is not JSON or has no `message`.
 */
export async function parseApiError(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as { message?: string }
    if (json?.message) return json.message
  } catch {
    // non-JSON body — ignore
  }
  return 'Something went wrong'
}
