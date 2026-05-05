"use client";

import { Button } from "@/components/ui";
import type { BankVerifictionMethod, UserVerificationSteps } from "@/types/userVerificationSteps";
import { useState } from "react";
import VerifyBankOTP from "./verifyBankOTP";

interface BankVerificationMethodProps {
  onNext: (step: UserVerificationSteps) => void;
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
          <Button onClick={() => setSelectedVerificationMethod("soft_token")}>
            Go with Soft Token
          </Button>

          <Button onClick={() => setSelectedVerificationMethod("otp")}>
            Go with OTP
          </Button>
        </div>
      )}
      {
        selectedVerificationMethod === "otp" && (
          <VerifyBankOTP onNext={onNext} />
        )
      }
    </>
  );
}