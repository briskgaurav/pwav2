'use client'

import { useRouter } from 'next/navigation'
import { SheetContainer, Button } from '@/components/ui'
import { routes } from '@/lib/routes'
import { Check, Mail, Shield, CheckCircle2 } from 'lucide-react'
import { useAppSelector } from '@/store/redux/hooks'

export default function WithExistingEmailSuccessPage() {
  const router = useRouter()
  const maskedEmail = useAppSelector((s) => s.user.maskedEmail)
  const email = useAppSelector((s) => s.user.email)

  const handleFinish = () => {
    localStorage.setItem('user', 'true')
    localStorage.setItem('kyc_completed', 'true')
    localStorage.setItem('kyc_email', email)
    localStorage.setItem('kyc_timestamp', new Date().toISOString())
    router.replace(routes.instacard)
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
                You&apos;re All Set!
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed max-w-[280px] mx-auto">
                We will use your existing email <span className="font-semibold">{maskedEmail}</span> for all Instacard communications from now on.
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="w-full space-y-3 mt-4">
            <div className="flex items-center gap-3 p-3 bg-success/5 rounded-xl border border-success/20">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">Email Linked</p>
                <p className="text-xs text-text-secondary">Your existing email will be used</p>
              </div>
              <Check className="w-5 h-5 text-success ml-auto shrink-0" />
            </div>

            <div className="flex items-center gap-3 p-3 bg-success/5 rounded-xl border border-success/20">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">Account Ready</p>
                <p className="text-xs text-text-secondary">Start using Instacard now</p>
              </div>
              <Check className="w-5 h-5 text-success ml-auto shrink-0" />
            </div>
          </div>
        </div>

        <div className="p-4 pb-[calc(env(safe-area-inset-bottom,24px)+24px)] pt-2">
          <Button fullWidth onClick={handleFinish}>
            Go to Instacard
          </Button>
        </div>
      </SheetContainer>
    </div>
  )
}
