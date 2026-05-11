'use client';

import { useState, useRef, useEffect } from 'react';
import { useCardLinkJourney } from '@/hooks/useCardLinkJourney';
import { verifyUcPin } from '@/lib/api/cardLinkApi';
import { useAppDispatch } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';
import { Button } from '@/components/ui';
import { PIN_LENGTH } from '@/lib/types';

/**
 * UC PIN entry screen — driven by `nextAction.code === 'VERIFY_UC_PIN'`.
 *
 * The user enters their existing UC PIN (4–6 digits).
 * On success the backend completes the MWS link and returns LINK_ACTIVE or LINK_FAILED.
 */

function NativePinInput({
  value,
  onChange,
  onDone,
  inputRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onDone?: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const digits = Array.from({ length: PIN_LENGTH }, (_, i) => value[i] || '');

  return (
    <div className="relative w-full cursor-pointer" onClick={() => inputRef.current?.focus()}>
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        autoComplete="off"
        pattern="\d*"
        enterKeyHint="done"
        maxLength={PIN_LENGTH}
        value={value}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          onDone?.();
        }}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH);
          onChange(cleaned);
        }}
        className="absolute -left-[9999px] top-0 w-px h-px opacity-0"
      />
      <div className="flex gap-2.5 w-full px-5 justify-center">
        {digits.map((d, i) => {
          const isCursor = i === value.length && value.length < PIN_LENGTH;
          return (
            <div
              key={i}
              className={`w-12 h-12 rounded-[10px] border flex items-center justify-center text-base font-semibold text-text-primary shrink-0 transition-colors ${
                isCursor ? 'border-primary' : d ? 'border-text-primary' : 'border-border'
              }`}
            >
              {d ? (
                <span className="w-3 h-3 rounded-full bg-text-primary" />
              ) : isCursor ? (
                <span className="w-0.5 h-5 bg-primary animate-pulse rounded-full" />
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function UcPinScreen() {
  const { state, call } = useCardLinkJourney();
  const dispatch = useAppDispatch();
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const requestId = state?.requestId ?? '';
  const ucMasked = state?.ucSummary?.ucPanMasked ?? '';

  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 150);
    return () => window.clearTimeout(t);
  }, []);

  const handleSubmit = async () => {
    if (pin.length < PIN_LENGTH || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await call(() => verifyUcPin(requestId, pin));
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'errorMessage' in err
          ? (err as { errorMessage: string }).errorMessage
          : 'PIN verification failed. Please try again.';
      setError(message);
      setPin('');
      dispatch(
        showToast({
          message: 'UC PIN Verification Failed',
          subtitle: message,
          duration: 3000,
          tosterType: 'error',
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = pin.length === PIN_LENGTH;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start p-6 py-10 text-center gap-4">
        <h2 className="text-xl font-semibold text-text-primary">Verify Universal Card PIN</h2>
        <p className="text-sm text-text-secondary">
          Enter the PIN for your Universal Card
        </p>
        {ucMasked && (
          <p className="text-sm font-medium text-text-primary font-mono">
            {ucMasked}
          </p>
        )}

        <div className="mt-6 w-full">
          <NativePinInput
            value={pin}
            inputRef={inputRef}
            onChange={(v) => {
              setError(null);
              setPin(v);
            }}
            onDone={() => {
              if (isComplete) handleSubmit();
            }}
          />
        </div>

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

        <div className="w-full mt-6 px-4">
          <Button
            fullWidth
            disabled={!isComplete || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Verifying...' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
