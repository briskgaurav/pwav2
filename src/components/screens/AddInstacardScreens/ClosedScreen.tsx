'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCardJourney } from '@/hooks/useCardJourney';
import ButtonComponent from '@/components/ui/ButtonComponent';
import { usePWAHeader } from '@/lib/pwa-header-context';
import { routes } from '@/lib/routes';

/**
 * Terminal failure screen — driven by `nextAction.code === 'SHOW_REQUEST_CLOSED'`.
 *
 * Shows the failure reason and offers a "Start Over" button.
 */
export default function ClosedScreen() {
  const { state, reset } = useCardJourney();
  const router = useRouter();
  const { setOnBack } = usePWAHeader();

  const failureReason = state?.failureReason;
  const failureCode = state?.failureCode;
  const message = state?.nextAction?.message;
  const cardDetails = state?.cardDetails;

  const cardDetailRows = cardDetails
    ? [
      { label: 'Card ID', value: cardDetails.cardId },
      { label: 'Masked PAN', value: cardDetails.vcPanMasked },
      { label: 'Scheme', value: cardDetails.cardScheme },
      { label: 'Variant', value: cardDetails.cardVariant },
      { label: 'Expiry', value: cardDetails.cardExpiryMmYy },
      { label: 'PIN Set', value: cardDetails.pinSet ? 'Yes' : 'No' },
    ]
    : [];

  const handleStartOver = () => {
    reset();
    router.push(routes.instacard);
  };

  useEffect(() => {
    setOnBack(() => {
      reset();
      router.push(routes.instacard);
    });

    return () => {
      setOnBack(null);
    };
  }, [reset, router, setOnBack]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-xl font-semibold text-text-primary">
          Request Successful
        </h2>
        <p className="text-text-secondary">
          {message || failureReason || 'This card request has been closed.'}
        </p>
        {failureCode && (
          <p className="text-xs text-text-secondary/60 font-mono">
            Code: {failureCode}
          </p>
        )}

        {cardDetails && (
          <div className="w-full max-w-sm rounded-xl border border-border bg-white p-4 text-left space-y-3">
            <h3 className="text-sm font-semibold text-text-primary">
              Card Details
            </h3>
            <div className="space-y-2">
              {cardDetailRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start justify-between gap-4 text-xs"
                >
                  <span className="text-text-secondary">{row.label}</span>
                  <span className="max-w-[60%] break-words text-right font-medium text-text-primary">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
