'use client'

import { useEffect, useState } from "react"

import { RadioOption } from "@/components/ui"
import ButtonComponent from "@/components/ui/ButtonComponent"

import { haptic } from '@/lib/useHaptics'

import { CARD_TYPE_OPTIONS, type CardType } from "@/constants/cardData"
import { UserVerificationSteps } from "@/types/userVerificationSteps"
import { notifyNavigation } from "@/lib/bridge"

interface SelectCardTypesProps {
  onNext: (nextStep: UserVerificationSteps) => void;
}

export default function SelectCardTypes({
  onNext
}: SelectCardTypesProps) {
  const [selectedType, setSelectedType] = useState<CardType>('debit');

   useEffect(() => {
    notifyNavigation('select-card-type')
  }, [])

  const handleNext = () => {
    haptic("medium");
    const requestCardRes = true;

    if (requestCardRes) {
      // do nothing
      onNext('registered_email_verification');
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
        <ButtonComponent title="Next" onClick={handleNext} />

      </div>
    </div>
  )
}