"use client"

import LayoutSheet from "@/components/ui/LayoutSheet";
import { useState } from "react";
import SelectCardTypes from "@/components/screens/AddInstacardScreens/userVerification/cardTypes";
import type { UserVerificationSteps } from "@/types/userVerificationSteps";
import VerifyRegisteredEmail from "./userVerification/verifyRegisteredEmail";
import BankVerificationMethod from "./userVerification/bankVerificationMethod";

export default function AddInstacardScreen() {
  const [userVerificationStep, setUserVerificationStep] = useState<UserVerificationSteps>('select_card');


  const handleNext = (nextStep: UserVerificationSteps) => {
    setUserVerificationStep(nextStep);
  }

  return (
     <LayoutSheet routeTitle="Add Instacard" needPadding={false}>
      {userVerificationStep === 'select_card' && <SelectCardTypes onNext={handleNext} />}
      {userVerificationStep === 'registered_email_verification' && <VerifyRegisteredEmail onNext={handleNext} />}
      {userVerificationStep === 'bank_verification' && <BankVerificationMethod onNext={handleNext} />}
     </LayoutSheet>
  )
  
}