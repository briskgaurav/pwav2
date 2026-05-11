'use client';

import { useEffect, useRef } from 'react';
import { useCardLinkJourney } from '@/hooks/useCardLinkJourney';
import { resumeCardLink } from '@/lib/api/cardLinkApi';

/**
 * Link processing screen — driven by `nextAction.code === 'SHOW_LINK_PROCESSING'`.
 *
 * This state is rare — the backend usually completes the MWS call synchronously.
 * If it appears, we do a single `/resume` call after a short delay (not polling).
 */
export default function LinkProcessingScreen() {
  const { state, call } = useCardLinkJourney();
  const hasResumed = useRef(false);

  const requestId = state?.requestId ?? '';
  const message = state?.nextAction?.message;

  useEffect(() => {
    if (!requestId || hasResumed.current) return;

    const timer = setTimeout(() => {
      hasResumed.current = true;
      call(() => resumeCardLink(requestId)).catch(() => {
        // Swallow — user can retry manually
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [requestId, call]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 py-10 text-center space-y-6">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      <h2 className="text-xl font-semibold text-text-primary">Linking Your Cards</h2>
      <p className="text-text-secondary">
        {message || "Please wait while we link your Virtual Card and Universal Card. This should only take a moment."}
      </p>
      <p className="text-xs text-text-secondary/60">
        Do not close this screen.
      </p>
    </div>
  );
}
