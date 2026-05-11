'use client';

import { useCardLinkJourney } from '@/hooks/useCardLinkJourney';
import { Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';
import Image from 'next/image';
import { Check } from 'lucide-react';

/**
 * Link success screen — driven by `nextAction.code === 'SHOW_LINK_SUCCESS'`.
 *
 * Terminal state. Shows the linkId and masked card details.
 */
export default function LinkSuccessScreen() {
  const { state, reset } = useCardLinkJourney();
  const router = useRouter();

  const linkId = state?.linkId;
  const vcMasked = state?.vcSummary?.vcPanMasked ?? '****';
  const ucMasked = state?.ucSummary?.ucPanMasked ?? '****';
  const message = state?.nextAction?.message;

  const handleDone = () => {
    reset();
    router.push(routes.instacard);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 py-10 text-center gap-6">
        {/* Success icon */}
        <div className="relative w-full flex flex-col items-center">
          <Image
            src="/img/success.png"
            alt="Success"
            width={200}
            height={200}
            className="w-[120px] h-auto object-contain"
            priority
          />
        </div>

        <div className="w-full bg-white/60 backdrop-blur-xl rounded-2xl border border-text-secondary/20 p-6 space-y-4 text-center">
          <div className="p-2 border-2 border-[#39D105] rounded-full w-fit mx-auto text-[#39D105]">
            <Check strokeWidth={2} size={24} />
          </div>

          <h2 className="text-xl font-semibold text-text-primary">
            Cards Linked Successfully!
          </h2>

          <p className="text-sm text-text-secondary">
            {message || 'Your Virtual Card and Universal Card are now linked.'}
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Virtual Card</span>
              <span className="font-mono text-text-primary">{vcMasked}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Universal Card</span>
              <span className="font-mono text-text-primary">{ucMasked}</span>
            </div>
            {linkId && (
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                <span className="text-text-secondary">Link ID</span>
                <span className="font-mono text-text-secondary">{linkId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: '8px 16px 24px',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
        }}
      >
        <Button fullWidth onClick={handleDone}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}
