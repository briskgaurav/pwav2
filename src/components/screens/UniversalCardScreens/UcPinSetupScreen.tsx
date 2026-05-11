'use client';

import { useCardLinkJourney } from '@/hooks/useCardLinkJourney';
import { setupUcPin } from '@/lib/api/cardLinkApi';
import { useAppDispatch } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';
import PinSetupForm from '@/components/screens/AuthScreens/PinSetupFormScreen';

/**
 * UC PIN setup screen — driven by `nextAction.code === 'SETUP_UC_PIN'`.
 *
 * The user creates a new PIN for their Universal Card.
 * Uses the shared PinSetupForm component (enter + confirm).
 */
export default function UcPinSetupScreen() {
  const { state, call } = useCardLinkJourney();
  const dispatch = useAppDispatch();

  const requestId = state?.requestId ?? '';

  const handleSubmit = async (pin: string) => {
    if (!requestId) {
      dispatch(
        showToast({
          message: 'Something Went Wrong!',
          subtitle: 'Please try again later.',
          duration: 2000,
          tosterType: 'error',
        }),
      );
      return;
    }

    try {
      await call(() => setupUcPin(requestId, pin));
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'errorMessage' in err
          ? (err as { errorMessage: string }).errorMessage
          : 'PIN setup failed. Please try again.';
      dispatch(
        showToast({
          message: 'PIN Setup Failed',
          subtitle: message,
          duration: 3000,
          tosterType: 'error',
        }),
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <PinSetupForm
        title="Set Universal Card PIN"
        subtitle="Create a PIN for your Universal Card"
        pinLabel="Enter 4-digit PIN"
        confirmPinLabel="Re-Enter PIN"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
