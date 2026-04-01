import React, { useState, useRef } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Checkbox, Button } from '@/components/ui'
import FAQModal, { type FAQData } from '@/components/ui/FAQModal'
import type { UserData } from '@/types/userdata'

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
  userDetails,
  getButtonText,
  handleContinue,
}: {
  userDetails: UserData['data']
  getButtonText: () => string,
  handleContinue: () => void,
}) {
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showCheckboxHint, setShowCheckboxHint] = useState(false)
  const checkboxRef = useRef<HTMLDivElement>(null)

  const handleProceed = () => {
    if (!acceptTerms) return
    handleContinue()
  }

  const handleDisabledButtonClick = () => {
    if (!acceptTerms && checkboxRef.current) {
      checkboxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setShowCheckboxHint(true)
      setTimeout(() => setShowCheckboxHint(false), 3000)
    }
  }

  const maskBvn = (bvn: string | null) => {
    if (!bvn) return ''
    const digits = bvn.replace(/\D/g, '')
    if (digits.length <= 4) return '****'
    return `****${digits.slice(-4)}`
  }

  const maskEmail = (email: string) => {
    const value = (email ?? '').trim().toLowerCase()
    const [local, domain] = value.split('@')
    if (!local || !domain) return ''
    return `${local[0]}***@${domain}`
  }

  const maskPhone = (phone: string) => {
    const digits = (phone ?? '').replace(/\D/g, '')
    if (digits.length < 4) return ''
    return `+${digits.slice(0, 3)} *** *** ${digits.slice(-4)}`
  }

  // Determine which ID field to show based on user data
  const hasBvn = !!userDetails.bvn_details?.number
  const hasNin = !!userDetails.nin_details?.number

  // Build ID field: BVN takes priority, show NIN only if no BVN
  const getIdField = () => {
    if (hasBvn) {
      return { label: 'BVN', value: maskBvn(userDetails.bvn_details?.number ?? null), required: true }
    } else if (hasNin) {
      return { label: 'NIN', value: userDetails.nin_details?.number ?? '', required: true }
    }
    return null
  }

  const idField = getIdField()

  const formFields = [
    { label: 'Name', value: userDetails.name, required: true },
    ...(idField ? [idField] : []),
    { label: 'Date of Birth', value: userDetails.date_of_birth ?? '', required: true },
    { label: 'Email', value: userDetails.email ? maskEmail(userDetails.email) : '', required: false },
    { label: 'Gender', value: userDetails.gender ?? '', required: true },
    { label: 'State (Current Address)', value: userDetails.state_of_origin ?? '', required: true },
    { label: 'City / Town / LGA (Current Address)', value: userDetails.lga ?? '', required: true },
    { label: 'Current Address', value: userDetails.residential_address ?? '', required: true },
    { label: 'Phone Number', value: userDetails.phone_number ? maskPhone(userDetails.phone_number) : '', required: true },
  ]

  return (
    <div className="flex-1 overflow-auto h-full flex flex-col p-6 pt-10 pb-[15vh]">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-text-primary text-center">
        Confirm {hasBvn ? 'BVN' : 'NIN'} Details
      </h2>
      <p className="text-sm text-text-secondary mt-2 mb-6 leading-relaxed text-center">
        Here are your {hasBvn ? 'BVN' : 'NIN'} details. <br /> Please confirm to complete verification.
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
      <div className="mt-6" ref={checkboxRef}>
        <Checkbox
          label={
            <>
              I confirm that the above {hasBvn ? 'BVN' : 'NIN'} details are mine and I agree to the{' '}
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
          accessibilityLabel={`I authorize Instacard to use the above ${hasBvn ? 'BVN' : 'NIN'} details for payment processing, card issuance, and identity verification. I agree to the Terms of Service and Privacy Policy.`}
          checked={acceptTerms}
          onChange={(checked) => {
            setAcceptTerms(checked)
            if (checked) setShowCheckboxHint(false)
          }}
        />
        {showCheckboxHint && (
          <p className="text-xs text-red-500 pl-7 mt-1.5 animate-pulse">
            Please check this checkbox to continue
          </p>
        )}
      </div>
      <div className=" fixed bottom-0 left-0 right-0 px-4  pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-10">
        <button 
          className={`w-full py-4 rounded-full font-medium ${acceptTerms ? 'bg-primary text-white' : 'bg-disable-button text-white'}`}  
          onClick={acceptTerms ? handleProceed : handleDisabledButtonClick}
        >
          {getButtonText()}
        </button>
      </div>

      <FAQModal
        visible={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        data={TERMS_DATA}
      />
    </div>
  )
}
