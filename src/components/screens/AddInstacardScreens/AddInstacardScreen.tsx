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
import { createCardRequest } from "@/lib/api/cardJourneyApi";
import type { CardType } from "@/constants/cardData";
import { useAppDispatch } from "@/store/redux/hooks";
import { showToast } from "@/store/redux/slices/toasterSlice";
import { MOCK_HOST_CONTEXT } from "@/lib/api/__mocks__/hostContext";
import { CARD_CONFIG } from "@/lib/card-config";

/**
 * Root card-issuance flow component.
 *
 * Before any backend state exists, renders the card-type selector.
 * Once `POST /card/request` returns, the backend's `nextAction.code`
 * drives which screen to render. Every subsequent API call returns the
 * same `CardRequestStateResponse` envelope — we dispatch it into Redux
 * and the router re-renders the correct screen automatically.
 *
 * Local UI state is used for two intermediate transitions that happen
 * entirely on the client:
 *  - `activateClicked`: User saw the fee-success screen and tapped
 *    "Activate Now" — transition from SuccessScreen → PIN setup.
 *  - PIN setup success dispatches SHOW_CARD_ACTIVE → HowToUseInstacards.
 */
export default function AddInstacardScreen() {
  const { state, call, reset } = useCardJourney();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Local flag: user clicked "Activate Now" on the success screen.
  // While the backend state is still SHOW_CARD_DETAILS_AND_SET_PIN, we
  // skip the success screen and show PIN setup instead.
  const [activateClicked, setActivateClicked] = useState(false);

  const startJourney = async (cardType: CardType) => {
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await call(() =>
        createCardRequest({
          cardType,
          selectedBankAccountNumber:
            cardType === 'CREDIT_CARD' || cardType === 'DEBIT_CARD'
              ? MOCK_HOST_CONTEXT.selectedBankAccountNumber
              : undefined,
        }),
      );
    } catch (err: any) {
      const msg = err?.errorMessage || 'Could not start your card request. Please try again.';
      setErrorMessage(msg);
      dispatch(showToast({
        message: 'Something went wrong',
        subtitle: msg,
        duration: 3000,
        tosterType: 'error',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  /** Resolve the mockup image URL for the current card type. */
  const getCardImage = (): string => {
    const ct = state?.cardType;
    if (ct && ct in CARD_CONFIG) {
      return CARD_CONFIG[ct as keyof typeof CARD_CONFIG].mockupImage;
    }
    return '/img/debitmockup.png';
  };

  const renderStep = () => {
    if (!state) {
      return (
        <SelectCardTypes
          onNext={() => { }}
          overrideSubmit={startJourney}
          submitting={submitting}
          errorMessage={errorMessage}
        />
      );
    }

    switch (state.nextAction.code) {
      case 'VERIFY_EMAIL_OTP':
        return <VerifyRegisteredEmail />;
      case 'VERIFY_BANK_OTP_OR_SOFT_TOKEN':
        return <BankVerificationMethod />;
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
              cardImageUrl={getCardImage()}
              onButtonClick={() => setActivateClicked(true)}
            />
          );
        }
        return <VCCardActivation />;

      case 'SHOW_CARD_ACTIVE':
        return (
          <HowToUseInstacards
            CardImagesUrl={getCardImage()}
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
