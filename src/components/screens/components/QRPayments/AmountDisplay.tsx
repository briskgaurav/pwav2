'use client'

import { formatAmountWithCommas, convertToWords } from '@/lib/format-amount'

interface AmountDisplayProps {
  amount: string
  currencySymbol?: string
  onPress?: () => void
}

export function AmountDisplay({ amount, currencySymbol = 'N', onPress }: AmountDisplayProps) {
  const formatted = formatAmountWithCommas(amount)
  const words = convertToWords(Number(amount))

  return (
    <button
      type="button"
      onClick={onPress}
      className="flex-1 min-h-[20%] w-full flex flex-col items-center justify-center"
    >
      <div className="flex items-start mr-4">
        <span className="text-[56px] font-bold text-text-primary line-through mr-1 leading-none">
          {currencySymbol}
        </span>
        <span className="text-[56px] font-bold text-text-primary leading-none">
          {formatted}
        </span>
      </div>
      {words && (
        <span className="text-sm text-text-secondary mt-1 text-center">{words}</span>
      )}
    </button>
  )
}
