'use client';

import VerificationCodeScreen from '@/components/screens/AuthScreens/VerificationCodeScreen';
import {
  retryRegisteredEmailOtpForCardLink,
  verifyRegisteredEmailOtpForCardLink,
} from '@/lib/api/cardLinkApi';
import { verifyEmailOtpV2, retryEmailOtp } from '@/lib/api/cardJourneyApi';
import { useCardJourney } from '@/hooks/useCardJourney';
import { useAppDispatch, useAppSelector } from '@/store/redux/hooks';
import { showToast } from '@/store/redux/slices/toasterSlice';
import { ApiError } from '@/lib/api/errors';
import { UserUniveralCardSteps } from '@/types/userVerificationSteps';
import { selectCardLinkingData, setCardLinkingData } from '@/store/redux/slices/cardLinkingSlice';

type VerifyRegisteredEmailProps = {
  handleNext?: (step: UserUniveralCardSteps) => void;
  /**
   * Add Universal Card (card-link session): `POST /api/v1/card/email-otp/verify`
   * with `requestId` from {@link cardLinkingSlice} (e.g. after provide-uc-pan).
   */
  useCardLinkEmailOtp?: boolean;
};

/**
 * Email OTP screen.
 *
 * - **Issuance** (`useCardLinkEmailOtp` false): driven by card-request Redux +
 *   `VerifyRegisteredEmail` may omit `handleNext`; parent switches on `nextAction.code`.
 * - **Add UC / card-link** (`useCardLinkEmailOtp` true): reads `requestId` +
 *   `destinationMasked` from card-link state; verify updates Redux then advances to PIN setup.
 */
export default function VerifyRegisteredEmail({
  handleNext,
  useCardLinkEmailOtp = false,
}: VerifyRegisteredEmailProps) {
  const dispatch = useAppDispatch();
  const { state, call } = useCardJourney();
  const cardLink = useAppSelector(selectCardLinkingData);

  const requestId = useCardLinkEmailOtp
    ? (cardLink.response?.requestId ?? '')
    : (state?.requestId ?? '');

  const maskedEmail = useCardLinkEmailOtp
    ? (cardLink.response?.nextAction?.destinationMasked ?? '')
    : (state?.nextAction?.destinationMasked ?? '');

  const handleVerify = async (code: string) => {
    if (!requestId) {
      throw new Error(
        useCardLinkEmailOtp
          ? 'Card link session missing. Go back and try again.'
          : 'Card request not initialised. Please restart the flow.',
      );
    }

    if (useCardLinkEmailOtp) {
      const response = await verifyRegisteredEmailOtpForCardLink(requestId, code);
      dispatch(setCardLinkingData({ response }));
      handleNext?.('card_activation');
      return;
    }

    await call(() => verifyEmailOtpV2(requestId, code));
    if (handleNext) handleNext('card_activation');
  };

  const handleResend = async () => {
    if (!requestId) {
      throw new Error(
        useCardLinkEmailOtp
          ? 'Card link session missing. Go back and try again.'
          : 'Card request not initialised. Please restart the flow.',
      );
    }

    if (useCardLinkEmailOtp) {
      try {
        const response = await retryRegisteredEmailOtpForCardLink(requestId);
        dispatch(setCardLinkingData({ response }));
        dispatch(
          showToast({
            message: 'OTP sent successfully',
            subtitle: 'Please check your email for the OTP',
            duration: 2000,
            tosterType: 'success',
          }),
        );
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          dispatch(
            showToast({
              message: 'Retry after some time',
              subtitle: 'Something went wrong!',
              duration: 2000,
              tosterType: 'error',
            }),
          );
          return;
        }
        throw err;
      }
      return;
    }

    try {
      await call(() => retryEmailOtp(requestId));
      dispatch(
        showToast({
          message: 'OTP sent successfully',
          subtitle: 'Please check your email for the OTP',
          duration: 2000,
          tosterType: 'success',
        }),
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        dispatch(
          showToast({
            message: 'Retry after some time',
            subtitle: 'Something went wrong!',
            duration: 2000,
            tosterType: 'error',
          }),
        );

        return;
      }
      throw err;
    }
  };

  return (
    <VerificationCodeScreen
      title="Verify OTP"
      subtitle="We have sent you a 6-digit code to your"
      maskedValue={maskedEmail}
      onVerify={handleVerify}
      onResend={handleResend}
      initialResendCooldownSeconds={30}
    />
  );
}
