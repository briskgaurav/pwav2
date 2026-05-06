'use client'

import BottomSheetModal from '@/components/ui/BottomSheetModal'
import { Button } from '@/components/ui'
import { formatAmountWithCommas } from '@/lib/format-amount'
import React, { useMemo, useState } from 'react'

type AddNewCardFormValues = {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  saveCard: boolean
}

function OtherCardsAddNewCardForm({
  onChange,
}: {
  onChange?: (values: AddNewCardFormValues) => void
}) {
  const [values, setValues] = useState<AddNewCardFormValues>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: true,
  })

  const update = (patch: Partial<AddNewCardFormValues>) => {
    setValues((prev) => {
      const next = { ...prev, ...patch }
      onChange?.(next)
      return next
    })
  }

  const handleNumericInput = (value: string, field: keyof AddNewCardFormValues) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    update({ [field]: numericValue })
  }

  return (
    <div className="space-y-4">
      <p className="text-text-primary text-sm font-medium">Please complete details for your saved by sharing CVV for the selected card</p>

      <div className="space-y-2">
        <p className="text-text-primary text-sm">Enter card number</p>
        <div className="border border-border rounded-2xl px-4 py-4 flex items-center justify-between gap-3">
          <input
            autoComplete="cc-number"
            type="text"
            inputMode="numeric"
            maxLength={19}
            value={values.cardNumber.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim()}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
              update({ cardNumber: raw })
            }}
            placeholder="0000 0000 0000 0000"
            className="w-full bg-transparent text-text-primary text-sm !outline-none! focus:outline-none! focus:ring-none! tracking-wider"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-text-primary ml-1 text-sm">Valid Till</p>
          <div className="flex gap-3">
            <div className="flex-1 border border-border rounded-2xl px-4 py-3">
              <input
                autoComplete="cc-exp-month"
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={values.expiryMonth}
                onChange={(e) => handleNumericInput(e.target.value, 'expiryMonth')}
                placeholder="MM"
                className="w-full bg-transparent text-text-primary text-sm text-center !outline-none! focus:outline-none! focus:ring-none!"
              />
            </div>
            <div className="flex-1 border border-border rounded-2xl px-4 py-3">
              <input
                autoComplete="cc-exp-year"
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={values.expiryYear}
                onChange={(e) => handleNumericInput(e.target.value, 'expiryYear')}
                placeholder="YY"
                className="w-full bg-transparent text-text-primary text-sm text-center !outline-none! focus:outline-none! focus:ring-none!"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-text-primary ml-1 text-sm">CVV</p>
          <input
            autoComplete="cc-csc"
            type="password"
            inputMode="numeric"
            maxLength={3}
            value={values.cvv}
            onChange={(e) => handleNumericInput(e.target.value, 'cvv')}
            placeholder="CVV"
            className="w-full bg-transparent border border-border rounded-2xl px-4 py-3 text-text-primary text-sm text-center !outline-none! focus:outline-none! focus:ring-none!"
          />
        </div>
      </div>
    </div>
  )
}

function isValid(values: AddNewCardFormValues | null) {
  if (!values) return false
  const cardNumberOk = /^\d{16}$/.test(values.cardNumber)
  // Require full 2-digit MM/YY
  const monthOk = /^(0[1-9]|1[0-2])$/.test(values.expiryMonth)
  const yearOk = /^\d{2}$/.test(values.expiryYear)
  const cvvOk = /^\d{3}$/.test(values.cvv)
  return cardNumberOk && monthOk && yearOk && cvvOk
}

function last4(values: AddNewCardFormValues | null) {
  if (!values?.cardNumber) return ''
  const raw = values.cardNumber.replace(/\D/g, '')
  return raw.slice(-4)
}

type OtherCardsNewCardSheetProps = {
  open: boolean
  amount: number
  onClose: () => void
  onContinue: (opts: { payingInfo: string }) => void
}

export default function OtherCardsNewCardSheet({
  open,
  amount,
  onClose,
  onContinue,
}: OtherCardsNewCardSheetProps) {
  const [values, setValues] = useState<AddNewCardFormValues | null>(null)

  const payingInfo = useMemo(() => {
    const l4 = last4(values)
    return l4 ? `New card •••• ${l4}` : `New card`
  }, [values])

  const canContinue = isValid(values)

  return (
    <BottomSheetModal
      visible={open}
      onClose={onClose}
      title="Pay with new card"
      maxHeight={0.7}
    >
      {/* <div className="rounded-2xl border border-border bg-background2/60 px-4 py-3">
        <p className="text-xs text-text-secondary">You’re paying with</p>
        <p className="text-sm font-semibold text-text-primary mt-0.5">{payingInfo}</p>
      </div> */}

      <div className="mt-4">
        <OtherCardsAddNewCardForm onChange={(v) => setValues(v)} />
      </div>

      <Button
        fullWidth
        variant={canContinue ? 'primary' : 'disabled'}
        className={`mt-4 ${canContinue ? 'bg-primary text-white' : 'bg-disable-button text-text-secondary'}`}
        disabled={!canContinue}
        onClick={() => {
          if (!canContinue) return
          onContinue({ payingInfo })
        }}
      >
        {`Pay Now ₦ ${formatAmountWithCommas(amount.toString())}`}
      </Button>
    </BottomSheetModal>
  )
}

