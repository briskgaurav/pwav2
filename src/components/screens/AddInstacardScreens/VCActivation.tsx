import { cardActivation } from "@/lib/api/cards";
import { useAppSelector } from "@/store/redux/hooks";
import { 
    selectCardRequestEmail, 
    selectCardRequestId, 
    selectMaskedPan, 
    selectSelectedCardType 
} from "@/store/redux/slices/cardRequestSlice";
import PinSetupForm from "../AuthScreens/PinSetupFormScreen";
import { MOCK_HOST_CONTEXT } from "@/lib/api/__mocks__/hostContext";
import { useRouter } from 'next/navigation';
import GiftAmount from "./GiftCardAmt";
import { useState } from "react";

export default function VCCardActivation() {
    const requestId = useAppSelector(selectCardRequestId);
    const registeredEmail = useAppSelector(selectCardRequestEmail);
    const selectedCardType = useAppSelector(selectSelectedCardType);
    const responsedMaskedPan = useAppSelector(selectMaskedPan);
    
    const [isActivated, setIsActivated] = useState(false);
    const router = useRouter();

    const handleCardActivate = async (pin: string) => {
        if (!requestId) {
            throw new Error('Card request not initialised. Please restart the flow.');
        }

        try {
            const response = await cardActivation({
                ...MOCK_HOST_CONTEXT,
                requestId, 
                pinRequested: pin,
                cardType: selectedCardType ?? '',
                vcPan: responsedMaskedPan ?? '',
                registeredEmail: registeredEmail ?? ''
            });

            if (response) {
                if (selectedCardType === 'GIFT_CARD') {
                    // Update state to show the GiftAmount component
                    setIsActivated(true);
                } else {
                    // Navigate away for standard cards
                    router.replace("/instacard/add-instacard/how-to-use-card");
                }
            }
        } catch (error) {
            console.error("Activation failed:", error);
            // Handle error (e.g., show a toast)
        }
    }

    // 1. Logic fix: Use an array for cleaner card type checking
    const isStandardCard = ['DEBIT_CARD', 'CREDIT_CARD', 'PREPAID_CARD', 'GIFT_CARD'].includes(selectedCardType ?? '');

    return (
        <>
            {/* Show PIN form only if not yet activated or if it's a standard flow */}
            {isStandardCard && !isActivated && (
                <PinSetupForm
                    title="PIN Setup"
                    subtitle="Please setup your PIN for this Instacard"
                    pinLabel="Enter 4-digit PIN"
                    confirmPinLabel="Re-Enter PIN"
                    onSubmit={handleCardActivate}
                />
            )}

            {/* Show Gift Amount only after successful activation for Gift Cards */}
            {selectedCardType === 'GIFT_CARD' && isActivated && (
                <GiftAmount />
            )}
        </>
    )
}