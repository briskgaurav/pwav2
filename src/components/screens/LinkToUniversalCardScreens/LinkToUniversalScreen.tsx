"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LayoutSheet from "@/components/ui/LayoutSheet";
import { LinkLinkVirtualCardSteps } from "@/types/cardsLinkingSteps";
import SuccessScreen from "../AuthScreens/SuccessScreen";
import PINVerificationScreen from "../AddInstacardScreens/UniversalCardScreens/PINVerificationScreen";
import UniversalCardSelection from "./UniversalCardSelection";
import { initiateCardLink } from "@/lib/api/cardLinkApi";
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { setCardLinkingData, selectCardLinkingData } from "@/store/redux/slices/cardLinkingSlice";
import { routes } from "@/lib/routes";

export default function LinkUniversalCardScreen() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [step, setStep] = useState<LinkLinkVirtualCardSteps>("verify_vc_pin");
    const [initLoading, setInitLoading] = useState(true);
    const initiatedRef = useRef(false);
    const managingCardId = useAppSelector((s) => s.cardWallet.managingCardId);
    const cardLinkingData = useAppSelector(selectCardLinkingData);

    useEffect(() => {
        if (initiatedRef.current) return;
        initiatedRef.current = true;

        const init = async () => {
            try {
                const vcCardId = managingCardId?.startsWith("VC-") ? managingCardId : undefined;
                console.log("[LinkUniversalCard] initiating with vcCardId:", vcCardId);
                const res = await initiateCardLink(vcCardId);
                console.log("[LinkUniversalCard] initiateCardLink response:", res);
                dispatch(setCardLinkingData({ response: res }));
                if (res.nextAction?.code !== "VERIFY_VC_PIN") {
                    setStep("universal_card_selection");
                }
            } catch (err) {
                console.error("[LinkUniversalCard] Failed to initiate card link:", err);
            } finally {
                setInitLoading(false);
            }
        };
        void init();
    }, [dispatch, managingCardId]);

    const handleNext = (nextStep: LinkLinkVirtualCardSteps) => {
        setStep(nextStep);
    };

    const renderStep = () => {
        switch (step) {
            case 'verify_vc_pin':
                if (initLoading) {
                    return (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[50vh]">
                            <p className="text-sm text-text-secondary">Starting link session…</p>
                        </div>
                    );
                }
                if (cardLinkingData.response?.nextAction?.code === "VERIFY_VC_PIN") {
                    return (
                        <PINVerificationScreen
                            verifyVcPinApi
                            cardType="Virtual"
                            cardImageSrc="/img/cards/debit.png"
                            handleNext={handleNext}
                            nextStep="universal_card_selection"
                            title="Enter PIN for this Virtual Card"
                        />
                    );
                }
                return (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center min-h-[50vh]">
                        <p className="text-sm text-text-secondary">
                            Unable to start linking. Please go back and try again.
                        </p>
                    </div>
                );
            case 'verify_uc_pin':
                return <PINVerificationScreen cardType="Virtual" cardImageSrc="/img/cards/debit.png" handleNext={handleNext} nextStep="universal_card_selection" title="Enter PIN for this Universal Card" />;
            case 'universal_card_selection':
                return <UniversalCardSelection handleNext={handleNext} />;
            case 'linking_success':
                return <SuccessScreen buttonText="Go to Instacard" onButtonClick={() => router.push(routes.instacard)} title='Linking was Successful!' description='Your Universal Instacard has been successfully linked to your Virtual Instacard.' hideLayerSheet={true} />;
            default:
                return null;
        }
    };

    return (
        <LayoutSheet routeTitle="Link to Universal card" needPadding={false}>
            {renderStep()}
        </LayoutSheet>
    );
}
