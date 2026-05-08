'use client';

import { setupPin } from "@/lib/api/cardJourneyApi";
import { useCardJourney } from "@/hooks/useCardJourney";
import PinSetupForm from "../AuthScreens/PinSetupFormScreen";
import { useAppDispatch } from "@/store/redux/hooks";
import { showToast } from "@/store/redux/slices/toasterSlice";
import { useState } from "react";

/**
 * PIN setup screen — driven by `nextAction.code === 'SHOW_CARD_DETAILS_AND_SET_PIN'`.
 *
 * Shows the masked card details from `state.cardDetails` and a PIN entry form.
 * On success the backend returns `ACTIVE` / `SHOW_CARD_ACTIVE`.
 */
export default function VCCardActivation() {
  const { state, call } = useCardJourney();
  const dispatch = useAppDispatch();
  const [pinValue, setPinValue] = useState<number | undefined>(undefined);

  const requestId = state?.requestId ?? '';
  const cardDetails = state?.cardDetails;

  const handleSetPin = (pin: number) => setPinValue(pin);

  const handleCardActivate = async (pin: string) => {
    if (!requestId) {
      dispatch(showToast({
        message: 'Something Went Wrong!',
        subtitle: 'Please try again later.',
        duration: 2000,
        tosterType: 'error',
      }));
      return;
    }

    try {
      await call(() => setupPin(requestId, pin));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      dispatch(showToast({
        message: 'PIN Setup Failed',
        subtitle: err?.errorMessage || 'Please try again.',
        duration: 3000,
        tosterType: 'error',
      }));
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <PinSetupForm
        setPinRequested={handleSetPin}
        pinRequested={pinValue}
        title="PIN Setup"
        subtitle="Please setup your PIN for this Instacard"
        pinLabel="Enter 4-digit PIN"
        confirmPinLabel="Re-Enter PIN"
        onSubmit={handleCardActivate}
      />
    </div>
  );
}