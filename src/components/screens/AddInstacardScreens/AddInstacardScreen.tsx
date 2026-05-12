"use client"

import { useState } from "react";
import LayoutSheet from "@/components/ui/LayoutSheet";
import SelectCardTypes from "@/components/screens/AddInstacardScreens/userVerification/cardTypes";
import VerifyRegisteredEmail from "./userVerification/verifyRegisteredEmail";
import BankVerificationMethod from "./userVerification/bankVerificationMethod";
import CreditCardConsent from "./CreditCardConsent";
import SuccessScreen from "../AuthScreens/SuccessScreen";
import VCCardActivation from "./VCActivation";
import PollingWaitScreen from "./PollingWaitScreen";
import ResumeFeeScreen from "./ResumeFeeScreen";
import GiftRecipientDetailsScreen from "./GiftRecipientDetailsScreen";
import GiftCodeEntryScreen from "./GiftCodeEntryScreen";
import ClosedScreen from "./ClosedScreen";
import HowToUseInstacards from "./HowToUseInstacards";
import { useCardJourney } from "@/hooks/useCardJourney";
import VerifyBankOTP from "./userVerification/verifyBankOTP";

export default function AddInstacardScreen() {
  const { state } = useCardJourney();
  const [activateClicked, setActivateClicked] = useState(false);

  const renderStep = () => {
    if (!state) {
      return (
        <SelectCardTypes />
      );
    }

    switch (state.nextAction.code) {
      case 'VERIFY_EMAIL_OTP':
        return <VerifyRegisteredEmail />;
      case 'VERIFY_BANK_OTP_OR_SOFT_TOKEN':
        return <BankVerificationMethod />;
      case 'VERIFY_BANK_OTP':
        return <VerifyBankOTP />
      case 'CAPTURE_RECIPIENT_DETAILS':
        return <GiftRecipientDetailsScreen />;
      case 'CAPTURE_CONSENT':
      case 'SHOW_ELIGIBILITY_RESULT':
        return <CreditCardConsent />;

      case 'SHOW_CARD_DETAILS_AND_SET_PIN':
        // Two-phase: first show SuccessScreen, then PIN setup
        if (!activateClicked) {
          return (
            <SuccessScreen
              title="Payment was Successful!"
              description="We have successfully collected card issuance Fee for the Virtual Instacard you had requested to be issued."
              buttonText="Activate Now"
              onButtonClick={() => setActivateClicked(true)}
              hideLayerSheet
            />
          );
        }
        return <VCCardActivation />;

      case 'SHOW_CARD_ACTIVE':
        return (
          <HowToUseInstacards
            cardType={state.cardType}
          />
        );

      case 'SHOW_CBN_PENDING_MESSAGE':
      case 'SHOW_FEE_RETRY_IN_PROGRESS':
      case 'SHOW_MIRROR_ACCOUNT_PROCESSING':
        return <PollingWaitScreen />;
      case 'RESUME_FROM_FEE_COLLECTION':
      case 'SHOW_INSUFFICIENT_BALANCE':
        return <ResumeFeeScreen />;
      case 'ENTER_RECIPIENT_CODE':
        return <GiftCodeEntryScreen type="recipient" />;
      case 'ENTER_SENDER_CODE':
        return <GiftCodeEntryScreen type="sender" />;
      case 'SHOW_REQUEST_CLOSED':
        return <ClosedScreen />;
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <p className="text-text-secondary">
              Unexpected state: <code className="font-mono">{state.nextAction.code}</code>
            </p>
            <p className="text-sm text-text-secondary">{state.nextAction.message}</p>
          </div>
        );
    }
  };

  return (
    <LayoutSheet routeTitle="Add Instacard" needPadding={false}>
      {renderStep()}
    </LayoutSheet>
  );
}
