"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Checkbox } from "@/components/ui";
import ButtonComponent from "../../ui/ButtonComponent";
import { notifyNavigation } from "@/lib/bridge";
import { submitConsentV2 } from "@/lib/api/cardJourneyApi";
import { useCardJourney } from "@/hooks/useCardJourney";
import { useAppDispatch } from "@/store/redux/hooks";
import { showToast } from "@/store/redux/slices/toasterSlice";

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

/**
 * Universal consent screen — driven by:
 *   - `nextAction.code === 'CAPTURE_CONSENT'` (DEBIT / PREPAID / GIFT)
 *   - `nextAction.code === 'SHOW_ELIGIBILITY_RESULT'` (CREDIT)
 *
 * For CREDIT: shows `approvedCreditLimitMinor` (÷100) + T&C.
 * For DEBIT:  shows `linkedAccounts` selector + T&C.
 * For PREPAID/GIFT: shows T&C only.
 */
export default function CreditCardConsent() {
  const { state, call } = useCardJourney();
  const dispatch = useAppDispatch();

  const requestId = state?.requestId ?? '';
  const cardType = state?.cardType;
  const consentVersion = state?.consentVersion ?? 'v1';
  const approvedCreditLimit = state?.approvedCreditLimitMinor;
  const linkedAccounts = state?.linkedAccounts;
  const currentState = state?.currentState;
  const isEligibilityFailed = currentState === 'ELIGIBILITY_FAILED';

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    notifyNavigation("add-consent");
  }, []);

  const handleApply = async () => {
    if (!requestId || submitting) return;

    setSubmitError(null);
    setSubmitting(true);
    try {
      await call(() => submitConsentV2(requestId, consentVersion));
    } catch (err: any) {
      const msg = err?.errorMessage || err?.message || 'Could not submit your application. Please try again.';
      setSubmitError(msg);
      dispatch(showToast({
        message: 'Submission Failed',
        subtitle: msg,
        duration: 3000,
        tosterType: 'error',
      }));
    } finally {
      setSubmitting(false);
    }
  };

  // Terminal: eligibility failed
  if (isEligibilityFailed) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-text-primary">
            Application not approved
          </p>
          <p className="text-sm text-text-primary">
            Sorry, we couldn&apos;t approve your application at this time.
          </p>
          {state?.failureReason && (
            <p className="text-xs text-text-secondary mt-2">{state.failureReason}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto py-10 p-6">
        {/* Credit: show approved limit */}
        {cardType === 'CREDIT_CARD' && approvedCreditLimit != null && (
          <div className="p-6 text-lg border bg-white space-y-6 border-text-primary/20 text-center text-text-primary rounded-2xl mb-6">
            <p className="font-medium">Pre-approved Credit Limit</p>
            <p className="font-semibold text-3xl">
              <span className="line-through"> N</span> {(approvedCreditLimit / 100).toLocaleString()}
            </p>
          </div>
        )}

        {/* Debit: show linked accounts */}
        {cardType === 'DEBIT_CARD' && linkedAccounts && linkedAccounts.length > 0 && (
          <div className="mb-6 space-y-3">
            <p className="text-md text-text-primary font-medium">Your Linked Accounts</p>
            {linkedAccounts.map((account, index) => (
              <div
                key={index}
                className={`p-4 border rounded-xl ${account.primary ? 'border-primary bg-primary/5' : 'border-text-primary/20'}`}
              >
                <p className="font-medium text-text-primary">{account.bankName}</p>
                <p className="text-sm text-text-secondary">
                  {account.accountType} — {account.accountNumberMasked}
                </p>
                {account.primary && (
                  <span className="text-xs text-primary font-medium">Primary</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <p className="text-md text-text-primary">
            Please agree on following T&amp;C for accessing your Instacard
          </p>

          <ul className="flex flex-col gap-[6px] m-0 pl-5 list-disc">
            {TERMS.map((term, index) => (
              <li key={index} className="text-sm">
                {term}
              </li>
            ))}
          </ul>
          <div className="text-md text-text-primary">
            <p>Your can view the detailed terms here :</p>
            <Link target="_blank" className="text-blue" href="#">
              https://demo-link.com
            </Link>
          </div>

          <Checkbox
            label="I agree to the above terms & conditions. Please process my application"
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
        disabled={!acceptedTerms || submitting}
      />
    </div>
  );
}
