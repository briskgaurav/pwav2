"use client"

import { useState } from "react";

import LayoutSheet from "@/components/ui/LayoutSheet";
import SelectCardTypes from "@/components/screens/AddInstacardScreens/userVerification/cardTypes";
import VerifyRegisteredEmail from "./userVerification/verifyRegisteredEmail";
import BankVerificationMethod from "./userVerification/bankVerificationMethod";
import CreditCardConsent from "./CreditCardConsent";
import type { UserInstaCardSteps } from "@/types/userVerificationSteps";

/**
 * Multi-step "Add Instacard" flow. Each step is rendered by a child component
 * driven by `userVerificationStep` — there are no separate routes per step.
 * See the architectural notes in CreditCardConsent for why this stays a
 * single-page state machine instead of a route hierarchy.
 */
export default function AddInstacardScreen() {
  const [userVerificationStep, setUserVerificationStep] =
    useState<UserInstaCardSteps>('select_card');

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
        return <CreditCardConsent onNext={handleNext} />;
      case 'success':
        // TODO: render the success / card-issued screen.
        return null;
    }
  };

  return (
    <LayoutSheet routeTitle="Add Instacard" needPadding={false}>
      {renderStep()}
    </LayoutSheet>
  );
}
