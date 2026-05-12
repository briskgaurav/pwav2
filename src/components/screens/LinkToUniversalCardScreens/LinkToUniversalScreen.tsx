"use client"

import { useState } from "react";
import LayoutSheet from "@/components/ui/LayoutSheet";
import { LinkLinkVirtualCardSteps } from "@/types/cardsLinkingSteps";
import SuccessScreen from "../AuthScreens/SuccessScreen";
import PINVerificationScreen from "../AddInstacardScreens/UniversalCardScreens/PINVerificationScreen";
import UniversalCardSelection from "./UniversalCardSelection";

export default function LinkUniversalCardScreen() {
    const [LinkUniversalCardSteps, setLinkUniversalCardSteps] = useState<LinkLinkVirtualCardSteps>("verify_uc_pin");


    const handleNext = (nextStep: LinkLinkVirtualCardSteps) => {
        setLinkUniversalCardSteps(nextStep);
    };



    const renderStep = () => {
        switch (LinkUniversalCardSteps) {
            case 'verify_uc_pin':
                return <PINVerificationScreen cardType="Virtual" cardImageSrc="/img/cards/debit.png" handleNext={handleNext} nextStep="universal_card_selection" title="Enter PIN for this Universal Card" />;
            case 'universal_card_selection':
                return <UniversalCardSelection handleNext={handleNext} />;
            case 'linking_success':
                return <SuccessScreen title='Linking was Successful!' description='Your Virtual Instacard has been successfully linked to your Universal Instacard.' hideLayerSheet={true} />;

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
