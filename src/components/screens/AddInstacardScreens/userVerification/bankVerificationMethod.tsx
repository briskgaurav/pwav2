"use client";

import { Button } from "@/components/ui";
import type { BankVerifictionMethod, UserInstaCardSteps } from "@/types/userVerificationSteps";
import { useState } from "react";
import VerifyBankOTP from "./verifyBankOTP";
import VerifyBankSoftToken from "./verifyBankSoftToken";

interface BankVerificationMethodProps {
  onNext: (step: UserInstaCardSteps) => void;
}

export default function BankVerificationMethod({
  onNext
}: BankVerificationMethodProps) {
  // Added type to useState so it knows what values are allowed
  const [selectedVerificationMethod, setSelectedVerificationMethod] = 
    useState<BankVerifictionMethod | null>(null);

  return (
    <>
      {selectedVerificationMethod === null && (
        <div className="flex-1 w-full flex flex-col items-center justify-center gap-4 min-h-full px-6">
          <Button className="full" onClick={() => setSelectedVerificationMethod("soft_token")}>
            Go with Soft Token
          </Button>

          <Button className="full" onClick={() => setSelectedVerificationMethod("otp")}>
            Go with OTP
          </Button>
        </div>
      )}
      {
        selectedVerificationMethod === "otp" && (
          <VerifyBankOTP onNext={onNext} />
        )
      }

      {
        selectedVerificationMethod === 'soft_token' && (
          <VerifyBankSoftToken onNext={onNext} />
        )
      }
    </>
  );
}