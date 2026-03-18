'use client';

import { haptic } from '@/lib/useHaptics';

interface CheckboxProps {
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  accessibilityLabel?: string;
}

export function Checkbox({ label, checked, onChange, accessibilityLabel }: CheckboxProps) {
  const handleChange = () => {
    haptic('light');
    onChange(!checked);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={accessibilityLabel || (typeof label === 'string' ? label : undefined)}
      onClick={handleChange}
      className="btn-press flex items-start gap-[10px] bg-transparent border-none p-0 cursor-pointer text-left"
    >
      <span
        className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 mt-[2px] transition-all duration-200 ease-in-out ${
          checked ? 'border-primary bg-primary scale-100' : 'border-border bg-transparent scale-100'
        } active:scale-90`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-all duration-150 ease-out ${
            checked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          <path
            d="M10 3L4.5 8.5L2 6"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-[14px] text-text-secondary leading-[1.4]">
        {label}
      </span>
    </button>
  );
}
