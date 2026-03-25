'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import { Check, User, AtSign, Receipt, Calendar, Share2 } from 'lucide-react'
import { formatAmountWithCommas } from '@/lib/format-amount'
import { sharePaymentReceipt } from '@/lib/fetchDataFromKotlin'
import { useAppSelector } from '@/store/redux/hooks'

function haptic(ms = 15) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(ms)
}

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

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fullName = useAppSelector((s) => s.user.fullName)
  const email = useAppSelector((s) => s.user.email)

  const amount = searchParams.get('amount') ?? '0'
  const recipientName = searchParams.get('recipientName') ?? fullName
  const upiId = searchParams.get('upiId') ?? email
  const message = searchParams.get('message') ?? ''
  const transactionId = searchParams.get('transactionId') ?? `TXN${Date.now().toString().slice(-10)}`
  const date = searchParams.get('date') ?? new Date().toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const checkRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const amountRef = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)

  const initials = recipientName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  useEffect(() => {
    haptic(30)

    const tl = gsap.timeline()

    tl.fromTo(circleRef.current, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(1.5)' })

    tl.fromTo(ringRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1.4, opacity: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    )

    tl.fromTo(checkRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' },
      '-=0.5'
    )

    tl.fromTo(textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.1'
    )

    tl.fromTo(amountRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )

    tl.fromTo(detailsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )

    tl.fromTo(buttonsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    )

    return () => { tl.kill() }
  }, [])

  const handleDone = useCallback(() => {
    haptic()
    router.replace('/instacard')
  }, [router])

  const handleShareReceipt = useCallback(async () => {
    haptic()

    await sharePaymentReceipt({
      amount,
      recipientName,
      upiId,
      message,
      transactionId,
      date,
    })
  }, [amount, recipientName, upiId, message, transactionId, date])

  const details = [
    { icon: User, label: 'Paid To', value: recipientName },
    { icon: AtSign, label: 'Email ID', value: email, small: false },
    { icon: Receipt, label: 'Transaction ID', value: transactionId, small: true },
    { icon: Calendar, label: 'Date & Time', value: date },
  ]

  return (
    
    <div ref={containerRef} className="flex flex-col h-full bg-white overflow-auto">
      {/* Green Gradient Top */}
     

      <div className="flex-1 flex flex-col relative">
        {/* Success Icon */}
        <div className="flex flex-col items-center pt-12 pb-6">
          <div className="relative w-[120px] h-[120px] flex items-center justify-center">
            {/* Animated ring */}
            <div ref={ringRef} className="absolute inset-0 rounded-full border-[3px] border-[#04DA6A] opacity-0" />
            {/* Main circle */}
            <div ref={circleRef} className="w-[100px] h-[100px] rounded-full bg-[#04DA6A] flex items-center justify-center shadow-[0_8px_24px_rgba(4,218,106,0.35)]" style={{ transform: 'scale(0)' }}>
              <div ref={checkRef} style={{ opacity: 0 }}>
                <Check className="w-14 h-14 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          <div ref={textRef} className="flex flex-col items-center mt-5" style={{ opacity: 0 }}>
            <h1 className="text-2xl font-bold text-text-primary">Payment Successful</h1>
            <p className="text-sm text-text-secondary mt-1">Your transaction has been completed</p>
          </div>
        </div>

        {/* Amount */}
        <div ref={amountRef} className="flex flex-col items-center px-6" style={{ opacity: 0 }}>
          <p className="text-sm text-text-secondary">Amount Paid</p>
          <p className="text-[40px] font-bold text-text-primary leading-tight mt-1">
            <span className="line-through">N</span> {formatAmountWithCommas(amount)}
          </p>
          {message && (
            <p className="text-sm text-text-secondary mt-2">{message}</p>
          )}
        </div>

        {/* Details Card */}
        <div ref={detailsRef} className="px-6 pt-6" style={{ opacity: 0 }}>
          <div className="rounded-2xl border border-border p-4">
            {details.map((detail, i) => {
              const Icon = detail.icon
              return (
                <div key={detail.label}>
                  {i > 0 && <div className="h-px bg-border ml-12 my-1" />}
                  <div className="flex items-center py-3.5">
                    <div className="w-9 h-9 rounded-[10px] bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                      <Icon className="w-[18px] h-[18px] text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-secondary">{detail.label}</p>
                      <p className={`${detail.small ? 'text-[13px]' : 'text-[15px]'} text-text-primary font-medium truncate mt-0.5`}>
                        {detail.value}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div ref={buttonsRef} className="px-6 pt-6 pb-[max(1.5rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] flex flex-col gap-3" style={{ opacity: 0 }}>
        <button
          type="button"
          onClick={handleShareReceipt}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[25px] border border-text-primary text-text-primary font-medium active:scale-[0.97] transition-transform"
        >
          <Share2 className="w-4 h-4" />
          Share Receipt
        </button>

        <button
          type="button"
          onClick={handleDone}
          className="w-full py-4 rounded-[25px] bg-primary text-[#fff] font-medium active:scale-[0.97] transition-transform"
        >
          Done
        </button>
      </div>
    </div>
  )
}
