'use client'

import { usePathname } from 'next/navigation'

// Exact-path titles
const ROUTE_TITLES: Record<string, string> = {
  '/': 'Bank App',
  '/instacard': 'Instacard',

  // Add card
  '/debit': 'Add Debit Card',
  '/credit': 'Add Credit Card',
  '/prepaid': 'Add Prepaid Card',
  '/gift': 'Add Gift Card',

  // Card status
  '/card-status': 'Card Status',

  // PIN flows
  '/pin-change': 'Change PIN',
  '/pin-change/pin-setup': 'Set New PIN',

  // Forget PIN
  '/forget-pin/choose-options': 'Forgot PIN',
  '/forget-pin/phone-verification': 'Verify Phone',
  '/forget-pin/email-verification': 'Verify Email',
  '/forget-pin/create-pin': 'Create New PIN',

  // Add money
  '/add-money': 'Add Money',
  '/add-money/verify-email': 'Verify Email',
  '/add-money/success': 'Money Added',

  // Gift card
  '/add-a-gift-card': 'Add Gift Card',
  '/add-a-gift-card/one-time-activation': 'Activate Gift Card',
  '/gift-a-card': 'Gift a Card',
  '/ready-to-use': 'Ready to Use',
  '/share-gift-card': 'Share Gift Card',
  '/one-time-activation': 'Activation Code',

  // Statements & repayments
  '/make-repayments': 'Make Repayments',
  '/make-repayments/verify-otp': 'Verify OTP',
  '/make-repayments/verify-otp/success': 'Repayment Successful',

  // Limit setting
  '/limit-setting': 'Limit Setting',
  '/limit-setting/verify-email': 'Verify Email',

  // Make online payments
  '/make-online-payments': 'Make Online Payments',

  // Physical card linking
  '/scan': 'Scan & Pay',
  '/payment-amount': 'Payment',
  '/link-physical-card': 'Link Universal Card',
  '/link-virtual-card': 'Link Virtual Card',
  '/link-physical-card/sigma-cards-options': 'Sigma Cards Options',
  '/link-physical-card/face-verification': 'Face Verification',
  '/link-physical-card/bvn-verification': 'BVN Verification',
  '/link-physical-card/verify-email': 'Verify Email',
  '/link-physical-card/verify-otp': 'Verify OTP',
  '/link-physical-card/linked-success': 'Linked Successfully',
}

function getTitleFromPath(pathname: string): string {
  // 1. Exact match
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]

  // 2. Pattern-based routes with dynamic segments / query params
  if (pathname.startsWith('/card-detail')) return 'Card Details'
  if (pathname.startsWith('/manage-card')) return 'Manage Card'
  if (pathname.startsWith('/pin-setup')) return 'PIN Setup'
  if (pathname.startsWith('/how-to-use-card')) return 'How to Use Card'
  if (pathname.startsWith('/email-statements')) return 'Email Statements'
  if (pathname.startsWith('/make-online-payments/transaction')) return 'Transaction Receipt'
  if (pathname.startsWith('/otp')) return 'Verify OTP'
  if (pathname.startsWith('/success')) return 'Card Created'

  // 3. Fallback: derive from last URL segment
  const segment = pathname.split('/').filter(Boolean).pop() || ''
  return segment.replace(/-/g, ' ')
}

export default function RouteTitle() {
  const pathname = usePathname()
  const title = getTitleFromPath(pathname)

  return (
    <div className="shrink-0 rounded-t-3xl bg-light-gray h-[10%] -mt-1 relative z-20 py-2.5 px-4">
      <p className="text-text-primary text-sm text-center font-medium capitalize">{title}</p>
    </div>
  )
}
