/**
 * Parsed data extracted from a dynamic QR code.
 */
export interface ParsedQRData {
  /** Merchant / beneficiary name */
  merchantName?: string
  /** Pre-filled amount (as string, no decimals expected) */
  amount?: string
  /** Description / transaction note */
  description?: string
  /** Raw QR string for reference */
  raw: string
}

/**
 * Parses a scanned QR code string and extracts payment-relevant fields.
 *
 * Supports:
 *  - UPI-style: upi://pay?pa=...&pn=...&am=...&tn=...
 *  - URL with query params: https://...?amount=...&name=...&note=...
 *  - JSON payload: {"amount":"500","merchantName":"Shop",...}
 *  - Plain text fallback
 */
export function parseQRData(raw: string): ParsedQRData {
  const result: ParsedQRData = { raw }

  // --- 1. UPI-style deep link ---
  if (/^upi:\/\//i.test(raw)) {
    try {
      const url = new URL(raw)
      const params = url.searchParams
      result.merchantName = params.get('pn') ?? params.get('name') ?? undefined
      result.amount = params.get('am') ?? params.get('amount') ?? undefined
      result.description = params.get('tn') ?? params.get('note') ?? undefined
      return result
    } catch { /* fall through */ }
  }

  // --- 2. JSON payload ---
  if (raw.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(raw) as unknown
      if (typeof parsed === 'object' && parsed !== null) {
        const json = parsed as Record<string, unknown>
        
        const getStr = (val: unknown): string | undefined => 
          typeof val === 'string' ? val : undefined
          
        const getStrOrNum = (val: unknown): string | undefined => 
          typeof val === 'string' || typeof val === 'number' ? String(val) : undefined

        result.merchantName = getStr(json.merchantName) ?? getStr(json.name) ?? getStr(json.merchant) ?? getStr(json.pn) ?? undefined
        result.amount = getStrOrNum(json.amount) ?? getStrOrNum(json.am) ?? undefined
        result.description = getStr(json.description) ?? getStr(json.note) ?? getStr(json.tn) ?? getStr(json.message) ?? undefined
      }
      return result
    } catch { /* fall through */ }
  }

  // --- 3. URL with query params ---
  try {
    const url = new URL(raw)
    if (['http:', 'https:'].includes(url.protocol)) {
      const params = url.searchParams
      result.merchantName = params.get('name') ?? params.get('merchantName') ?? params.get('pn') ?? undefined
      result.amount = params.get('amount') ?? params.get('am') ?? undefined
      result.description = params.get('note') ?? params.get('description') ?? params.get('tn') ?? params.get('message') ?? undefined
      return result
    }
  } catch { /* fall through */ }

  // --- 4. Plain text fallback ---
  // Nothing to extract, just return raw
  return result
}
