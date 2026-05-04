'use client';

import { useRef, useMemo } from 'react';

interface OTPInputProps {
  value: string;
  maxLength: number;
  onChange?: (value: string) => void;
  useDots?: boolean;
  resetKey?: string | number;
  onPress?: () => void;
}

export function OTPInput({
  value,
  maxLength,
  onChange,
  useDots = false,
  resetKey = 'default',
  onPress,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = useMemo(
    () =>
      Array.from({ length: maxLength }, (_, index) => value[index] || ''),
    [value, maxLength, resetKey]
  );

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return;

    // Handle pasted content or multiple digits
    if (inputValue.length > 1) {
      const pastedDigits = inputValue
        .replace(/\D/g, '')
        .slice(0, maxLength - index);
      const newValue = value.split('');
      for (let i = 0; i < pastedDigits.length; i++) {
        newValue[index + i] = pastedDigits[i];
      }
      const updatedValue = newValue.join('').slice(0, maxLength);
      onChange?.(updatedValue);

      const nextIndex = Math.min(
        index + pastedDigits.length,
        maxLength - 1
      );
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newValue = value.split('');
    newValue[index] = inputValue.slice(-1);
    const updatedValue = newValue.join('').slice(0, maxLength);

    onChange?.(updatedValue);

    if (inputValue && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, maxLength);
    if (pastedData) {
      onChange?.(pastedData);
      const nextIndex = Math.min(pastedData.length, maxLength - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      key={resetKey}
      style={{
        display: 'flex',
        gap: maxLength > 6 ? 6 : 10,
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        boxSizing: 'border-box',
        justifyContent: 'center',
      }}
    >
      {digits.map((digit, index) => (
        <div
          key={index}
          className={`${maxLength > 6 ? 'w-10 h-10 rounded-lg' : 'w-12 h-12 rounded-xl' }  border border-text-primary flex items-center justify-center text-base font-semibold text-text-primary text-center outline-none shrink-0`}
          style={{ position: 'relative' }}
          tabIndex={-1}
        >
          <input
            autoComplete="one-time-code"
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type={useDots ? 'tel' : 'tel'}
            inputMode="none"
            readOnly={true}
            onClick={onPress}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              outline: 'none',
              width: '100%',
              height: '100%',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: maxLength > 6 ? 12 : 14,
            }}
            className="otp-input-nostyle"
          />
          {useDots && digit && (
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: maxLength > 6 ? 8 : 12,
                height: maxLength > 6 ? 8 : 12,
                background: 'currentColor',
                borderRadius: '9999px',
                transform: 'translate(-50%, -50%)',
                display: 'block',
                fontSize: 0,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
