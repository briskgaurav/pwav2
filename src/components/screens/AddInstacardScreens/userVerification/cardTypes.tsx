'use client'

import { useEffect, useState } from "react"

import { RadioOption } from "@/components/ui"
import ButtonComponent from "@/components/ui/ButtonComponent"

import { haptic } from '@/lib/useHaptics'

import { CARD_TYPE_OPTIONS, type CardType } from "@/constants/cardData"
import { notifyNavigation } from "@/lib/bridge"
import { useAppDispatch } from "@/store/redux/hooks"
import { useCardJourney } from "@/hooks/useCardJourney"
import { createCardRequest } from "@/lib/api/cardJourneyApi"
import { showToast } from "@/store/redux/slices/toasterSlice"
import { MOCK_HOST_CONTEXT } from "@/lib/api/__mocks__/hostContext"

/**
 * Card type selector screen — the first screen in the issuance flow.
 */
export default function SelectCardTypes() {
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<CardType>('DEBIT_CARD');
  const { call } = useCardJourney();

  useEffect(() => {
    notifyNavigation('select-card-type')
  }, [])

  const handleNext = async () => {
    haptic("medium");
    if (submitting || !selectedType) return;
    setSubmitting(true);
    try {
      await call(() =>
        createCardRequest({
          cardType: selectedType,
          selectedBankAccountNumber:
            selectedType === 'CREDIT_CARD' || selectedType === 'DEBIT_CARD'
              ? MOCK_HOST_CONTEXT.selectedBankAccountNumber
              : undefined,
        }),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.errorMessage || 'Could not start your card request. Please try again.';
      dispatch(showToast({
        message: 'Something went wrong',
        subtitle: msg,
        duration: 3000,
        tosterType: 'error',
      }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1 overflow-auto p-6 py-10">
        <p className="text-[4vw] text-text-primary leading-[1.4] mb-[5vw]">
          Select the type of Instacard you would like to be issued
        </p>

        <div role="radiogroup" className="flex flex-col gap-[3vw]">
          {CARD_TYPE_OPTIONS.map((option) => (
            <RadioOption
              icon={option.icon}
              key={option.id}
              label={option.label}
              selected={option.id === selectedType}
              onSelect={() => {
                setSelectedType(option.id)
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          padding: '8px 16px 24px',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 24px) + 24px)',
        }}
      >
        <ButtonComponent
          title={submitting ? 'Submitting…' : 'Next'}
          onClick={handleNext}
          disabled={submitting}
        />

      </div>
    </div>
  )
}
