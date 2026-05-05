'use client'

import { useEffect, useRef, useState } from 'react'
import LayoutSheet from '@/components/ui/LayoutSheet'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { routes } from '@/lib/routes'
import NiaraSymbol from '@/components/Extras/NiaraSymbol'
import { formatAmountWithCommas } from '@/lib/format-amount'

const MAX_AMOUNT = 10000000000; // 10,000,000,000
const MIN_AMOUNT = 0;
const MAX_DESCRIPTION_LENGTH = 225;

export default function EnterPaymentDetails() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- Read QR data from search params ---
  const qrAmount = searchParams.get('amount') || ''
  const qrMerchantName = searchParams.get('merchantName') || ''
  const qrDescription = searchParams.get('description') || ''
  const isAmountLocked = !!qrAmount // lock amount if QR provided it

  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [descCharsLeft, setDescCharsLeft] = useState(MAX_DESCRIPTION_LENGTH)

  // Pre-fill from QR data on mount
  useEffect(() => {
    if (qrAmount) {
      const cleaned = qrAmount.replace(/[^0-9]/g, '')
      setAmount(cleaned)
    }
    if (qrDescription) {
      const trimmed = qrDescription.slice(0, MAX_DESCRIPTION_LENGTH)
      setDescription(trimmed)
      setDescCharsLeft(MAX_DESCRIPTION_LENGTH - trimmed.length)
    }
  }, [qrAmount, qrDescription])

  const beneficiaryName = qrMerchantName || 'Ashish Rai'
  const beneficiaryInitials = beneficiaryName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const amountHiddenRef = useRef<HTMLInputElement | null>(null)

  const focusAmount = () => {
    if (isAmountLocked) return
    amountHiddenRef.current?.focus()
  }

  useEffect(() => {
    if (isAmountLocked) return
    const t = window.setTimeout(() => focusAmount(), 150)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Only allow numbers, remove leading zeros, allow as many digits as needed for MAX_AMOUNT.
   */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAmountLocked) return
    let val = e.target.value.replace(/,/g, '');
    // Remove any non-numeric character except "."
    val = val.replace(/[^\d.]/g, '');
    // Don't allow more numbers than the length of MAX_AMOUNT
    if (val.length > MAX_AMOUNT.toString().length) return;
    // Prevent multiple leading zeros
    val = val.replace(/^0+(?=\d)/, '');

    setAmount(val);
    setError(null);
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value)
      setDescCharsLeft(MAX_DESCRIPTION_LENGTH - value.length)
    } else {
      setDescription(value.slice(0, MAX_DESCRIPTION_LENGTH))
      setDescCharsLeft(0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || amount.trim() === "" || numericAmount === 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (numericAmount > MAX_AMOUNT) {
      setError(`Maximum amount you can enter is ₦${MAX_AMOUNT.toLocaleString()}.`);
      return;
    }
    if (numericAmount <= MIN_AMOUNT) {
      setError('You cannot proceed. Please enter an amount greater than 0.');
      return;
    }
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      setError(`Message cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`);
      return;
    }

    setError(null);
    const params = new URLSearchParams()
    params.set('amount', amount || '0')
    if (description.trim()) params.set('message', description.trim())

    // Use merchant name from QR or fallback
    params.set('recipientName', beneficiaryName)

    router.push(`${routes.scanPaymenetMethods}?${params.toString()}`)
  }

  return (
    <LayoutSheet needPadding={false} routeTitle='Beneficiary Details'>
      <div
        className='flex-1 w-full flex flex-col min-h-full transition-[padding-bottom] duration-200 ease-out'
      >

        {/* Beneficiary Card */}
        <div className='px-4 pt-4'>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center ">
            {/* Avatar */}
            <div className="flex justify-center mb-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-black  text-lg"
                style={{ backgroundColor: '#E8D5F5' }}
              >
                {beneficiaryInitials}
              </div>
            </div>

            {/* Verified Name Row */}
            <div className="flex flex-row items-center justify-center gap-2 mb-1">
              <p className="text-sm text-gray-500">Verified Name</p>
              <Image
                src="/img/hibadgechek.png"
                alt="Verified"
                width={18}
                height={18}
                className="rounded-full"
              />
            </div>

            {/* Name */}
            <p className="text-xl  text-gray-900 mb-1">{beneficiaryName}</p>

            {/* Since */}
            <p className="text-sm text-gray-500">On Montra Since May 2023</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-4 pt-6 pb-6 gap-4">

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-primary">
              Enter Amount (<NiaraSymbol />)
            </label>
            {/* Custom input with naira symbol inside the field */}
            <div className="relative flex items-center" onClick={focusAmount}>
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary pointer-events-none"
                style={{ zIndex: 2 }}
              >
                <NiaraSymbol />
              </span>
              <input
                ref={amountHiddenRef}
                type="tel"
                inputMode="numeric"
                autoComplete="off"
                pattern="\d*"
                enterKeyHint="done"
                value={amount}
                onChange={handleAmountChange}
                className="absolute -left-[9999px] top-0 w-px h-px opacity-0"
              />
              <input
                type="text"
                placeholder="Enter Amount"
                value={amount ? formatAmountWithCommas(amount) : ''}
                min={0}
                max={MAX_AMOUNT}
                onFocus={focusAmount}
                readOnly
                inputMode="numeric"
                className={`pl-10 w-full rounded-xl border border-border px-4 py-3 text-text-primary placeholder-text-text-secondary placeholder:text-sm focus:outline-none! focus:ring-0 ${isAmountLocked ? 'bg-success/20 opacity-70' : ''}`}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            {/* <span className="text-xs text-text-secondary">Maximum allowed: ₦{MAX_AMOUNT.toLocaleString()}</span> */}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-primary flex flex-row items-center justify-between">
              <span>
                Description / Narration <span className="font-normal text-gray-400">(optional)</span>
              </span>
            
            </label>
            <textarea
              placeholder="Write Description here"
              value={description}
              onChange={handleDescriptionChange}
              rows={3}
              maxLength={MAX_DESCRIPTION_LENGTH}
              className="rounded-xl border border-border px-4 py-3 text-text-primary placeholder-text-text-secondary placeholder:text-sm focus:outline-none! focus:ring-0   resize-none"
            />
              <span
                className={` text-right text-[2.5vw]! mr-2 font-mono transition-colors ${descCharsLeft === 0 ? "text-error" : "text-gray-400"
                  }`}
              >
                {descCharsLeft}/225
              </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-center text-error text-sm font-medium">{error}</div>
          )}

          {/* Spacer to push button to bottom */}
          <div className="flex-1" />

          {/* CTA Button */}
          <button
            type="submit"
            className="w-full rounded-full py-4 text-white text-base"
            style={{ backgroundColor: '#5A1186' }}
          >
            Initiate Payment Request
          </button>
        </form>

      </div>
    </LayoutSheet>
  )
}