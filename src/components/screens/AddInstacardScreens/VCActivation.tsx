import { cardActivation } from "@/lib/api/cards";
import SuccessScreen from "../AuthScreens/SuccessScreen";
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { selectCardRequestEmail, selectCardRequestId, selectMaskedCardPAN, selectSelectedCardType } from "@/store/redux/slices/cardRequestSlice";
import PinSetupForm from "../AuthScreens/PinSetupFormScreen";
import { MOCK_HOST_CONTEXT } from "@/lib/api/__mocks__/hostContext";
import { useRouter } from 'next/navigation';


export default function VCCardActivation() {

    const requestId = useAppSelector(selectCardRequestId);
    const registeredEmail = useAppSelector(selectCardRequestEmail);
    const selectedCardType = useAppSelector(selectSelectedCardType);
    const maskedCardPAN = useAppSelector(selectMaskedCardPAN);


    const router = useRouter();

    const handleCardActivate = async (pin: string) => {
        if (!requestId) {
            throw new Error('Card request not initialised. Please restart the flow.');
        }

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
    }

    return (
        <PinSetupForm
            title="PIN Setup"
            subtitle="Please setup your PIN for this Instacard"
            pinLabel="Enter 4-digit PIN"
            confirmPinLabel="Re-Enter PIN"
            onSubmit={handleCardActivate}
        />
    )
}