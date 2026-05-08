"use client"

import { useEffect, useState } from "react";

import LayoutSheet from "@/components/ui/LayoutSheet";
import SelectCardTypes from "@/components/screens/AddInstacardScreens/userVerification/cardTypes";
import VerifyRegisteredEmail from "./userVerification/verifyRegisteredEmail";
import BankVerificationMethod from "./userVerification/bankVerificationMethod";
import CreditCardConsent from "./CreditCardConsent";
import type { UserInstaCardSteps } from "@/types/userVerificationSteps";
import SuccessScreen from "../AuthScreens/SuccessScreen";
import VCCardActivation from "./VCActivation";
import { useAppSelector } from "@/store/redux/hooks";
import { selectSelectedCardType } from '@/store/redux/slices/cardRequestSlice'
import DebitCardConsent from "./DebitCardConsent";
import HowToUseInstacards from "./HowToUseInstacards";
import CardConsent from "./CardConsent";
/**
 * Multi-step "Add Instacard" flow. Each step is rendered by a child component
 * driven by `userVerificationStep` — there are no separate routes per step.
 * See the architectural notes in CreditCardConsent for why this stays a
 * single-page state machine instead of a route hierarchy.
 */
export default function AddInstacardScreen() {
  const [userVerificationStep, setUserVerificationStep] = useState<UserInstaCardSteps>('select_card');
  const cardType = useAppSelector(selectSelectedCardType)
  const CardImages = cardType === 'CREDIT_CARD' ? "/img/creditcard.png" : cardType === 'DEBIT_CARD' ? "/img/debitmockup.png" : cardType === 'PREPAID_CARD' ? "/img/prepaid.png" : cardType === 'GIFT_CARD' ? "/img/gift.png" : "/img/debitmockup.png"


  const handleNext = (nextStep: UserInstaCardSteps) => {
    setUserVerificationStep(nextStep);
  };

  const renderStep = () => {
    switch (userVerificationStep) {
      case 'select_card':
        return <SelectCardTypes onNext={handleNext} />;
      case 'registered_email_verification':
        return <VerifyRegisteredEmail onNext={handleNext} />;
      case 'bank_verification':
        return <BankVerificationMethod onNext={handleNext} />;
      case 'user_consent':
        // if (cardType === 'CREDIT_CARD') {
        //   return <CreditCardConsent onNext={handleNext} />;
        // } if (cardType === 'DEBIT_CARD') {
        //   return <DebitCardConsent onNext={handleNext} />;
        // }
        return <CardConsent cardType={cardType} onNext={handleNext} />;
      case 'success':
        // TODO: render the success / card-issued screen.
        //return <SuccessScreen hideLayerSheet onButtonClick={handleCardActivation} />;
        return <SuccessScreen cardImageUrl={CardImages} hideLayerSheet onButtonClick={() => handleNext('card_activation')} />
      case 'card_activation':
        return <VCCardActivation onNext={handleNext} />
      case 'how_to_use_card':
        return <HowToUseInstacards CardImagesUrl={CardImages} cardType={cardType} />

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
