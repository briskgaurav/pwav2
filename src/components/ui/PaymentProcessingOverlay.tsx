'use client'

type PaymentProcessingOverlayProps = {
  open: boolean
  state?: 'loading' | 'error'
  title?: string
  subtitle?: string
  primaryActionLabel?: string
  onPrimaryAction?: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

export default function PaymentProcessingOverlay({
  open,
  state = 'loading',
  title = 'Processing payment…',
  subtitle = 'Please wait while we complete your payment.',
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: PaymentProcessingOverlayProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[92%] max-w-sm rounded-2xl bg-white border border-border px-5 py-6 flex flex-col items-center gap-3">
        {state === 'loading' ? (
          <div className="h-10 w-10 rounded-full border-2 border-border border-t-primary animate-spin" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-error/10 text-error flex items-center justify-center text-lg font-bold">
            !
          </div>
        )}
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary text-center">{subtitle}</p>

        {(primaryActionLabel || secondaryActionLabel) && (
          <div className="w-full pt-2 flex gap-2">
            {secondaryActionLabel && (
              <button
                type="button"
                onClick={onSecondaryAction}
                className="flex-1 rounded-full border border-border px-4 py-2 text-sm text-text-primary"
              >
                {secondaryActionLabel}
              </button>
            )}
            {primaryActionLabel && (
              <button
                type="button"
                onClick={onPrimaryAction}
                className="flex-1 rounded-full bg-primary px-4 py-2 text-sm text-white"
              >
                {primaryActionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

