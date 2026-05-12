"use client"

import { useState } from "react";
import LayoutSheet from "@/components/ui/LayoutSheet";
import VerifyRegisteredEmail from "./userVerification/verifyRegisteredEmail";
import type { UserUniveralCardSteps } from "@/types/userVerificationSteps";
import { useAppSelector } from "@/store/redux/hooks";
import { selectSelectedCardType } from '@/store/redux/slices/cardRequestSlice'
import UniversalCardMethods from "./UniversalCardScreens/UniversalCardMethods";
import UCPinSetup from "./UCPinSetup";
import HowToUseUniversalCard from "./HowToUseUniversalCard";

export default function AddUniversalCardScreen() {
  const [UserUniversalSteps, setUserUniversalSteps] = useState<UserUniveralCardSteps>('validate_pan');
  const cardType = useAppSelector(selectSelectedCardType)


  const handleNext = (nextStep: UserUniveralCardSteps) => {
    setUserUniversalSteps(nextStep);
  };

  const renderStep = () => {
    switch (UserUniversalSteps) {
      case 'validate_pan':
        return <UniversalCardMethods handleNext={handleNext} />;
      case 'registered_email_verification':
        return <VerifyRegisteredEmail handleNext={handleNext} />;
      case 'card_activation':
        return <UCPinSetup onNext={handleNext} />
      case 'how_to_use_card':
        return <HowToUseUniversalCard />


      // EMAIL > PIN > HOW TO USE 
      default:
        return null;
    }
  };

  return (
    <LayoutSheet routeTitle="Add Instacard" needPadding={false}>
      {renderStep()}
    </LayoutSheet>
  );
}
