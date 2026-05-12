'use client';

import { setupUcPin } from "@/lib/api/cardLinkApi";
import PinSetupForm from "../AuthScreens/PinSetupFormScreen";
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { showToast } from "@/store/redux/slices/toasterSlice";
import { useState } from "react";
import { selectCardLinkingData, setCardLinkingData } from "@/store/redux/slices/cardLinkingSlice";
import type { UserUniveralCardSteps } from "@/types/userVerificationSteps";

interface UCPinSetupProps {
  onNext: (step: UserUniveralCardSteps) => void;
}

/**
 * Universal Card PIN setup screen.
 * Uses setupUcPin from cardLinkApi.
 */
export default function UCPinSetup({ onNext }: UCPinSetupProps) {
  const cardLinkingData = useAppSelector(selectCardLinkingData);
  const dispatch = useAppDispatch();
  const [pinValue, setPinValue] = useState<number | undefined>(undefined);

  const requestId = cardLinkingData.response?.requestId ?? '';

  const handleSetPin = (pin: number) => setPinValue(pin);

  const handleCardActivate = async (pin: string) => {
    if (!requestId) {
      dispatch(showToast({
        message: 'Something Went Wrong!',
        subtitle: 'Request ID missing. Please try again.',
        duration: 2000,
        tosterType: 'error',
      }));
      return;
    }

    try {
      const response = await setupUcPin(requestId, pin);
      dispatch(setCardLinkingData({ response }));
      
      dispatch(showToast({
        message: 'Success',
        subtitle: 'PIN setup successfully.',
        duration: 2000,
        tosterType: 'success',
      }));

      // Move to the next step
      onNext('how_to_use_card');
      
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
        title="Universal Card PIN"
        subtitle="Set up a 4-digit PIN for your Universal Card"
        pinLabel="Enter 4-digit PIN"
        confirmPinLabel="Re-Enter PIN"
        onSubmit={handleCardActivate}
      />
    </div>
  );
}
