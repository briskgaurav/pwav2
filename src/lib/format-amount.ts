const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
]

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety',
]

function chunkToWords(n: number): string {
  if (n === 0) return ''
  if (n < 20) return ONES[n]
  if (n < 100) return `${TENS[Math.floor(n / 10)]} ${ONES[n % 10]}`.trim()
  return `${ONES[Math.floor(n / 100)]} Hundred ${chunkToWords(n % 100)}`.trim()
}

export function convertToWords(num: number): string {
  if (!num || num === 0) return ''
  const integer = Math.floor(Math.abs(num))
  if (integer === 0) return ''

  const parts: string[] = []
  const scales = ['', 'Thousand', 'Million', 'Billion']
  let remaining = integer
  let scaleIndex = 0

  while (remaining > 0) {
    const chunk = remaining % 1000
    if (chunk > 0) {
      const words = chunkToWords(chunk)
      parts.unshift(scales[scaleIndex] ? `${words} ${scales[scaleIndex]}` : words)
    }
    remaining = Math.floor(remaining / 1000)
    scaleIndex++
  }

  return parts.join(' ').trim()
}

export function formatAmountWithCommas(amount: string): string {
  if (!amount) return '0'
  const [integer, decimal] = amount.split('.')
  const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimal !== undefined ? `${formatted}.${decimal}` : formatted
}
