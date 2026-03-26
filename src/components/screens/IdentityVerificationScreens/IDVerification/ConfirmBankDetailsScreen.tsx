import React, { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Checkbox, Button } from '@/components/ui'
import FAQModal, { type FAQData } from '@/components/ui/FAQModal'

const TERMS_DATA: FAQData = {
  heading: 'Terms of Service & Privacy Policy',
  bulletPoints: [
    'By using Instacard, you agree to comply with all applicable Nigerian laws and regulations governing electronic payments, financial services, and data protection including the CBN guidelines and NDPR.',
    'Instacard collects and processes personal data including your name, BVN, NIN, date of birth, contact details, biometric data, and financial information for identity verification, KYC compliance, card issuance, and payment processing.',
    'Your personal and financial data is encrypted and stored securely using industry-standard security measures. We will never sell your data to third parties.',
    'We may share your information with regulatory bodies (CBN, NIBSS), partner banks, and payment processors as required for service delivery and legal compliance.',
    'You are solely responsible for maintaining the confidentiality of your PIN, passwords, and account credentials. Report any unauthorized access immediately.',
    'Instacard reserves the right to suspend, limit, or terminate accounts that violate these terms, engage in fraudulent activity, or fail identity verification.',
    'Transaction limits, fees, and charges may apply to your account. Current fee schedules are available in the app and may be updated with prior notice.',
    'You consent to receive SMS, email, and push notifications for transaction alerts, security updates, and service communications.',
    'Instacard is not liable for losses arising from unauthorized transactions where you have failed to safeguard your credentials or report suspicious activity promptly.',
    'These terms may be updated periodically. Continued use of Instacard after changes constitutes acceptance of the revised terms.',
    'For disputes or complaints, contact our support team. Unresolved issues may be escalated to the CBN Consumer Protection Department.',
  ],
}

export default function ConfirmBankDetailsScreen({
  getButtonText,
  handleContinue,
}: {
  getButtonText: () => string,
  handleContinue: () => void,
}) {
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  const handleProceed = () => {
    if (!acceptTerms) return
    handleContinue()
  }

  const formFields = [
    { label: 'First Name', value: 'John', required: true },
    { label: 'Middle Name (Optional)', value: 'Doe', required: false },
    { label: 'Last Name', value: 'Smith', required: true },
    { label: 'BVN', value: '****5678901', required: true },
    { label: 'Date of Birth', value: '**/**/1990', required: true },
    { label: 'Email', value: 'j***@email.com', required: false },
    { label: 'Gender', value: 'Male', required: true },
    { label: 'State (Current Address)', value: 'Lagos', required: true },
    { label: 'City / Town / LGA (Current Address)', value: 'Ikeja', required: true },
    { label: 'Current Address', value: '123 Main Street, Ikeja', required: true },
    { label: 'Account Number', value: '0123456789', required: true },
    { label: 'Phone Number', value: '+234802****0955', required: true },
  ]

  return (
    <div className="flex-1 overflow-auto h-full flex flex-col p-6 py-10">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-text-primary text-center">
        Confirm BVN Details
      </h2>
      <p className="text-sm text-text-secondary mt-2 mb-6 leading-relaxed text-center">
        Here are your BVN details. <br /> Please confirm to complete verification.
      </p>

      {/* Form Fields - Read-only prefilled appearance */}
      <div className="space-y-4">
        {formFields.map((field, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wide">
              {field.label}
              {field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <div className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-sm text-text-secondary">{field.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Consent Checkbox */}
      <div className="mt-6">
        <Checkbox
          label={
            <>
              I authorize Instacard to use the above BVN details for payment processing, card issuance, and identity verification. I agree to the{' '}
              <span
                className="underline text-primary font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowTermsModal(true)
                }}
              >
                Terms of Service and Privacy Policy
              </span>
              .
            </>
          }
          accessibilityLabel="I authorize Instacard to use the above BVN details for payment processing, card issuance, and identity verification. I agree to the Terms of Service and Privacy Policy."
          checked={acceptTerms}
          onChange={setAcceptTerms}
        />
      </div>
      <div className="py-4 bg-background pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-10">
        <Button fullWidth onClick={handleProceed} disabled={!acceptTerms}>
          {getButtonText()}
        </Button>
      </div>

      <FAQModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        data={TERMS_DATA}
      />
    </div>
  )
}
