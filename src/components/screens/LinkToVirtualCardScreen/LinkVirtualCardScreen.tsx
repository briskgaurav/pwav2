"use client"

import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LayoutSheet from "@/components/ui/LayoutSheet";
import { LinkLinkVirtualCardSteps } from "@/types/cardsLinkingSteps";
import VirtualCardSelections from "./VirtualCardSelections";
import SuccessScreen from "../AuthScreens/SuccessScreen";
import PINVerificationScreen from "../AddInstacardScreens/UniversalCardScreens/PINVerificationScreen";
import { routes } from "@/lib/routes";
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { selectUniversalCards } from "@/store/redux/slices/cardDataWalletSlice";
import { universalCardStableId } from "@/lib/api/cards";
import { initiateCardLink, selectUc } from "@/lib/api/cardLinkApi";
import { setCardLinkingData } from "@/store/redux/slices/cardLinkingSlice";
import { showToast } from "@/store/redux/slices/toasterSlice";

export default function LinkVirtualCardScreen() {
  const searchParams = useSearchParams();
  const isFromInstacard = searchParams.get("source") === "instacard";

  const [step, setStep] = useState<LinkLinkVirtualCardSteps>(
    isFromInstacard ? "initiating" : "virtual_card_selection"
  );

  const router = useRouter();
  const dispatch = useAppDispatch();
  const universalCards = useAppSelector(selectUniversalCards);
  const managingCardId = useAppSelector((s) => s.cardWallet.managingCardId);
  const initiatedRef = useRef(false);

  const selectedUniversalCard = useMemo(() => {
    if (!managingCardId) return undefined;
    return universalCards.find((c) => universalCardStableId(c) === managingCardId);
  }, [managingCardId, universalCards]);

  useEffect(() => {
    if (!isFromInstacard || step !== "initiating" || initiatedRef.current) return;
    initiatedRef.current = true;

    const initFlow = async () => {
      try {
        const initiateRes = await initiateCardLink();
        dispatch(setCardLinkingData({ response: initiateRes }));

        const ucCardId = selectedUniversalCard?.ucCardId;
        if (ucCardId) {
          const selectRes = await selectUc(initiateRes.requestId, ucCardId);
          dispatch(setCardLinkingData({ response: selectRes }));
        }

        setStep("verify_uc_pin");
      } catch (err: any) {
        dispatch(
          showToast({
            message: "Failed to initiate linking",
            subtitle:
              err?.errorMessage ||
              "Could not start the linking process. Please try again.",
            duration: 3000,
            tosterType: "error",
          })
        );
        // router.back();
      }
    };

    initFlow();
  }, [isFromInstacard, step, selectedUniversalCard, dispatch, router]);

  const handleNext = (nextStep: LinkLinkVirtualCardSteps) => {
    setStep(nextStep);
  };

  const renderStep = () => {
    switch (step) {
      case "initiating":
        return (
          <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <p className="text-sm text-text-secondary animate-pulse">
              Starting link session…
            </p>
          </div>
        );
      case "verify_uc_pin":
        return (
          <PINVerificationScreen
            verifyUcPinApi
            cardImageSrc="/img/cards/Universal1.png"
            handleNext={handleNext}
            title="Enter PIN for this Universal Card"
          />
        );
      case "virtual_card_selection":
        return <VirtualCardSelections handleNext={handleNext} />;
      case "linking_success":
        return (
          <SuccessScreen
            buttonText="Go to Instacard"
            onButtonClick={() => router.push(routes.instacard)}
            title="Linking was Successful!"
            description="Your Virtual Instacard has been successfully linked to your Universal Instacard."
            hideLayerSheet={true}
          />
        );
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
