"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Checkbox } from "@/components/ui";
import ButtonComponent from "../../ui/ButtonComponent";
import { notifyNavigation } from "@/lib/bridge";
import { submitConsent } from "@/lib/api/cards";
import { ApiError, AuthError } from "@/lib/api/errors";
import { useAppSelector } from "@/store/redux/hooks";
import { selectCardRequestId } from "@/store/redux/slices/cardRequestSlice";
import type { UserInstaCardSteps } from "@/types/userVerificationSteps";
import { listBankAccounts, type BankAccount } from "@/lib/api/bankAccounts";
import { ICONS } from "@/constants/icons";
import { Button, RadioOption } from "@/components/ui";

// TODO: Replace with formatted T&C content sent by the backend in the
//       underwriting response. Once that lands, drop this constant and
//       render `response.termsAndConditions` (or whatever shape ships).
const TERMS = [
  "Issuance Fee - N 1000",
  "Monthly Maintenance Fee - N 50/ month",
  "Minimum monthly repayments to be paid",
  "4% Interest charged monthly on revolving balance",
  "You agree to pay the outstanding amount from your BVN linked accounts",
] as const;

interface DebitCardConsentProps {
  onNext: (nextStep: UserInstaCardSteps) => void;
}

export default function DebitCardConsent({ onNext }: DebitCardConsentProps) {
  const requestId = useAppSelector(selectCardRequestId);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    notifyNavigation("add-debit");
  }, []);

  // Run underwriting on mount. Local state only — these values are not
  // shared with any other screen, so Redux is the wrong place for them.
  //
  // The AbortController serves two purposes:
  //   1. In React Strict Mode (dev), the effect mounts → unmounts → mounts.
  //      Without aborting, the first fetch completes and a duplicate hits
  //      the backend. Aborting cancels the orphaned request at the network
  //      layer (browser shows it as "(canceled)").
  //   2. If the screen unmounts while the request is in flight (user backs
  //      out), the call is canceled and no setState fires after unmount.

  useEffect(() => {
    if (!requestId) {
      setError("Card request not initialised. Please restart the flow.");
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const response = await listBankAccounts();
        setAccounts(response);
        setSelectedAccountId(response.find((a) => a.isPrimary)?.id ?? response[0]?.id ?? null);
      } catch (err) {
        if (err instanceof AuthError) {
          setError("Your session has expired. Please reopen the app.");
        } else if (err instanceof ApiError) {
          setError("Could not load bank accounts. Please try again.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [requestId]);

  const handleApply = async () => {
    if (!requestId || submitting) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      await submitConsent({
        requestId,
        cardTypeRequest: "DEBIT_CARD",
        consentOnTermsAndConditions: true,
      });
      onNext("success");
    } catch (err) {
      if (err instanceof AuthError) {
        setSubmitError("Your session has expired. Please reopen the app.");
      } else if (err instanceof ApiError) {
        setSubmitError("Could not submit your application. Please try again.");
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <p role="alert" className="text-red-600">{error}</p>
      </div>
    );
  }

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) ?? null;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto py-10 p-6">
        <p className="text-md text-text-primary mb-6">
          Select the Bank Account you want to link with this Debit Instacard
        </p>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <p role="alert" className="text-red-600">{error}</p>
          </div>
        ) : (
          <div role="radiogroup" className="flex flex-col gap-3 mb-6">
            {accounts.map((account) => (
              <RadioOption
                key={account.id}
                label={account.maskedLabel}
                icon={ICONS.fcmb}
                selected={account.id === selectedAccountId}
                onSelect={() => setSelectedAccountId(account.id)}
                accessibilityLabel={`Bank account ${account.maskedLabel}`}
              />
            ))}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <p className="text-md text-text-primary">
            Please agree to Terms &amp; Conditions for getting this Instacard issued
          </p>

          <ul className="flex flex-col gap-[6px] m-0 pl-5 list-disc">
            {TERMS.map((term, index) => (
              <li key={index} className="text-sm">
                {term}
              </li>
            ))}
          </ul>
          <div className="text-md text-text-primary">
            {/* <p>Your can view the detailed terms here :</p>
            <Link target="_blank" className="text-blue" href="#">
              https://demo-link.com
            </Link> */}
          </div>

          <Checkbox
            label="I agree the above terms & conditions. Please issue this Instacard"
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
          />

          {submitError && (
            <p role="alert" className="text-sm text-red-600">{submitError}</p>
          )}
        </div>
      </div>

      <ButtonComponent
        title={submitting ? "Submitting…" : "Apply Now"}
        onClick={handleApply}
        disabled={!acceptedTerms || submitting || !selectedAccount || isLoading || !!error}
      />
    </div>
  );
}
