'use client';

import { useRef, useMemo } from 'react';

interface OTPInputProps {
  value: string;
  maxLength: number;
  onChange?: (value: string) => void;
  useDots?: boolean;
  resetKey?: string | number;
}

export function OTPInput({ value, maxLength, onChange , resetKey = 'default'}: OTPInputProps) {
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
        justifyContent: 'center',
      }}
      aria-label={`Verification code: ${value.length} of ${maxLength} digits entered`}
      onPaste={handlePaste}
    >
      {digits.map((digit, index) => (
        <input
          autoComplete="one-time-code"
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          
          onPaste={handlePaste}
          
          style={{
            width: 55,
            height: 55,
            borderRadius: 10,
            border: '1px solid var(--text-primary, #111)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--text-primary, #333)',
            textAlign: 'center',
            outline: 'none',
          }}
        />
      ))}
    </div>
  );
}
