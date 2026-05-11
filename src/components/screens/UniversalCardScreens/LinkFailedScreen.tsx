'use client';

import { useCardLinkJourney } from '@/hooks/useCardLinkJourney';
import { Button } from '@/components/ui';

/**
 * Link failed screen — driven by `nextAction.code === 'SHOW_LINK_FAILED'`.
 *
 * Terminal state. Shows the failure reason and offers a "Start Over" CTA.
 * Per spec, for `MWS_LINK_FAILED` with `retryable=true` the user can
 * restart via `/initiate` (not `/resume`, which doesn't re-fire MWS).
 */
export default function LinkFailedScreen() {
  const { state, reset } = useCardLinkJourney();

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
          <span className="text-3xl text-red-500">✕</span>
        </div>
        <h2 className="text-xl font-semibold text-text-primary">
          Linking Failed
        </h2>
        <p className="text-text-secondary">
          {message || failureReason || 'We could not link your cards. Please try again.'}
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
        <Button fullWidth onClick={handleStartOver}>
          Start Over
        </Button>
      </div>
    </div>
  );
}
