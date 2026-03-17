'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SheetContainer, Button, Checkbox } from '@/components/ui'
import { routes } from '@/lib/routes'
import { ShieldCheck, Building2, User, CreditCard, Hash, Phone, Mail, MapPin, Calendar } from 'lucide-react'

export default function AcceptTermsScreen() {
  const router = useRouter()
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleProceed = () => {
    if (!acceptTerms) return
    router.push(routes.registrationKycSuccess)
  }

  // Mock bank details - in real app, these would come from KYC verification
  const bankDetails = {
    bankName: 'First Bank of Nigeria',
    accountName: 'Nirdesh Malik',
    accountNumber: '0123456789',
    bvn: '****5678901',
    phoneNumber: '+234 802 **** 0955',
    email: 'nird***malik@gmail.com',
    address: 'Lagos, Nigeria',
    dateOfBirth: '**/**/1990',
  }

  return (
    <div className="h-screen flex flex-col">
      <SheetContainer>
        <div className="flex-1 overflow-auto pb-[25%] flex flex-col p-6 py-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-text-primary text-center">
           Authorize Your Details
          </h2>
          <p className="text-sm text-text-secondary mt-2 mb-6 text-center">
            These details will be saved in your Instacard account for future use.
          </p>

          {/* Bank Details Card */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-border p-4 space-y-4 mb-6">
            {/* <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary">Bank Name</p>
                <p className="text-sm font-medium text-text-primary">{bankDetails.bankName}</p>
              </div>
            </div> */}

            <div className="flex items-center gap-3">
              {/* <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary">Account Name</p>
                <p className="text-sm font-medium text-text-primary">{bankDetails.accountName}</p>
              </div> */}
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary">Account Number</p>
                <p className="text-sm font-medium text-text-primary">{bankDetails.accountNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Hash className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary">BVN</p>
                <p className="text-sm font-medium text-text-primary">{bankDetails.bvn}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary">Phone Number</p>
                <p className="text-sm font-medium text-text-primary">{bankDetails.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary">Email Address</p>
                <p className="text-sm font-medium text-text-primary">{bankDetails.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary">Address</p>
                <p className="text-sm font-medium text-text-primary">{bankDetails.address}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-text-secondary">Date of Birth</p>
                <p className="text-sm font-medium text-text-primary">{bankDetails.dateOfBirth}</p>
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="mt-auto">
            <Checkbox
              label="I authorize Instacard to use the above bank details for payment processing, card issuance, and identity verification. I agree to the Terms of Service and Privacy Policy."
              checked={acceptTerms}
              onChange={setAcceptTerms}
            />
          </div>
        </div>

        <div className="p-4 absolute bottom-0 left-0 right-0 bg-background pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          <Button fullWidth onClick={handleProceed} disabled={!acceptTerms}>
            Accept &amp; Continue
          </Button>
        </div>
      </SheetContainer>
    </div>
  )
}
