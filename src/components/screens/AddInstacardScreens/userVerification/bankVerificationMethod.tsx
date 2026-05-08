"use client";

import { Button } from "@/components/ui";
import type { BankVerifictionMethod } from "@/types/userVerificationSteps";
import { useState } from "react";
import VerifyBankOTP from "./verifyBankOTP";
import VerifyBankSoftToken from "./verifyBankSoftToken";
import { useCardJourney } from "@/hooks/useCardJourney";
import { sendBankOtpV2 } from "@/lib/api/cardJourneyApi";
import { useAppDispatch } from "@/store/redux/hooks";
import { showToast } from "@/store/redux/slices/toasterSlice";

/**
 * Bank verification chooser — driven by
 * `nextAction.code === 'VERIFY_BANK_OTP_OR_SOFT_TOKEN'`.
 *
 * Shows two options: "Soft Token" and "Bank OTP".
 *
 * - **Bank OTP**: Calls `POST /api/v1/card/bank-otp/send` to trigger
 *   the OTP send, then renders the OTP entry screen.
 * - **Soft Token**: Renders the soft-token entry screen directly
 *   (no send call needed — the token is generated client-side by the
 *   user's authenticator app).
 */
export default function BankVerificationMethod() {
  const [selectedVerificationMethod, setSelectedVerificationMethod] =
    useState<BankVerifictionMethod | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const { state, call } = useCardJourney();
  const dispatch = useAppDispatch();

  const requestId = state?.requestId ?? '';

  const handleSelectBankOtp = async () => {
    if (!requestId || sendingOtp) return;

    setSendingOtp(true);
    try {
      // Fire POST /api/v1/card/bank-otp/send — backend responds with
      // the same envelope (OTP_BANK_PENDING + destinationMasked).
      await call(() => sendBankOtpV2(requestId));
      setSelectedVerificationMethod("otp");
    } catch (err: any) {
      dispatch(showToast({
        message: 'Could not send OTP',
        subtitle: err?.errorMessage || 'Please try again.',
        duration: 3000,
        tosterType: 'error',
      }));
    } finally {
      setSendingOtp(false);
    }
  };

  return (
    <>
      {selectedVerificationMethod === null && (
        <div className="flex-1 w-full flex flex-col items-stretch justify-center gap-4 min-h-full px-6">
          <Button className="full" onClick={() => setSelectedVerificationMethod("soft_token")}>
            Go with Soft Token
          </Button>

          <Button
            className="full"
            onClick={handleSelectBankOtp}
            disabled={sendingOtp}
          >
            {sendingOtp ? "Sending OTP…" : "Go with OTP"}
          </Button>
        </div>
      )}
      {
        selectedVerificationMethod === "otp" && (
          <VerifyBankOTP />
        )
      }

      {
        selectedVerificationMethod === 'soft_token' && (
          <VerifyBankSoftToken />
        )
      }
    </>
  );
}