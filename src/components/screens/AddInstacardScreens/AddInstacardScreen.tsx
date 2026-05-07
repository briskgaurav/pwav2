"use client"

import { useState } from "react";

import LayoutSheet from "@/components/ui/LayoutSheet";
import SelectCardTypes from "@/components/screens/AddInstacardScreens/userVerification/cardTypes";
import VerifyRegisteredEmail from "./userVerification/verifyRegisteredEmail";
import BankVerificationMethod from "./userVerification/bankVerificationMethod";
import CreditCardConsent from "./CreditCardConsent";
import type { UserInstaCardSteps } from "@/types/userVerificationSteps";
import SuccessScreen from "../AuthScreens/SuccessScreen";
import VCCardActivation from "./VCActivation";

import { useAppSelector } from "@/store/redux/hooks";
import { selectSelectedCardType } from "@/store/redux/slices/cardRequestSlice";
import PrepaidCardConsent from "./PrepaidCardConsent";
import GiftCardConsent from "./GiftCardConsent";
import GiftACardScreen from "../ClaimGiftCardScreens/GiftACardScreen";
import GiftACardReceipientInf from "./GiftCardReceipientInformation";
import DebitCardConsentScreen from "./DebitCardConsentScreen";


/**
 * Multi-step "Add Instacard" flow. Each step is rendered by a child component
 * driven by `userVerificationStep` — there are no separate routes per step.
 * See the architectural notes in CreditCardConsent for why this stays a
 * single-page state machine instead of a route hierarchy.
 */
export default function AddInstacardScreen() {
  const [userVerificationStep, setUserVerificationStep] =
    useState<UserInstaCardSteps>('select_card');
   const selectedType = useAppSelector(selectSelectedCardType);  

  const handleNext = (nextStep: UserInstaCardSteps) => {
    console.log('Next step:', nextStep);
    setUserVerificationStep(nextStep);
  };

  const renderStep = () => {
    switch (userVerificationStep) {
      case 'select_card':
        return <SelectCardTypes onNext={handleNext} />;
      case 'prepare_gift_card':
        return <GiftACardReceipientInf onNext={handleNext} />;
      case 'registered_email_verification':
        return <VerifyRegisteredEmail onNext={handleNext} />;
      case 'bank_verification':
        return <BankVerificationMethod onNext={handleNext} />;
      case 'user_consent':
        if (selectedType === "DEBIT_CARD") {
          return <DebitCardConsentScreen onNext={handleNext} />;
        }
        if (selectedType === "CREDIT_CARD") {
          return <CreditCardConsent onNext={handleNext} />;
        }
        if (selectedType === "PREPAID_CARD") {
          return <PrepaidCardConsent onNext={handleNext} />;
        }
        if (selectedType === "GIFT_CARD") {
          return <GiftCardConsent onNext={handleNext} />;
        }
        return null;
      case 'success':
        // TODO: render the success / card-issued screen.
        //return <SuccessScreen hideLayerSheet onButtonClick={handleCardActivation} />;
        return <SuccessScreen hideLayerSheet onButtonClick={() => handleNext('card_activation')} />
      case 'card_activation':
        return <VCCardActivation />
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
