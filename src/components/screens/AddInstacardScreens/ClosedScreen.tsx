'use client';

import { useCardJourney } from '@/hooks/useCardJourney';
import ButtonComponent from '@/components/ui/ButtonComponent';

/**
 * Terminal failure screen — driven by `nextAction.code === 'SHOW_REQUEST_CLOSED'`.
 *
 * Shows the failure reason and offers a "Start Over" button.
 */
export default function ClosedScreen() {
  const { state, reset } = useCardJourney();

  const failureReason = state?.failureReason;
  const failureCode = state?.failureCode;
  const message = state?.nextAction?.message;

  const handleStartOver = () => {
    reset();
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl">✕</span>
        </div>
        <h2 className="text-xl font-semibold text-text-primary">
          Request Closed
        </h2>
        <p className="text-text-secondary">
          {message || failureReason || 'This card request has been closed.'}
        </p>
        {failureCode && (
          <p className="text-xs text-text-secondary/60 font-mono">
            Code: {failureCode}
          </p>
        )}
      </div>

      <div
        style={{
          padding: '8px 16px 24px',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
        }}
      >
        <ButtonComponent title="Start Over" onClick={handleStartOver} />
      </div>
    </div>
  );
}
