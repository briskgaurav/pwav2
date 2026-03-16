import { formatAmountWithCommas } from '@/lib/format-amount'

declare global {
  interface Window {
    AndroidShare?: {
      share: (text: string) => void
    }
    AndroidApp?: {
      share: (text: string) => void
    }
  }
}

export interface ShareTextPayload {
  title: string
  text: string
  url?: string
}

export async function shareText(payload: ShareTextPayload) {
  if (typeof window === 'undefined') return

  // Try Android native share first
  if (window.AndroidShare) {
    window.AndroidShare.share(payload.text)
    return
  }

  if (window.AndroidApp) {
    window.AndroidApp.share(payload.text)
    return
  }

  const shareData = {
    title: payload.title,
    text: payload.text,
    url: payload.url ?? window.location.href,
  }

  try {
    // Try Web Share API
    if (typeof navigator !== 'undefined' && navigator.share) {
      // Check if we can share with text only (more compatible)
      const textOnlyData = { text: payload.text }
      if (navigator.canShare?.(textOnlyData)) {
        await navigator.share(textOnlyData)
        return
      }
      // Try with full data
      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
        return
      }
      // Fallback to just sharing text
      await navigator.share({ text: payload.text })
      return
    }

    // Fallback: copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(payload.text)
      alert('Receipt copied to clipboard!')
    } else if (typeof document !== 'undefined') {
      // Last resort fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = payload.text
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Receipt copied to clipboard!')
    }
  } catch (err) {
    // If share was cancelled by user, don't show error
    if (err instanceof Error && err.name === 'AbortError') {
      return
    }
    console.error('Share failed:', err)
    // Try clipboard as final fallback
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload.text)
        alert('Receipt copied to clipboard!')
        return
      }
    } catch {
      // ignore
    }
    alert('Unable to share. Please try again.')
  }
}

export interface PaymentShareData {
  amount: string
  recipientName: string
  upiId: string
  message: string
  transactionId: string
  date: string
}

export function formatPaymentShareText(data: PaymentShareData): string {
  const { amount, recipientName, upiId, message, transactionId, date } = data

  return `📄 Payment Receipt

💳 ${recipientName}
💰 Amount: ₦${formatAmountWithCommas(amount)}
📊 Status: Successful

📅 Date: ${date}
🔢 Transaction ID: ${transactionId}
📧 UPI ID: ${upiId}
${message ? `💬 Message: ${message}\n` : ''}
---
Powered by InstaCard`
}

export async function sharePaymentReceipt(data: PaymentShareData) {
  const text = formatPaymentShareText(data)
  await shareText({ title: 'Payment Receipt', text })
}

