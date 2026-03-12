'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SheetContainer, Button, Checkbox } from '@/components/ui'
import { routes } from '@/lib/routes'
import { ShieldCheck } from 'lucide-react'

export default function AcceptTermsScreen() {
  const router = useRouter()
  const [acceptBank, setAcceptBank] = useState(false)
  const [acceptPersonal, setAcceptPersonal] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const allAccepted = acceptBank && acceptPersonal && acceptTerms

  const handleProceed = () => {
    if (!allAccepted) return
    router.push(routes.registrationKycSuccess)
  }

  return (
    <div className="h-screen flex flex-col">
      <SheetContainer>
        <div className="flex-1 flex flex-col p-6 py-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-text-primary text-center">
            Consent &amp; Authorization
          </h2>
          <p className="text-sm text-text-secondary mt-2 mb-8 text-center">
            To complete your KYC, please review and accept the following to save your details on the Instacard database.
          </p>

          <div className="flex flex-col gap-5">
            <Checkbox
              label="I authorize Instacard to collect and store my bank account details securely for payment processing and card issuance."
              checked={acceptBank}
              onChange={setAcceptBank}
            />

            <Checkbox
              label="I consent to provide my personal information (name, date of birth, address) for identity verification purposes."
              checked={acceptPersonal}
              onChange={setAcceptPersonal}
            />

            <Checkbox
              label="I agree to the Terms of Service and Privacy Policy of Instacard."
              checked={acceptTerms}
              onChange={setAcceptTerms}
            />
          </div>
        </div>

        <div className="p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          <Button fullWidth onClick={handleProceed} disabled={!allAccepted}>
            Accept &amp; Continue
          </Button>
        </div>
      </SheetContainer>
    </div>
  )
}
