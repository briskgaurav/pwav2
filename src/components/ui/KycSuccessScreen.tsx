'use client'

import { useRouter } from 'next/navigation'

import { Check, Shield, CreditCard, CheckCircle2 } from 'lucide-react'

import { SheetContainer, Button } from '@/components/ui'
import { routes } from '@/lib/routes'

export default function KycSuccessScreen() {
  const router = useRouter()

  const handleContinue = () => {
    router.push(routes.registrationContinueOrRegister)
  }

  return (
    <div className="h-fit flex flex-col">
      <SheetContainer>
        <div className="flex-1 flex flex-col items-center justify-center p-6 py-10 gap-6 text-center">
          {/* Success Icon with glow effect */}
          <div className="w-full flex relative flex-col items-center justify-start animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-12 h-12 text-success" />
            </div>
            <div className="w-full bg-white/60 backdrop-blur-xl rounded-2xl border-text-secondary/20 space-y-4 py-6 z-5 relative border p-4 text-center mt-4">
              <h1 className="text-lg font-semibold text-text-primary">
                KYC Verified Successfully
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed max-w-[280px] mx-auto">
                Your identity has been verified. You can now proceed to set up your Instacard account.
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="w-full space-y-3 mt-4">
            <div className="flex items-center gap-3 p-3 bg-success/5 rounded-xl border border-success/20">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">Identity Verified</p>
                <p className="text-xs text-text-secondary">Your documents have been approved</p>
              </div>
              <Check className="w-5 h-5 text-success ml-auto shrink-0" />
            </div>

            <div className="flex items-center gap-3 p-3 bg-black/5 rounded-xl border border-black/20">
              <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-black" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">Ready for Instacard</p>
                <p className="text-xs text-text-secondary">Complete your registration</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          <Button fullWidth onClick={handleContinue}>
           Confirm Your Contact Details
          </Button>
        </div>
      </SheetContainer>
    </div>
  )
}
