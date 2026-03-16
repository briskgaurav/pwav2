'use client';

import { haptic } from '@/lib/useHaptics';

const KEY_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'del'],
] as const;

interface OTPKeypadProps {
  onKeyPress: (key: string) => void;
}

export function OTPKeypad({ onKeyPress }: OTPKeypadProps) {
  const handleKeyPress = (key: string) => {
    haptic('light');
    onKeyPress(key);
  };
  return (
    <div
      className="w-full bg-white border-t border-border rounded-t-2xl pointer-events-auto"
      style={{
        padding: 'clamp(12px, 4vw, 20px)',
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
            if (key === '') {
              return (
                <div
                  key={`empty-${keyIndex}`}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    aspectRatio: '1.5 / 1',
                    maxHeight: 54,
                  }}
                />
              );
            }

            const isDelete = key === 'del';

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyPress(key)}
                aria-label={isDelete ? 'Delete' : `Number ${key}`}
                className="btn-press"
                style={{
                  flex: 1,
                  minWidth: 0,
                  aspectRatio: '1.5 / 1',
                  maxHeight: 54,
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  backgroundColor: isDelete ? 'var(--color-white)' : 'var(--color-light-gray)',
                  border: isDelete ? '1px solid var(--color-border)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: 'clamp(14px, 4vw, 18px)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {isDelete ? (
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
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
