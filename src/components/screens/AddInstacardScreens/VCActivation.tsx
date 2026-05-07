import { cardActivation } from "@/lib/api/cards";
import SuccessScreen from "../AuthScreens/SuccessScreen";
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { selectCardRequestEmail, selectCardRequestId, selectMaskedCardPAN, selectPinRequested, selectSelectedCardType, setPinRequested } from "@/store/redux/slices/cardRequestSlice";
import PinSetupForm from "../AuthScreens/PinSetupFormScreen";
import { MOCK_HOST_CONTEXT } from "@/lib/api/__mocks__/hostContext";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import type { UserInstaCardSteps } from "@/types/userVerificationSteps";

interface CreditCardConsentProps {
  onNext: (nextStep: UserInstaCardSteps) => void;
}
export default function VCCardActivation({onNext}: CreditCardConsentProps) {


    const requestId = useAppSelector(selectCardRequestId);
    const registeredEmail = useAppSelector(selectCardRequestEmail);
    const selectedCardType = useAppSelector(selectSelectedCardType);
    const maskedCardPAN = useAppSelector(selectMaskedCardPAN);
    const pinRequested = useAppSelector(selectPinRequested);
    const dispatch = useAppDispatch();

    const handleSetPinRequested = (pin: number) => dispatch(setPinRequested(pin));


    const router = useRouter();

    const handleCardActivate = async (pin: string) => {
        if (!requestId) {
            throw new Error('Card request not initialised. Please restart the flow.');
        }
        // console.log(selectMaskedCardPAN,"MASKED PAN")

        const response = await cardActivation({
            ...MOCK_HOST_CONTEXT,
            requestId, pinRequested: pin,
            cardType: selectedCardType ?? '',
            vcPan: maskedCardPAN ?? '',
            registeredEmail: registeredEmail ?? ''
        });

        if (response) {
            router.replace("/instacard/add-instacard/how-to-use-card")
        }
        onNext('how_to_use_card')
    }

    return (
        <PinSetupForm
            setPinRequested={handleSetPinRequested}
            pinRequested={pinRequested ?? undefined}
            title="PIN Setup"
            subtitle="Please setup your PIN for this Instacard"
            pinLabel="Enter 4-digit PIN"
            confirmPinLabel="Re-Enter PIN"
            onSubmit={handleCardActivate}
        />
    )
}