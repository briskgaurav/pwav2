'use client';

import { useRef, useMemo, useEffect } from 'react';

interface OTPInputProps {
  value: string;
  maxLength: number;
  onChange?: (value: string) => void;
  useDots?: boolean;
  resetKey?: string | number;
  onPress?: () => void;
}

export function OTPInput({ value, maxLength, onChange, useDots = false, resetKey = 'default', onPress }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = useMemo(() => {
    return Array.from({ length: maxLength }, (_, index) => value[index] || '');
  }, [value, maxLength, resetKey]);

  const handleChange = (index: number, inputValue: string) => {
    if (!/^\d*$/.test(inputValue)) return;

    // Handle pasted content or multiple digits
    if (inputValue.length > 1) {
      const pastedDigits = inputValue.replace(/\D/g, '').slice(0, maxLength - index);
      const newValue = value.split('');
      for (let i = 0; i < pastedDigits.length; i++) {
        newValue[index + i] = pastedDigits[i];
      }
      const updatedValue = newValue.join('').slice(0, maxLength);
      onChange?.(updatedValue);

      const nextIndex = Math.min(index + pastedDigits.length, maxLength - 1);
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

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, maxLength);
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
        gap: 10,
        width: '100%',          // ⭐ important
        paddingLeft: 20,        // same as px-5 (optional)
        paddingRight: 20,       // same as px-5 (optional)
        boxSizing: 'border-box',
        justifyContent: 'center',
      }}
    >
      {digits.map((digit, index) => (
        <input
          autoComplete="one-time-code"
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type={useDots ? 'password' : 'tel'}
          inputMode="none"
          readOnly={true}
          onClick={onPress}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}

          onPaste={handlePaste}

          className="w-12 h-12 rounded-[10px] border border-text-primary flex items-center justify-center text-base font-semibold text-text-primary text-center outline-none"
        />
      ))}
    </div>
  );
}
