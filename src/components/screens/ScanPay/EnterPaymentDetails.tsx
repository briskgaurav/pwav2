'use client'

import { useRef, useState } from 'react'
import LayoutSheet from '@/components/ui/LayoutSheet'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { OTPKeypad } from '@/components/ui'
import { useSlideUpKeypad } from '@/hooks/useSlideUpKeypad'

const MAX_AMOUNT = 100000;
const MIN_AMOUNT = 9;

export default function EnterPaymentDetails() {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const amountBoxRef = useRef<HTMLDivElement | null>(null)
  const { keypadRef, isKeypadOpen, keypadHeight, openKeypad, closeKeypad } = useSlideUpKeypad({
    insideRefs: [amountBoxRef],
  })

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Prevent user from entering more than 6 digits
    if (val.length > 6) return;
    setAmount(val);
    setError(null);
  }

  const handleKeyPress = (key: string) => {
    setError(null)

    if (key === 'del') {
      setAmount((prev) => prev.slice(0, -1))
      return
    }

    if (!/^\d$/.test(key)) return
    setAmount((prev) => {
      const next = (prev || '') + key
      if (next.length > 6) return prev
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount) || amount.trim() === "") {
      setError('Please enter a valid amount.');
      return;
    }
    if (numericAmount > MAX_AMOUNT) {
      setError(`Maximum amount you can enter is ₦${MAX_AMOUNT.toLocaleString()}.`);
      return;
    }
    if (numericAmount <= 10) {
      setError('You cannot proceed. Please enter an amount greater than 10.');
      return;
    }

    setError(null);
    closeKeypad()
    const params = new URLSearchParams()
    params.set('amount', amount || '0')
    if (description.trim()) params.set('message', description.trim())

    // Temporary static beneficiary details (until QR payload is wired)
    params.set('recipientName', 'Ashish Rai')

    router.push(`${routes.scanPaymenetMethods}?${params.toString()}`)
  }

  return (
    <LayoutSheet needPadding={false} routeTitle='Beneficiary Details'>
      <div
        className='flex-1 w-full flex flex-col min-h-full transition-[padding-bottom] duration-200 ease-out'
        style={{ paddingBottom: isKeypadOpen ? keypadHeight : 0 }}
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
                AR
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
            <p className="text-xl  text-gray-900 mb-1">Ashish Rai</p>

            {/* Since */}
            <p className="text-sm text-gray-500">On Montra Since May 2023</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 px-4 pt-6 pb-6 gap-4">

          {/* Amount */}
          <div ref={amountBoxRef} className="flex flex-col gap-1">
            <label className="text-sm text-text-primary">Enter Amount</label>
            <input
              type="number"
              placeholder="Enter Amount"
              value={amount}
              min={0}
              max={MAX_AMOUNT}
              onChange={handleAmountChange}
              onFocus={openKeypad}
              readOnly
              inputMode="numeric"
              className="rounded-xl border border-border px-4 py-3 text-text-primary placeholder-text-text-secondary placeholder:text-sm focus:outline-none! focus:ring-0  "
              required
            />
            {/* <span className="text-xs text-text-secondary">Maximum allowed: ₦{MAX_AMOUNT.toLocaleString()}</span> */}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-text-primary">
              Description / Narration <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              placeholder="Write Description here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-xl border border-border px-4 py-3 text-text-primary placeholder-text-text-secondary placeholder:text-sm focus:outline-none! focus:ring-0   resize-none"
            />
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

      <div
        ref={keypadRef}
        className={`fixed bottom-0 h-fit left-0 right-0 transition-opacity ${isKeypadOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <OTPKeypad onKeyPress={handleKeyPress} />
      </div>
    </LayoutSheet>
  )
}