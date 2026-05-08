"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Checkbox, RadioOption } from "@/components/ui";
import ButtonComponent from "../../ui/ButtonComponent";

import { notifyNavigation } from "@/lib/bridge";

import {
  creditUnderwriting,
  submitConsent,
  type UnderwritingDecision,
} from "@/lib/api/cards";

import { listBankAccounts, type BankAccount } from "@/lib/api/bankAccounts";

import { ApiError, AuthError } from "@/lib/api/errors";

import { useAppDispatch, useAppSelector } from "@/store/redux/hooks";

import {
  selectCardRequestId,
  setCustomerName,
  setMaskedCardPAN,
} from "@/store/redux/slices/cardRequestSlice";

import type { UserInstaCardSteps } from "@/types/userVerificationSteps";

import { ICONS } from "@/constants/icons";
import { CardType } from "@/constants/cardData";


const TERMS = [
  "Issuance Fee - N 1000",
  "Monthly Maintenance Fee - N 50/ month",
  "Minimum monthly repayments to be paid",
  "4% Interest charged monthly on revolving balance",
  "You agree to pay the outstanding amount from your BVN linked accounts",
] as const;

interface CardConsentProps {
  onNext: (nextStep: UserInstaCardSteps) => void;
  cardType: CardType | null;
}

export default function CardConsent({
  onNext,
  cardType,
}: CardConsentProps) {
  const requestId = useAppSelector(selectCardRequestId);

  const dispatch = useAppDispatch();

  const isCredit = cardType === "CREDIT_CARD";
  const isDebit = cardType === "DEBIT_CARD";
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // CREDIT
  const [decision, setDecision] =
    useState<UnderwritingDecision | null>(null);

  const [approvedCreditLimit, setApprovedCreditLimit] =
    useState<number | null>(null);

  // DEBIT
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  const [selectedAccountId, setSelectedAccountId] =
    useState<string | null>(null);

  useEffect(() => {
    notifyNavigation(isCredit ? "add-credit" : "add-debit");
  }, [isCredit]);

  useEffect(() => {
    if (!requestId) {
      setError("Card request not initialised. Please restart the flow.");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        // CREDIT FLOW
        if (isCredit) {
          const response = await creditUnderwriting(
            {
              requestId,
              cardTypeRequest: "CREDIT_CARD",
            },
            {
              signal: controller.signal,
            }
          );

          setDecision(response.underwritingDecision);

          setApprovedCreditLimit(response.approvedCreditLimit);
        }

        // DEBIT FLOW
        if (isDebit) {
          const response = await listBankAccounts();

          setAccounts(response);

          setSelectedAccountId(
            response.find((a) => a.isPrimary)?.id ??
              response[0]?.id ??
              null
          );
        }
      } catch (err) {
        if (err instanceof ApiError && err.code === "ABORTED") return;

        if (err instanceof AuthError) {
          setError("Your session has expired. Please reopen the app.");
        } else if (err instanceof ApiError) {
          setError(
            isCredit
              ? "Could not run underwriting. Please try again."
              : "Could not load bank accounts. Please try again."
          );
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [requestId, isCredit, isDebit]);

  const handleApply = async () => {
    if (!requestId || submitting) return;

    setSubmitError(null);

    setSubmitting(true);

    try {
      const response = await submitConsent({
        requestId,
        cardTypeRequest: isCredit
          ? "CREDIT_CARD"
          : "DEBIT_CARD",
        consentOnTermsAndConditions: true,
      });

      if (response?.maskedPan) {
        dispatch(setMaskedCardPAN(response.maskedPan));
      }
      dispatch(setCustomerName(response.customerName))

      onNext("success");
    } catch (err) {
      if (err instanceof AuthError) {
        setSubmitError("Your session has expired. Please reopen the app.");
      } else if (err instanceof ApiError) {
        setSubmitError(
          "Could not submit your application. Please try again."
        );
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
        <p role="alert" className="text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (isCredit && decision === "REJECTED") {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-text-primary">
            Application not approved
          </p>

          <p className="text-sm text-text-primary">
            Sorry, we couldn&apos;t approve your application at this time.
          </p>
        </div>
      </div>
    );
  }

  const selectedAccount =
    accounts.find((a) => a.id === selectedAccountId) ?? null;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto py-10 p-6">

        {/* CREDIT LIMIT */}
        {isCredit && (
          <div className="p-6 text-lg border bg-white space-y-6 border-text-primary/20 text-center text-text-primary rounded-2xl mb-6">
            <p className="font-medium">
              Pre-approved Credit Limit
            </p>

            <p className="font-semibold text-3xl">
              <span className="line-through">N</span>{" "}
              {approvedCreditLimit}
            </p>
          </div>
        )}

        {/* DEBIT ACCOUNT SELECTION */}
        {isDebit && (
          <>
            <p className="text-md text-text-primary mb-6">
              Select the Bank Account you want to link with this Debit Instacard
            </p>

            <div
              role="radiogroup"
              className="flex flex-col gap-3 mb-6"
            >
              {accounts.map((account) => (
                <RadioOption
                  key={account.id}
                  label={account.maskedLabel}
                  icon={ICONS.fcmb}
                  selected={account.id === selectedAccountId}
                  onSelect={() =>
                    setSelectedAccountId(account.id)
                  }
                  accessibilityLabel={`Bank account ${account.maskedLabel}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="flex flex-col gap-5">
          <p className="text-md text-text-primary">
            {isCredit
              ? "Please agree on following T&C for accessing Credit Instacard"
              : "Please agree to Terms & Conditions for getting this Instacard issued"}
          </p>

          <ul className="flex flex-col gap-[6px] m-0 pl-5 list-disc">
            {TERMS.map((term, index) => (
              <li key={index} className="text-sm">
                {term}
              </li>
            ))}
          </ul>

          {isCredit && (
            <div className="text-md text-text-primary">
              <p>
                You can view the detailed terms here :
              </p>

              <Link
                target="_blank"
                className="text-blue"
                href="#"
              >
                https://demo-link.com
              </Link>
            </div>
          )}

          <Checkbox
            label={
              isCredit
                ? "I agree to the above terms & conditions. Please process my application"
                : "I agree the above terms & conditions. Please issue this Instacard"
            }
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
          />

          {submitError && (
            <p
              role="alert"
              className="text-sm text-red-600"
            >
              {submitError}
            </p>
          )}
        </div>
      </div>

      <ButtonComponent
        title={submitting ? "Submitting…" : "Apply Now"}
        onClick={handleApply}
        disabled={
          !acceptedTerms ||
          submitting ||
          (isDebit && !selectedAccount)
        }
      />
    </div>
  );
}