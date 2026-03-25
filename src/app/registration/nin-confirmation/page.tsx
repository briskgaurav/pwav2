'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SheetContainer, Button, Checkbox } from '@/components/ui'
import { routes } from '@/lib/routes'
import { ShieldCheck } from 'lucide-react'
import { useAppSelector } from '@/store/redux/hooks'
import FAQModal, { type FAQData } from '@/components/screens/components/ui/FAQModal'

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

export default function NinConfirmationScreen() {
  const router = useRouter()
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const user = useAppSelector((s) => s.user)

  const handleProceed = () => {
    if (!acceptTerms) return
    router.push(routes.registrationContinueOrRegister)
  }

  const formFields = [
    { label: 'First Name', value: user.firstName || 'Your First Name', required: true },
    { label: 'Middle Name (Optional)', value: user.middleName || 'Your Middle Name', required: false },
    { label: 'Last Name', value: user.lastName || 'Your Last Name', required: true },
    { label: 'NIN', value: user.maskedBvn || '', required: true },
    { label: 'Date of Birth', value: user.maskedDob || 'Your date of birth', required: true },
    { label: 'Email', value: user.maskedEmail || 'Your Email Address', required: false },
    { label: 'Gender', value: user.gender || 'Male', required: true },
    { label: 'State (Current Address)', value: user.state || 'State', required: true },
    { label: 'City / Town / LGA (Current Address)', value: user.city || 'Select', required: true },
    { label: 'Current Address', value: user.address || 'Your current residential address', required: true },
    { label: 'Account Number', value: user.accountNumber || '', required: true },
    { label: 'Phone Number', value: user.maskedMobile || '', required: true },
  ]

  return (
    <div className="h-fit flex flex-col">
      <SheetContainer>
        <div className="flex-1 overflow-auto  h-full flex flex-col p-6 py-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-text-primary text-center">
            Confirm NIN Details
          </h2>
          <p className="text-sm text-text-secondary mt-2 mb-6 leading-relaxed text-center">
            Here are your NIN details (00202374093742). <br /> Please confirm to complete KYC.
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
                  I authorize Instacard to use the above bank details for payment processing, card issuance, and identity verification. I agree to the{' '}
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
              accessibilityLabel="I authorize Instacard to use the above bank details for payment processing, card issuance, and identity verification. I agree to the Terms of Service and Privacy Policy."
              checked={acceptTerms}
              onChange={setAcceptTerms}
            />
          </div>
          <div className="py-4 bg-background pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-10">
            <Button fullWidth onClick={handleProceed} disabled={!acceptTerms}>
              Confirm
            </Button>
          </div>
        </div>

      </SheetContainer>

      <FAQModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        data={TERMS_DATA}
      />
    </div>
  )
}
