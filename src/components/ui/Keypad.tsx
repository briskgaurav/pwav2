'use client';

import { haptic } from '@/lib/useHaptics';
import { Check } from 'lucide-react';

const KEY_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['done', '0', 'del'],
] as const;

interface OTPKeypadProps {
  onKeyPress: (key: string) => void;
  showBackground?: boolean;
  needPadding?: boolean;
}

function CheckIcon({ size = 24, color = 'var(--color-primary)' }: { size?: number | string, color?: string }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ width: typeof size === 'number' ? `${size}px` : size, height: typeof size === 'number' ? `${size}px` : size }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill={color} opacity="0.12" />
      <path
        d="M7 12.6L10.1429 15.5L17 9.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OTPKeypad({ onKeyPress, showBackground = true, needPadding = true }: OTPKeypadProps) {
  const handleKeyPress = (key: string) => {
    haptic('light');
    onKeyPress(key);
  };

  return (
    <div
      className={`w-full ${showBackground ? 'bg-white border-t border-border rounded-t-2xl' : ''} pointer-events-auto`}
      style={{
        padding: needPadding ? 'clamp(12px, 4vw, 20px)' : 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(8px, 2vw, 12px)',
      }}
    >
      {KEY_ROWS.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 'clamp(8px, 2vw, 12px)',
          }}
        >
          {row.map((key, keyIndex) => {
            if (key === 'done') {
              // Done button styled like other number buttons, NOT green/accent!
              return (
                <button
                  key="done"
                  type="button"
                  onClick={() => handleKeyPress('done')}
                  aria-label="Done"
                  className="btn-press"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    aspectRatio: '1.5 / 1',
                    maxHeight: 54,
                    borderRadius: 'clamp(8px, 2vw, 12px)',
                    backgroundColor: 'var(--color-light-gray)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 'clamp(14px, 4vw, 18px)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                <Check />
                </button>
              );
            }
            if (key === 'del') {
              // Delete button
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeyPress(key)}
                  aria-label="Delete"
                  className="btn-press"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    aspectRatio: '1.5 / 1',
                    maxHeight: 54,
                    borderRadius: 'clamp(8px, 2vw, 12px)',
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 'clamp(14px, 4vw, 18px)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <svg
                    width="clamp(18px, 5vw, 24px)"
                    height="clamp(18px, 5vw, 24px)"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: 'clamp(18px, 5vw, 24px)', height: 'clamp(18px, 5vw, 24px)' }}
                  >
                    <path
                      d="M21 4H8L1 12L8 20H21C21.5304 20 22.0391 19.7893 22.4142 19.4142C22.7893 19.0391 23 18.5304 23 18V6C23 5.46957 22.7893 4.96086 22.4142 4.58579C22.0391 4.21071 21.5304 4 21 4Z"
                      stroke="var(--color-text-primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18 9L12 15M12 9L18 15"
                      stroke="var(--color-text-primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              );
            }
            // All regular number buttons
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyPress(key)}
                aria-label={`Number ${key}`}
                className="btn-press"
                style={{
                  flex: 1,
                  minWidth: 0,
                  aspectRatio: '1.5 / 1',
                  maxHeight: 54,
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  backgroundColor: 'var(--color-light-gray)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 'clamp(14px, 4vw, 18px)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
