"use client"

import { useState } from "react";
import LayoutSheet from "@/components/ui/LayoutSheet";
import { LinkLinkVirtualCardSteps } from "@/types/cardsLinkingSteps";
import VirtualCardSelections from "./VirtualCardSelections";
import SuccessScreen from "../AuthScreens/SuccessScreen";

export default function LinkVirtualCardScreen() {
  const [LinkVirtualCardSteps, setLinkVirtualCardSteps] = useState<LinkLinkVirtualCardSteps>("virtual_card_selection");


  const handleNext = (nextStep: LinkLinkVirtualCardSteps) => {
    setLinkVirtualCardSteps(nextStep);
  };

  const renderStep = () => {
    switch (LinkVirtualCardSteps) {
      case 'virtual_card_selection':
        return <VirtualCardSelections handleNext={handleNext} />;
      case 'linking_success':
        return <SuccessScreen title='Linking was Successful!' description='Your Virtual Instacard has been successfully linked to your Universal Instacard.' hideLayerSheet={true} handleNext={handleNext} />;
     
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
