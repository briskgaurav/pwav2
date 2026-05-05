'use client'

import { useEffect, useState } from "react"

import { RadioOption } from "@/components/ui"
import ButtonComponent from "@/components/ui/ButtonComponent"

import { haptic } from '@/lib/useHaptics'

import { CARD_TYPE_OPTIONS, type CardType } from "@/constants/cardData"
import { UserInstaCardSteps } from "@/types/userVerificationSteps"
import { notifyNavigation } from "@/lib/bridge"
import { requestCard } from "@/lib/api/cards"
import { ApiError, AuthError } from "@/lib/api/errors"
import { useAppDispatch } from "@/store/redux/hooks"
import { setCardRequest } from "@/store/redux/slices/cardRequestSlice"

interface SelectCardTypesProps {
  onNext: (nextStep: UserInstaCardSteps) => void;
}

export default function SelectCardTypes({
  onNext
}: SelectCardTypesProps) {
  const dispatch = useAppDispatch();
  const [selectedType, setSelectedType] = useState<CardType>('debit');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

   useEffect(() => {
    notifyNavigation('select-card-type')
  }, [])

  const handleNext = async () => {
    haptic("medium");
    if (submitting) return;

    setErrorMessage(null);
    setSubmitting(true);
    try {
      const response = await requestCard({ cardType: selectedType });
      dispatch(setCardRequest({
        requestId: response.requestId,
        registeredEmail: response.registeredEmail,
        emailOtpStatus: response.otpStatus,
      }));
      onNext('registered_email_verification');
    } catch (err) {
      // AuthError is terminal — host SDK has already been notified by the
      // session layer. Surface a generic message so the user is not stuck.
      if (err instanceof AuthError) {
        setErrorMessage('Your session has expired. Please reopen the app.');
      } else if (err instanceof ApiError) {
        setErrorMessage('Could not start your card request. Please try again.');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
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

        {errorMessage && (
          <p role="alert" className="text-[3.5vw] text-red-600 mt-[4vw]">
            {errorMessage}
          </p>
        )}
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
