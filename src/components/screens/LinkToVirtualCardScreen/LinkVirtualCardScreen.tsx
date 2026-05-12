"use client"

import { useState } from "react";
import LayoutSheet from "@/components/ui/LayoutSheet";
import { LinkLinkVirtualCardSteps } from "@/types/cardsLinkingSteps";
import VirtualCardSelections from "./VirtualCardSelections";
import SuccessScreen from "../AuthScreens/SuccessScreen";
import PINVerificationScreen from "../AddInstacardScreens/UniversalCardScreens/PINVerificationScreen";

export default function LinkVirtualCardScreen() {
  const [LinkVirtualCardSteps, setLinkVirtualCardSteps] = useState<LinkLinkVirtualCardSteps>("verify_uc_pin");


  const handleNext = (nextStep: LinkLinkVirtualCardSteps) => {
    setLinkVirtualCardSteps(nextStep);
  };

  



  const renderStep = () => {
    switch (LinkVirtualCardSteps) {
      case 'verify_uc_pin':
        return <PINVerificationScreen cardImageSrc="/img/cards/Universal1.png" handleNext={handleNext} title="Enter PIN for this Universal Card" />;
      case 'virtual_card_selection':
        return <VirtualCardSelections handleNext={handleNext} />;
      case 'linking_success':
        return <SuccessScreen title='Linking was Successful!' description='Your Virtual Instacard has been successfully linked to your Universal Instacard.' hideLayerSheet={true} />;

      default:
        return null;
    }
  };

  return (
    <LayoutSheet routeTitle="Link to virtual card" needPadding={false}>
      {renderStep()}
    </LayoutSheet>
  );
}
