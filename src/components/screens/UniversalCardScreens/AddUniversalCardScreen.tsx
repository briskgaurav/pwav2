"use client"

import { useState } from "react";
import LayoutSheet from "@/components/ui/LayoutSheet";
import { useCardLinkJourney } from "@/hooks/useCardLinkJourney";
import { initiateCardLink } from "@/lib/api/cardLinkApi";
import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";
import { showToast } from "@/store/redux/slices/toasterSlice";

// Screen components for each nextAction.code
import VcPinScreen from "./VcPinScreen";
import UcPickerScreen from "./UcPickerScreen";
import UcPinScreen from "./UcPinScreen";
import UcPanEntryScreen from "./UcPanEntryScreen";
import UcPinSetupScreen from "./UcPinSetupScreen";
import VcPickerScreen from "./VcPickerScreen";
import LinkProcessingScreen from "./LinkProcessingScreen";
import LinkSuccessScreen from "./LinkSuccessScreen";
import LinkFailedScreen from "./LinkFailedScreen";

// Initial PAN entry screen (before /initiate — standalone UC creation, journey C)
import EnterUniversalCard from "./EnterUniversalCard";

/**
 * AddUniversalCardScreen — entry point for the VC ↔ UC linking flow.
 *
 * Route: `/instacard/add-universal-card`
 *
 * Supports three journeys:
 *   A. Existing VC + existing UC (vcCardId provided from Redux)
 *   B. Existing VC + new UC (vcCardId provided, no UCs found)
 *   C. Standalone UC creation (no vcCardId)
 *
 * After `/initiate`, the backend drives screen progression via `nextAction.code`.
 * This component is the single router — it dispatches on the code and renders
 * the appropriate screen.
 */
export default function AddUniversalCardScreen() {
  const { state, call } = useCardLinkJourney();
  const dispatch = useAppDispatch();
  const [isInitiating, setIsInitiating] = useState(false);

  // If a VC was selected before navigating here, it's stored in Redux
  const managingCardId = useAppSelector((s) => s.cardWallet.managingCardId);

  /**
   * Called when the user enters a UC PAN on the initial screen and taps Continue
   * (journey C — standalone UC creation, no VC selected).
   * Also called from journey A/B entry where the user came from a VC card action.
   */
  const handleInitiate = async (vcCardId?: string) => {
    setIsInitiating(true);
    try {
      await call(() => initiateCardLink(vcCardId));
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'errorMessage' in err
          ? (err as { errorMessage: string }).errorMessage
          : 'Failed to start linking. Please try again.';
      dispatch(
        showToast({
          message: 'Something Went Wrong',
          subtitle: message,
          duration: 3000,
          tosterType: 'error',
        }),
      );
    } finally {
      setIsInitiating(false);
    }
  };

  const renderStep = () => {
    // Before /initiate has been called — show initial screen
    if (!state) {
      return (
        <EnterUniversalCard
          isInitiating={isInitiating}
          onInitiate={() => handleInitiate(managingCardId ?? undefined)}
          hasVcSelected={!!managingCardId}
        />
      );
    }

    // Backend-driven screen routing
    switch (state.nextAction.code) {
      case 'VERIFY_VC_PIN':
        return <VcPinScreen />;
      case 'SELECT_UC_FROM_LIST':
        return <UcPickerScreen />;
      case 'VERIFY_UC_PIN':
        return <UcPinScreen />;
      case 'PROVIDE_UC_PAN':
        return <UcPanEntryScreen />;
      case 'SETUP_UC_PIN':
        return <UcPinSetupScreen />;
      case 'SELECT_VC_TO_LINK':
        return <VcPickerScreen />;
      case 'SHOW_LINK_PROCESSING':
        return <LinkProcessingScreen />;
      case 'SHOW_LINK_SUCCESS':
        return <LinkSuccessScreen />;
      case 'SHOW_LINK_FAILED':
        return <LinkFailedScreen />;
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
    <LayoutSheet routeTitle="Add Universal Card" needPadding={false}>
      {renderStep()}
    </LayoutSheet>
  );
}
