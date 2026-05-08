'use client';

import { useEffect, useRef } from 'react';
import { useCardJourney } from '@/hooks/useCardJourney';
import { resumeRequest } from '@/lib/api/cardJourneyApi';

/** Wait-state action codes that should auto-poll. */
const POLL_ACTIONS = new Set([
  'SHOW_CBN_PENDING_MESSAGE',
  'SHOW_FEE_RETRY_IN_PROGRESS',
  'SHOW_MIRROR_ACCOUNT_PROCESSING',
]);

/**
 * Polling wait screen — shown for long-running backend operations.
 *
 * Auto-polls `POST /{requestId}/resume` every 30 seconds. Stops when
 * `nextAction.code` changes to something outside the wait set.
 */
export default function PollingWaitScreen() {
  const { state, call } = useCardJourney();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const requestId = state?.requestId ?? '';
  const actionCode = state?.nextAction?.code;
  const message = state?.nextAction?.message;

  useEffect(() => {
    if (!requestId || !actionCode || !POLL_ACTIONS.has(actionCode)) return;

    const poll = () => {
      call(() => resumeRequest(requestId)).catch(() => {
        // Swallow — next poll will retry.
      });
    };

    intervalRef.current = setInterval(poll, 30_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [requestId, actionCode, call]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 py-10 text-center space-y-6">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      <h2 className="text-xl font-semibold text-text-primary">Processing Request</h2>
      <p className="text-text-secondary">
        {message || "Please wait while we process your request. We'll update this screen automatically."}
      </p>
      <p className="text-xs text-text-secondary/60">
        This page refreshes automatically every 30 seconds.
      </p>
    </div>
  );
}
