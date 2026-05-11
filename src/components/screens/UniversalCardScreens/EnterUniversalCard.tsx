'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui'

/**
 * Initial screen for the Add Universal Card flow.
 *
 * - Journey A/B (VC selected): Shows a "Link to Universal Card" prompt.
 *   Tapping Continue calls /initiate with the vcCardId.
 * - Journey C (standalone): Shows the UC card image and a prompt to start.
 *   Tapping Continue calls /initiate without vcCardId.
 */

interface EnterUniversalCardProps {
  isInitiating: boolean;
  onInitiate: () => void;
  hasVcSelected: boolean;
}

export default function EnterUniversalCard({
  isInitiating,
  onInitiate,
  hasVcSelected,
}: EnterUniversalCardProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex-col flex justify-start items-center overflow-auto py-10 space-y-4 p-6">
        <div className="h-auto w-full relative">
          <Image
            src="/img/cards/universal.png"
            alt="Universal Card"
            width={1000}
            height={1000}
            className="h-full w-full object-contain"
          />
        </div>

        {hasVcSelected ? (
          <>
            <h2 className="text-lg font-semibold text-text-primary text-center">
              Link to Universal Card
            </h2>
            <p className="text-sm text-text-secondary text-center">
              Link your Virtual Card to a Universal Card to use it at ATMs and POS terminals.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-text-primary text-center">
              Add Universal Card
            </h2>
            <p className="text-sm text-text-secondary text-center">
              Set up a new Universal Card and link it to your Virtual Cards for in-store and ATM usage.
            </p>
          </>
        )}
      </div>

      <div
        style={{
          padding: '8px 16px 24px',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
        }}
      >
        <Button
          fullWidth
          disabled={isInitiating}
          onClick={onInitiate}
        >
          {isInitiating ? 'Starting...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
